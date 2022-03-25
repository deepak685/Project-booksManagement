const express = require("express")
const app = express()
app.use(express.json())

const bodyParser = require("body-parser")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const route = require("../src/routes/route")
app.use("/", route)

const mongoose = require("mongoose")
const url = "mongodb+srv://Deependra1999:Z1ZWVlMvcAFQsu2u@cluster0.4nkid.mongodb.net/book-project"
mongoose.connect(url, { useNewUrlParser: true })
    .then(() => console.log("database is successfully connect"))
    .catch(err => console.log(err))

app.listen(5000, () => console.log("app running on port 5000 successfully"))