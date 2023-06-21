const express = require('express');
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//database
const db = require("./app/models");
db.sequelize.sync();

//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to application." });
  });

//routes
require('./app/routes/auth.routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
