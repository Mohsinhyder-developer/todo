require("dotenv").config();

const express = require("express");
const app = express();
const userModel = require("./models/user");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("signup");
});

app.post("/create", async (req, res) => {
  const { username, email, password, age } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return res.render("signup", { errorMessage: "Email already exists. Please try a different one." });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await userModel.create({
      username,
      email,
      password: hash,
      age,
    });

    const token = jwt.sign({ email }, "shhhhhhhhhh");
    res.cookie("token", token);
    res.render("login");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the user.");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Entered email or password is incorrect");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const token = jwt.sign({ email: user.email }, "shhhhhhhhhh");
      res.cookie("token", token);
      res.redirect("/profile");
    } else {
      res.status(400).send("The username or password is incorrect. Please try again");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during login.");
  }
});

app.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, "shhhhhhhhhh");
    req.user = data;
    next();
  } catch (error) {
    console.error(error);
    res.redirect("/login");
  }
}

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
