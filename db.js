// Connection to DB 
var Connection = require('tedious').Connection
var Request = require('tedious').Request

var config = {
    server:'strivedb.database.windows.net',
    authentication:{
        type:'default',
        options:{
            userName:'strivedb',
            password:'oirelavocsuf-A1'
        }
    },
    options:{
        database:'strivestudents'
    }
}


var connection = new Connection(config)
connection.on('connect', err =>{
  if (err) console.log(err)
  else console.log("connected")
})

var reset=()=>{
    connection = new Connection(config)
}

module.exports = connection;