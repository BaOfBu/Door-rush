import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import hbs_sections from "express-handlebars-sections";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import userRoutes from "./routes/user/index.route.js";
import adminRoutes from "./routes/admin/index.route.js";

const port = 8888;
const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
);

dotenv.config();
mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);
mongoose.connect(process.env.MONGODB_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true}).then(function() {
        console.log("Successfully connected to the database");    
    }).catch(function(err) {
        console.log('Could not connect to the database. Exiting now...', err);
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
        }
    }
});

app.engine("hbs", hbs);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use("/static", express.static("static"));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});