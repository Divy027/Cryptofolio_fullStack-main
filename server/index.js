const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { header } = require("express-validator");
const dashboardRouter = require("./Routes/Dashboard");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: process.env.HOST,
    credentials: true,
  })
);

//---------------mongoose connection----------------//

const Connection_url = process.env.DATABASE;
const PORT = process.env.PORT;

mongoose
  .connect(Connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`running ${PORT}`)))
  .catch((error) => console.log(error.message));

mongoose.set("strictQuery", true);
mongoose.set("strictQuery", true);

//---------------mongoose connection----------------//

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.HOST);
  res.header(
    "Access-Control-Allow-Origin",
    "Origin,X-Requested-With,Content-Type,Accept",
    "Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS, POST"
  );
  next();
});

app.use(express.json());
app.use("/dashboard", dashboardRouter);
app.use("/dashboard", require("./Routes/Userdetails"));
app.use("/dashboard", require("./Routes/ProfileUpdate"));

app.use("/register", require("./Routes/CreatUser"));
app.use("/register", require("./Routes/Signin"));

app.use("/transactions", require("./Routes/Transactions"));
app.use("/wallet", require("./Routes/Wallet"));
