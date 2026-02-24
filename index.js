const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
const UserData = [];

const JWT_SECRET = "123456@WDFGBN"
// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//     let token = ""; 
//     for (let i = 0; i < 32; i++) {
//         // use a simple function here
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// }

function auth(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({
                    message: "Unauthorized"
                })
            } else {
                req.user = decoded;
                next();
            }
        })
    } else {
        res.status(401).send({
            message: "Unauthorized"
        })
    }
}

app.get("/", function(req, res) {
    res.sendFile(__dirname+ "/public/index.html")
})

app.post("/signup",(req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    UserData.push({
        username,
        password
    })
    res.send({
        message: "You are Signedin !"
    })
})

app.post("/signin",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const user = UserData.find(user =>
        user.username === username && user.password === password
    )
    if(user){
        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);

        user.token = token;
        res.send({
            token
        })
        console.log(UserData);
    }
    else{
        res.status(403).send({
            message:"Invalid Username Or Password"
        })
    }
})

// app.get("/me",(req,res) =>{
//     const token = req.headers.token;
//     const user = UserData.find(user=>
//         user.token === token
//     )
//     if(user){
//         res.send({
//             username: user.username,
//             password: user.password
//         })
//     } else {
//         res.status(401).send({
//             message: "Unauthorized"
//         })
//     }
// })


// app.get("/me", (req, res) => {
//     const token = req.headers.token;
//     const userDetails = jwt.verify(token, JWT_SECRET);

//     const username =  userDetails.username;
//     const user = UserData.find(user => user.username === username);

//     if (user) {
//         res.send({
//             username: user.username
//         })
//     } else {
//         res.status(401).send({
//             message: "Unauthorized"
//         })
//     }
// })

// app.get("/me", auth, (req, res) => {
//     const user = req.user;

//     res.send({
//         username: user.username
//     })
// })

app.get("/me", auth, (req, res) => {
    const user = req.user;

    res.send({
        username: user.username
    })
})



app.listen(3000);