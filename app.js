import express from 'express';
import { engine } from 'express-handlebars';

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 8888
const app = express()

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
      format_number(val) {
        return numeral(val).format('0,0');
      }
    }
}));

app.set('view engine', 'hbs');
app.set('views',  __dirname + '/views/user/');

app.use('/static', express.static('static'));
app.get('/', function (req, res) {
    res.render('home');
})

app.listen(port, function serverStartedHandler() {
    console.log(`Door-rush server is running at http://localhost:${port}`);
});