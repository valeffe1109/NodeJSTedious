const express = require("express")
const fs = require("fs-extra")
const shortid = require("shortid")
const connection = require('../db')
const Request = require("tedious").Request
const Types = require("tedious").TYPES

const router = express.Router();

router.get("/:username", (req, res)=>{

  var cartContent = `SELECT * FROM GetShoppingCart('${req.params.username}')`
  var cart = [];
  var request = new Request(cartContent, (err, rowCount, rows) =>{
    if (err) res.send(err)
    else res.send({ books: cart, total: cart.map(x => x.Total).reduce((x,y) => x+y,0)})
  })

  var cart = []
  request.on("row", (columns) =>{
  
    var shoppingCartElement = {}
    columns.forEach(column =>{
        shoppingCartElement[column.metadata.colName] = column.value
    })
    cart.push(shoppingCartElement)
  })

  connection.execSql(request);
})


router.delete("/:username/delete/:bookId", (req, res)=> {
  var deleteQuery = `DELETE TOP (${req.body.number ? req.body.number : 1})
                     FROM ShoppingCart 
                     WHERE Username = '${req.params.username}' AND FK_Book = '${req.params.bookId}'`

  var request = new Request(deleteQuery, (err, rowCount) =>{
    if (err) res.send(err)
    else {
      if (rowCount > 0)
        res.send("Element deleted")
      else 
        res.status(404).send("Cannot find item in the cart")
    }
  })

  connection.execSql(request);
})

module.exports = router