const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

//***************************************validation for req.body**********************************************
const isValidValue = function (value) {
  //it should not be like undefined or null.
  if (typeof value === "undefined" || value === null) return false; //if the value is undefined or null it will return false.
  if (typeof value === "string" && value.trim().length === 0) return false; //if the value is string & length is 0 it will return false.
  return true;
};

const isValidDetails = function (details) {
  return Object.keys(details).length > 0;
};
//***************************************validation for title******************************************
let isValidTitle = (title) => {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

//**********************************01***CREATE USER****************************************************
const createUser = async function (req, res) {
  try {
    const user = req.body;
    if (!isValidDetails(user)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide user details" });
    }
    const { title, name, phone, email, password } = user;

    if (!isValidValue(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide title" });
    }

    if (!isValidValue(name)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide name" });
    }

    if (!isValidTitle(title)) {
      return res
        .status(400)
        .send({ status: false, msg: "title should be mr,mrs,miss" });
    }

    if (!isValidValue(phone)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide phone" });
    }
    const duplicatePhone = await userModel.findOne({ phone: phone });
    if (duplicatePhone) {
      return res
        .status(400)
        .send({ status: false, msg: `phone no. ${phone} already exists` });
    }

    if (!isValidValue(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide email" });
    }
    const duplicateEmail = await userModel.findOne({ email: email });
    if (duplicateEmail) {
      return res
        .status(400)
        .send({ status: false, msg: `Email Id ${email} already exists` });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res
        .status(400)
        .send({ status: false, msg: `${email} is an invalid email` });
    }

    if (!isValidValue(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "please provide password" });
    }

    const data = await userModel.create(user); //creating the Book details
    res
      .status(201)
      .send({
        status: true,
        msg: "User details saved successfully",
        data: data,
      });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};


//______________________________________________________________________________________________________________
const login = async function (req, res) {
  try {
    let login = req.body;
    if (!isValidDetails(login)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide login Details" }); //validating the parameters of body
    }
    const { email, password } = login;
    if (!isValidValue(email)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the Email Address" }); //Validate the that is provided by the Client.
    }
    if (!isValidValue(password)) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide the password" }); //checks that the password is correct or not.
    }
    let isValidUser = await userModel.findOne({ email, password }); //finding the email/password in the authors.
    if (!isValidUser) {
      return res
        .status(401)
        .send({
          status: false,
          msg: "Email or Password is not correct, Please check your credentials again.",
        });
    }
    let token = jwt.sign(
      //creating the token for the authentication.
      {
        _id: isValidUser._id, //payload(details that we saved in this token)
      },
      "Project-Books",
      { expiresIn: "30000mins" }
    ); //secret key
    res.setHeader("x-api-key", token); //setting token to header
    res
      .status(200)
      .send({
        status: true,
        message: `User logged in successfully`,
        data: { token },
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

module.exports.createUser = createUser;
module.exports.login = login;
