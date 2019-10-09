const express = require('express')
const Request = require("tedious").Request
const connection = require('../db')
const Types = require("tedious").TYPES
const fs = require("fs-extra")
const router = express.Router()
const {reset} = require('../db')


router.get('/reset' , async (req,res) => {
       
     reset()
})




router.get("/", async (req, res) => {
  var selectStudents = "SELECT * FROM STUDENTS"
  if (req.query.Name)
    selectStudents += " WHERE Name = '" + req.query.Name + "'";

  console.log(selectStudents)

  var request = new Request(selectStudents, (err, rowCount, rows) => {
    if (err) res.send(err)
    else res.send(Students)
  })

  var Students = [];
  request.on('row', (columns) => { //every time we receive back a row from SQLServer
    var Student = {}
    columns.forEach(column => {
      Student[column.metadata.colName.toLowerCase()] = column.value //add property to the Student object
    })
    Students.push(Student);
  })
  connection.execSql(request); //Execute Query
})

router.get("/:id", async (req, res) => {
  var selectStudents = "SELECT * FROM STUDENTS WHERE StudentsID = @StudentsID"
  var request = new Request(selectStudents, (err, rowCount, rows) => {
    if (err) res.send(err)
    else {
      if (rowCount == 1)
        res.send(student)
      else
        res.status(404).send("Cannot find element " + req.params.id)
    }
  })

  var student = {};
  request.on('row', (columns) => {
    columns.forEach(column => {
      student[column.metadata.colName.toLowerCase()] = column.value
    })
  })
  request.addParameter("StudentsID", Types.NVarChar, req.params.id)

  connection.execSql(request); //Execute Query
})

router.get('/:id/Projects', async (req, res) => {
  var selectProject = 'SELECT * FROM PROJECTS WHERE StudentID = @StudentID'
  var request = new Request(selectProject, (err, rowCount, rows) => {
    if (err) res.send(err)
    else {
      if (rowCount == 1)
        res.send(project)
      else
        res.status(404).send('Cannot find element' + req.params.id)
    }
  })
  var project = {};
  request.on('row', (columns) => {
    columns.forEach(column => {
      project[column.metadata.colName.toLowerCase()] = column.value
    })
  })
  request.addParameter('StudentID', Types.NVarChar, req.params.id)
  connection.execSql(request);
})


router.post("/", async (req, res) => {
  var selectStudents = `INSERT INTO STUDENTS (Name, Surname, Email,Image)
                       VALUES ('${req.body.Name}', '${req.body.Surname}', '${req.body.Email}','${req.body.Image}')`

  var request = new Request(selectStudents, (err) => {
    if (err) res.send(err)
    else res.send("Student Added")
  })
  connection.execSql(request); //Execute Query
})

router.post("/:id/addProject", (req, res) => {
  var addProject = `INSERT INTO PROJECTS (TITLE, GITLINK ,LIVEPROJECT,StudentID) 
                   OUTPUT Inserted.ProjectID
                   VALUES ('${req.body.TITLE}','${req.body.GITLINK}','${req.body.LIVEPROJECT}','${req.params.id}')`

  var request = new Request(addProject, (err, rowCount, rows) => {
    if (err) res.send(err)
    else res.send('project added')
  })

  connection.execSql(request);
})







module.exports = router