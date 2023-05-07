const express = require("express");
const app = express();
const cors = require("cors");
require('./db/config');
const User = require("./db/user");
const Product = require("./db/product");
const multer = require('multer');
const upload = multer({dest : 'uploads/'});
const bodyParser = require('body-parser');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
})

app.post("/login", async (req, res) => {
    console.log(req.body);
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            res.send(user);
        }
        else {
            res.send({ result: "No user found" })
        }
    } else {
        res.send({ result: "No user found" })
    }
})

app.post("/add-product", (req, res) => {
    
    let product = new Product(req.body);
    let result = product.save();
    res.send(result);
})

app.get("/products", async (req, res) => {
    const products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    }
    else {
        res.send({ result: "No product found" })
    }
})

app.delete("/product/:id", async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
})

app.get("/product/:id", async (req, res) => {
    let result = await Product.findOne({email: req.params.email });
    if (result) {
         res.send(result)
    }
    else {
        res.send({ "result": "No result found" })
    }
})

app.put("/product/:id", async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.send(result)
})

app.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [
            {
                arttype: { $regex: req.params.key }
            }
            ,
            {
                artistname: { $regex: req.params.key }
            }
            ,
            {
                email: { $regex: req.params.key }
            }
        ]
    });
    res.send(result);
})
app.listen(5000);