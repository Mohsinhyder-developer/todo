const express = require('express');
const app = express();
const userModel = require('./models/user');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/', (req, res) =>{
    res.render('signup');
});
app.post('/create', (req, res) => {
    let {username, email, password, age} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {

            let createdUser = await userModel.create({
                username,
                email,
                password: hash,
                age
            
              })

              let token = jwt.sign({email}, "shhhhhhhvhhh");
              res.cookie("token", token);
              res.render('login');
        })
    })
    
    
});


app.get("/login", (req ,res) =>{
    res.render('login');  
  });
  
  app.post("/login", async (req ,res) =>{
      let user = await userModel.findOne({email: req.body.email});
      if(!user) return res.send("Entered email or password is incorrect");
  
      bcrypt.compare(req.body.password, user.password, function(err, result){
          if(result){
              let token = jwt.sign({email: user.email}, "shhhhhhhhhh");
              res.cookie("token", token);
              res.redirect("profile");
          }
          else res.send("Entered email or password is incorrect");
      });
    });
    app.get("/", async (req, res) =>{
        let users = await userModel.find();
        res.render("read", {users});
    })

    app.get("/profile",isLoggedIn, (req ,res) =>{
        res.render('profile');  
      });
  
  app.get("/logout", (req, res) =>{
      res.cookie("token","");
      res.redirect("/");
  });
  function isLoggedIn(req, res, next){
    if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "shhhhhhhhhh");
        req.user = data;
        next();
    }
 
}


app.listen(3000);