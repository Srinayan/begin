const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT||3000;
const bodyParser = require('body-parser');
const fs =  require('fs')

app.use(bodyParser.json());

app.get('/', (req, res) => res.sendStatus(404));
 
app.get('/products/:product_name',function(req,res){
    res.sendFile("/Users/Srinayan/Documents/Celigo/expressapp/products/" + req.params.product_name + ".json");
})
app.put('/products/:product_name',function(req,res){
    var putData = req.body;
    fs.writeFile("/Users/Srinayan/Documents/Celigo/expressapp/products/" + req.params.product_name + ".json", JSON.stringify(putData),function(err){
        if(err) throw err;
    });
    res.send("Data received");
})
app.post('/products/:product_name',function(req,res){
    var postData = req.body;
    fs.writeFile("/Users/Srinayan/Documents/Celigo/expressapp/products/" + req.params.product_name + ".json", JSON.stringify(postData), function (err) {
        if (err) throw err;
    });
    res.send("Data received");
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))