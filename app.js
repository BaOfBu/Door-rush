import express from "express";
session;
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import mongoose from "mongoose";
import dotenv from "dotenv";
//import genuuid from "uuid/v4";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import conversationService from "./services/merchant/chat.service.js";
//import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
const __dirname = dirname(fileURLToPath(import.meta.url));

import userRoutes from "./routes/user/index.route.js";
import adminRoutes from "./routes/admin/index.route.js";
import merchantRoutes from "./routes/merchant/index.route.js";

import auth from "./middleware/auth.mdw.js";

const port = 8888;
const portSocket = 6666;
const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

dotenv.config();
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);
mongoose
    .connect(process.env.MONGODB_URL)
    .then(function () {
        console.log("Successfully connected to the database");
    })
    .catch(function (err) {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// Create an instance of the express-handlebars
const hbs = engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views"),
    partialsDir: [
        path.join(__dirname, "views/user/partials"),
        path.join(__dirname, "views/merchant/partials"),
        path.join(__dirname, "views/admin/partials")
    ],
    helpers: {
        section: hbs_sections(),
        format_number(val) {
            return numeral(val).format("0,0");
        },
        equal(value1, value2) {
            return value1 == value2;
        },
        json: function (context) {
            return JSON.stringify(context);
        },
        log: function (context) {
            console.log(context);
        }
    }
});

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", "./views");

app.set("trust proxy", 1);
app.use(session({
        // genid: function(req) {
        //     console.log('session id created');
        //     return genuuid();},
        secret: "New Session",
        resave: false,
        saveUninitialized: true,
        cookie: {}
    })
);

app.use(function (req, res, next) {
    if (typeof req.session.numberItem === "undefined") {
        req.session.numberItem = 0;
    }
    if (typeof req.session.order === "undefined") {
        req.session.order = "";
    }
    res.locals.order = req.session.order;
    res.locals.numberItem = req.session.numberItem;
    next();
});

app.use(function (req, res, next) {
    // console.log(req.session.auth);
    if (typeof req.session.auth === "undefined") {
        req.session.auth = false;
    }
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
});

app.use("/static", express.static("static"));
// app.use("/account/login",userRoutes);
app.use("/account/logout",auth.authLogout, userRoutes);
app.use("/merchant",auth.authMerchant,merchantRoutes);
app.use("/admin",auth.authAdmin,adminRoutes);
app.use("/",auth.authUserforStart,userRoutes);


// // auth for login
// app.use(function (req, res, next) {
//     if (typeof req.session.auth === "undefined") {
//         req.session.auth = false;
//     }

//     res.locals.auth = req.session.auth;
//     res.locals.authUser = req.session.authUser;
//     next();
// });

const httpServer = app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});

const io = new Server(httpServer, {
    connectionStateRecovery: {},
    //adapter: createAdapter()
});
var connectedUsers = {};

io.on('connection',function(socket){

/*Register connected user*/
    console.log('a user connected');
    socket.on('register',function(username){
        console.log('User registered: ' + username);
        socket.username = username;
        connectedUsers[username] = socket;
    });
    socket.on('disconnect',function(){
        console.log('user disconnected');
        delete connectedUsers[socket.username];
    });
    socket.on('chat message', async function(data){
        //console.log(connectedUsers);
        console.log('Message from: ' + socket.username + ' to ' + data.to);
        const to = data.to;
        const message = data.message;
        const timestamp = data.time;
        console.log("timestamp type ",typeof timestamp);
        //console.log(to);
        const conver = await conversationService.findConversation(socket.username, to);
        //console.log(conver);
        if (conver) {
            await conversationService.addMessage(conver._id, socket.username, message, timestamp);
        }

        if(connectedUsers.hasOwnProperty(to)){
            connectedUsers[to].emit('chat message',{
                //The sender's username
                username : socket.username,

                //Message sent to receiver
                message : message,
                time: timestamp
            });
        }
    });
});
