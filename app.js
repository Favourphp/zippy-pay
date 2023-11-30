require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const walletRoutes = require('./routes/walletRoutes');

const port = process.env.PORT || 5000;
const app = express();

const authRoute = require("./routes/userRoute");
// app.use('/wallet', walletRoutes);


//call the database
require("./config/db");

app.use(
    express.urlencoded({
      extended: false,
    })
  );

  app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );

  app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// endpoint for the user registration and login
app.use("/api/user", authRoute);

app.listen(port, () => {
    console.log(`server running on ${port}`);
  });