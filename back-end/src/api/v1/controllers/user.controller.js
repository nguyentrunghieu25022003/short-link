const bcrypt = require("bcryptjs");
const User = require("../../../models/user.model");
const { createAccessToken, createRefreshToken } = require("../../../middlewares/jwt");

module.exports.handleRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(401).send("Email is already in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(200).send({ message: "Register successful " });
  } catch (err) {
    res.status(500).send("Error register: " + err.message);
  }
};

module.exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found !");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Invalid password !");
    }
    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 12 * 30* 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/"
    });
    res.status(200).send({ message: "Login successful", user: user });
  } catch (err) {
    res.status(500).send("Error login: " + err.message);
  }
};
