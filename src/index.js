const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use("/", route);
app.use(bodyParser.urlencoded({ extended: true }));

const url =
  "mongodb+srv://Deependra1999:Z1ZWVlMvcAFQsu2u@cluster0.4nkid.mongodb.net/PROJECT3";
mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log("Connection error"));

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
