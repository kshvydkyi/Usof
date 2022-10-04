const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express();
const port = process.env.PORT || 3500;

app.use(cors(corsOptions));
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

