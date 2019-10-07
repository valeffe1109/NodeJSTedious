const express= require('express')
const cors = require('cors')
const studentsRoute  = require('./services/students')
const productsRoute = require('./services/products')
const connection = require("./db")
var Request = require('tedious').Request
const server = express()

server.set("port", process.env.PORT || 3450)
server.use(express.json())

server.use("/students", cors(), studentsRoute)

server.use('/products' , cors(), productsRoute)


server.listen(server.get('port'), () => {
    console.log("SERVER IS RUNNING ON " + server.get("port"))
})