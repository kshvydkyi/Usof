const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 3500;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./middleware/passport')(passport)


const routes = require('./settings/routes');
 routes(app);

// starting the server
app.listen(port, () => {
    console.log(`listening http://localhost:${port}/`);
});

