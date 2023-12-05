import express from "express";
import { engine } from "express-handlebars";
import path from "path";
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
