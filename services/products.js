const express = require('express')
const Request = require("tedious").Request
const connection = require('../db')
const Types = require("tedious").TYPES
const fs = require("fs-extra")
const router = express.Router()


router.get("/", async (req, res) => {
    var selectProducts = "SELECT * FROM Products"
    if (req.query.Name)
      selectProducts += " WHERE Name = '" + req.query.Name + "'";

      console.log(selectProducts)

    var request = new Request(selectProducts, (err, rowCount, rows) =>{
      if(err) res.send(err)
      else res.send(Products)
    })

    var Products = [];
    request.on('row', (columns) => { //every time we receive back a row from SQLServer
      var Product = {}
      columns.forEach(column =>{
        Product[column.metadata.colName.toLowerCase()] = column.value //add property to the Product object
      })
      Products.push(Product);
    })
    connection.execSql(request); //Execute Query
})

router.get("/:id", async (req, res) => {
  var selectProducts = "SELECT * FROM Products WHERE ProductsID = @ProductsID"
  var request = new Request(selectProducts, (err, rowCount, rows) =>{
    if(err) res.send(err)
    else {
        if (rowCount == 1)
           res.send(Product)
        else
              res.status(404).send("Cannot find element " + req.params.id)
    }
  })

  var Product= {};
  request.on('row', (columns) => {
    columns.forEach(column =>{
      Product[column.metadata.colName.toLowerCase()] = column.value 
    })
  })
  request.addParameter("ProductsID", Types.NVarChar, req.params.id)

  connection.execSql(request); //Execute Query
})


router.post("/", async (req, res) => {
    var selectProducts= `INSERT INTO Products (productName, Description, Price,ImageURL)
                         VALUES ('${req.body.productName}', '${req.body.Description}', '${req.body.Price}','${req.body.ImageURL}')`

    var request = new Request(selectProducts, (err) =>{ 
        if(err) res.send(err)
        else res.send("Product Added")
     })
    connection.execSql(request); //Execute Query
})

// ADD A ROUTE FOR AN IPOTETIC SHOPPING CART WITHOUT USER

router.post('/:id/addToCart' , (req,res) => {

    var addToCart = `INSERT INTO ShoppingCart (FK_PRODUCT) VALUES (${req.params.id})`
    var request = new Request(addToCart, (err)=>{
        if(err) res.send(err)
        else res.send('Added')
    })
    connection.execSql(request);
})

router.get('/ShoppingCart' ,(req,res) =>{

    var cartContent = `SELECT ProductID, productName,  Price , ImageURL , COUNT(*) AS QUANTITY ,Price * COUNT(*) AS TOTAL
    FROM SHOPPINGCART JOIN Products ON FK_Product = ProductID
    GROUP BY ProductID , ProductName , Price , ImageURL `
    var cart = [];

    var request = new Request(cartContent ,(err) =>{
        if (err) res.send(err)
        else res.send(cart)
    })
    connection.execSql(request);
})


router.delete("/ShoppingCart", async (req, res) => {
    var request = new Request("DELETE  FROM ShoppingCart",
    (err, rowCount, rows)=>{
        if (err) res.send(err)
        else res.send("Rows deleted: " + rowCount)
    })
    connection.execSql(request);
})








module.exports = router