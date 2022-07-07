const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(require("./components/user-account"));
app.use(require("./components/user-posts"));
app.use(require("./components/public-profiles"));
app.use(require("./components/follow-unfollow"));
app.use(require("./components/message"));

app.listen(parseInt(process.env.PORT), () => {
    console.log(`Listening at port ${parseInt(process.env.PORT)}...`);
})
