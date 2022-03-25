const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")



//***************************************validation for req.body**********************************************
let isValidRequestBody = requestBody => {
    return Object.keys(requestBody).length > 0
}

//***************************************validation for req.body.properties***********************************
let isValid = value => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

//***************************************validation for title******************************************
let isValidTitle = title => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}


//**********************************01***CREATE USER****************************************************


const createUser = async(req, res) => {
    try {
        if (!isValidRequestBody(req.body))
            return res.status(400).json({ status: false, msg: "Invalid parameters ,please provide user details" })

        const { title, name, phone, email, password, address } = req.body

        if (!isValid(title))
            return res.status(400).json({ status: false, msg: "title is required" })

        if (!isValidTitle(title))
            return res.status(400).json({ status: false, msg: "title is not valid" })

        if (!isValid(name))
            return res.status(400).json({ status: false, msg: "name is required" })

        if (!isValid(phone))
            return res.status(400).json({ status: false, mgs: "phone is reuired" })

        if (!(/^[6-9]\d{9}$/gi.test(phone)))
            return res.status({ status: false, msg: `${phone}not a valid phone number` })

        let phoneUsed = await userModel.findOne({ phone })

        if (phoneUsed)
            return res.status(400).json({ status: false, msg: `${phone} number is already registered` })

        if (!isValid(email))
            return res.status(400).json({ status: false, msg: `email is required` })

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
            return res.status(400).json({ status: false, msg: `${email} is not valid` })

        const emaidUsed = await userModel.findOne({ email })

        if (emaidUsed)
            return res.status(400).json({ status: false, msg: `${email} is used already` })

        if (!isValid(password))
            return res.status(400).json({ status: false, message: `Password is required` })


        if (!(/[a-zA-Z0-9@]{8,15}/.test(password)))
            return res.status(400).json({ status: false, message: `password length should be between 8-15` })

        if (!isValid(address))
            return res.status(400).json({ status: false, msg: "address is required" })


        const userCreated = await userModel.create(req.body)

        res.status(201).json({ status: true, msg: "user cereated succefully", data: userCreated })

    } catch (err) {
        res.status(500).json({ status: false, msg: "something went wrong", err: err.message })
    }
}

module.exports.createUser = createUser


//*********************************02***LOGINUser**********************************************************

const login = async(req, res) => {
    try {
        if (!isValidRequestBody(req.body))
            return res.status(400).json({ status: false, msg: "invalid parameters" })

        const { email, password } = req.body;

        if (!isValid(email))
            return res.status(400).send({ status: false, message: `Email is required` })

        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })


        if (!isValid(password))
            return res.status(400).send({ status: false, message: `Password is required` })


        const user = await userModel.findOne({ email, password });
        if (!user)
            return res.status(401).send({ status: false, message: `Invalid login credentials` });


        let payload = { _id: user._id }
        let token = await jwt.sign(payload, 'Project-Books', { expiresIn: '30000mins' })
        res.header('x-api-key', token);

        res.status(200).send({ status: true, message: `User logged in successfully`, data: { token } });
    } catch (err) {
        res.status(500).json({ status: false, msg: "something went wrong", err: err.message })
    }
}

module.exports.login = login