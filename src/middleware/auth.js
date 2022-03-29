const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");

const authentication = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ msg: "Token must be present" });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

//02__________________________________________________________________________________________________________
const authorizationToCreateBook = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "token must be present." });
    }
    const decodedToken = jwt.verify(token, "Project-Books");
    const userLoggedIn = decodedToken._id;
    const userIdFromBody = req.body.userId;

    if (!userIdFromBody) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the User Id." }); //UserID is mandory
    }
    if (userLoggedIn !== userIdFromBody)
      return res.status(403).send("You are not autherised to access.");
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};


//03_________________________________________________________________________________________________________

const authorization = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "token must be present." });
    }
    const decodedToken = jwt.verify(token, "Project-Books");
    const userLoggedIn = decodedToken._id;
    const bookId = req.params.bookId;
    const findBook = await bookModel.findById(bookId);
    if (!findBook) {
      return res.status(404).send({ status: true, msg: "no book found" });
    }
    const userIdFromBook = findBook.userId.toString();
    if (userLoggedIn !== userIdFromBook)
      return res.status(403).send("You are not autherised to access.");
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorizationToCreateBook = authorizationToCreateBook;
module.exports.authorization = authorization;
