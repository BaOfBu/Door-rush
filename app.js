import express from "express";
import { engine } from "express-handlebars";

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 8888
const app = express()

app.use(
  express.urlencoded({
      extended: true
  })
);

app.engine("hbs", engine({
    extname: "hbs",
    defaultLayout: "main",
    helpers: {
      format_number(val) {
        return numeral(val).format("0,0");
      },
      equal(value1, value2) {
        return value1 == value2;
      }
    }
}));

app.set("view engine", "hbs");
app.set("views", "./views/user");

app.use("/static", express.static("static"));

app.get("/", function(req, res) {
  res.render("home", {
      user: false,
      type: "home",
      userName: "Họ và tên"
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
      user: true,
      type: "contact",
      userName: "Họ và tên"
  });
});

app.get("/food", function(req, res) {
  res.render("food", {
      user: true,
      type: "food",
      userName: "Họ và tên"
  });
});

app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});