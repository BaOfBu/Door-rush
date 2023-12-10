import express from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import userRoutes from "./routes/user/index.route.js";
import adminRoutes from "./routes/admin/index.route.js";

import auth from "./middleware/auth.mdw.js";


const port = 8888;
const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);

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
        }
    }
});

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use("/static", express.static("static"));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use(function (req, res, next) {
    if (typeof (req.session.auth) === 'undefined') {
      req.session.auth = false;
    }
  
    res.locals.auth = req.session.auth;
    res.locals.authUser = req.session.authUser;
    next();
});

app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});
