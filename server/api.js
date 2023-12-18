const express = require('express');
const cors = require("cors");

const mongoClient = require("mongodb").MongoClient;
const conStr = "mongodb://127.0.0.1:27017";
const port = 4000;

const app = express();


app.use(cors());//posting data may be blocked by firewalls so we use cors
app.use(express.urlencoded({extended:true}))//allow to send data through url
app.use(express.json())//convert data into json


app.get('/',(req,res) => {
    res.send("<h1>Welcome to Home Page")
})

app.get('/appointments',(req,res) => {
    mongoClient.connect(conStr).then(clientObject => {
        const database = clientObject.db('todo')
        database.collection('appointments').find({}).toArray().then(document => {
            res.send(document)
            res.end()
        })
    } )
})

app.get('/appointments/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObject => {
        const db = clientObject.db('todo');
        db.collection('appointments').find({Id:id}).toArray().then(document => {
            res.send(document)
            res.end();
        })
    })

})

app.post('/addtask',(req,res) =>{
    const task = {
        Id: parseInt(req.body.Id),
        Title: req.body.Title,
        Date: new Date(req.body.Date),
        Description: req.body.Description
    }

    mongoClient.connect(conStr).then( clientObject => {
        const database = clientObject.db('todo');
        database.collection('appointments').insertOne(task).then( () => {
            console.log("Task Added Successfully");
            res.end();
        })
    })

})

app.put('/edittask/:id',(req,res) => {
    var id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObject => {
        const database = clientObject.db('todo');
        database.collection('appointments').updateOne({Id:id},{$set:{Id:parseInt(req.body.Id),Title:req.body.Title,Date:new Date(req.body.Date),Description:req.body.Description}})
        .then( () => {
            console.log("Task updated successfully")
            res.end();
        })
    })
})


app.delete('/deletetask/:id',(req,res) => {
    const id = parseInt(req.params.id);
    mongoClient.connect(conStr).then(clientObject => {
        const database = clientObject.db('todo');
        database.collection('appointments').deleteOne({Id:id}).then(() => {
            console.log("Task Deleted Successfully")
            res.end();
        })
    })
})




app.listen(port,() => {
    console.log(`App listening on ${port}`)
    console.log(`http://localhost:${port}`)
})