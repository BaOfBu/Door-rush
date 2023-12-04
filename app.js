import express from 'express';
import { engine } from 'express-handlebars';

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 8888
const app = express()

app.get('/', function (req, res) {
    res.send("Hello Door-rush");
  })

app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});