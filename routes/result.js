const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const data = require("../data/users");
const app = express();

var flag=1;
app.use(cookieParser());
app.use(bodyParser.json());

var authenticated = false;
const authenticate = function authenticate(req, res, next) {

    if (req.cookies.name === 'AuthCookie') {
        next()
    }
    else { res.status(403).render("welcome/error", { title: "ERROR : 403 Forbidden" }) }
};

router.get("/", (req, res) => {
    //console.log(req.cookies)
    if (req.cookies.name === 'AuthCookie' && flag==0) {
        res.redirect("/private");
    }
    else {
        app.set("view", "/views");
        res.render('welcome/login');
        flag=0;
    }
});

router.post("/login", (req, res, next) => {

    let user = req.body.username;
    let password = req.body.password;

    if (user && password) {
        userCheck = data.checkUsername(user);
        passCheck = data.matchPassword(user, password);
        if (userCheck && passCheck.status) {
            flag=0;
            res.cookie('name', 'AuthCookie')
            let user = {
                userabc: passCheck.user.userabc,
                username: passCheck.user.username,
                FirstName: passCheck.user.FirstName,
                LastName: passCheck.user.LastName,
                Profession: passCheck.user.Profession,
                Bio: passCheck.user.Bio
            }
            req.session.user = user
            res.redirect("/private")
        }
        else {
            res.render("welcome/login",
                {
                    message: "Did not provide valid Username/Password",
                    status: false
                }
            )
        }

    }
});

router.get("/private", (req, res, next) => {

    let user = req.session.user;
    res.render("welcome/private",
        {
            user,
            title: "Hello"
        })

});

router.get("/logout", (req, res, next) => {
    res.clearCookie("name")
    flag=1;
    res.render("welcome/logout");
});


module.exports = router;
