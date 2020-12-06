const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const CONSTS = require("./components/constants");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(require("./components/user-account"));
app.use(require("./components/user-posts"));
app.use(require("./components/public-profiles"));
app.use(require("./components/follow-unfollow"));


app.listen(CONSTS.PORT, () => {
    console.log(`Listening at port ${CONSTS.PORT}...`);
})
