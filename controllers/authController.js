const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async(req, res) => {
   try {
     // console.log(req.body);
    const { email, name, password , phoneNumber} = req.body;

    //normalize brfore saving to db
    const normalizedEmail = email.trim().toLowerCase();
   

    //check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User with this email already exists"
        });
    }   

//hash the password before saving to db
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email: normalizedEmail,
        name: name,
        password: hashedPassword,
        phoneNumber
    });

    res.status(201).json({
       message: "User created successfully",
       data:user
    });
   } catch (error) {
     res.status(500).json({
        message: error.message
     });
   }
};
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid credentials"
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    
    res.json({token, user});
    } catch (error) {
        console.error("something went wrong ");
        res.status(500).json({
            message: error.message
        });
    }
}