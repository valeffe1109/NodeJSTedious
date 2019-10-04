const express= require('express')
const cors = require('cors')
const studentsRoute  = require('./services/students')
const connection = require("./db")
var Request = require('tedious').Request
const server = express()

server.set("port", process.env.PORT || 3450)
server.use(express.json())

server.use("/students", cors(), studentsRoute)

server.use('/test',(req,res) =>{

    var selectStudents = 'SELECT * FROM STUDENTS'
    var request = new Request(selectStudents ,(err , rowCount, rows)=>{
       if(err)console.log(err)
       else console.log(rowCount) 
    })
    connection.execSql(request)
})


server.listen(server.get('port'), () => {
    console.log("SERVER IS RUNNING ON " + server.get("port"))
})