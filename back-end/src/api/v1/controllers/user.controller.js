const bcrypt = require("bcryptjs");
const User = require("../../../models/user.model");
const { createAccessToken, createRefreshToken } = require("../../../middlewares/jwt");

module.exports.handleSignUp = async (req, res) => {
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

module.exports.handleSignIn = async (req, res) => {
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
      expires: new Date(Date.now() + 15 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      path: "/"
    });

    res.status(200).send({
      message: "Login successful",
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).send("Error login: " + err.message);
  }
};

module.exports.handleCheckToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1] || req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Token is required" });
    }
    res.json({ message: "Success", token: req.cookies });
  } catch (err) {
    res.status(500).send("Message: " + err.message);
  }
};

module.exports.releaseAccessToken = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1] || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is required" });
    }

    if(!accessToken) {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decodedRefresh) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token, please log in again." });
        }
  
        const newAccessToken = createAccessToken(decodedRefresh.id);
  
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 15 * 60 * 1000),
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          path: "/"
        });

        return res.status(200).json({ message: "Token is valid", accessToken: newAccessToken });
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Token not valid: " + err.message });
  }
};

module.exports.handleLogOut = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.status(200).send({ message: "Logged out successful" });
  } catch (err) {
    res.status(500).send("Error logging out: " + err.message);
  }
};