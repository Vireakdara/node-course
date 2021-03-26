const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json())

/* Middleware Function is a function that takes a request object and either terminates 
 the request/response cycle or passes control to antother middleware function.*/

app.use(function(req, res, next){
    console.log("Logging...")
    next();
})

app.use(function(req, res, next){
    console.log("Autheicating...")
    next();
})

const courses = [
    {
        id: 1,
        name: "course1"
    }, {
        id: 2,
        name: "course2"
    }, {
        id: 3,
        name: "course3"
    }
]

// Handle HTTP GET Request
app.get("/", (req, res) => {
    res.send('Hello World!!!');
})

app.get("/api/course", (req, res) => {
    res.send(courses)
})

app.get("/api/course/:id", (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (! course) {
        res.status(404).send("The courses with the given ID was not found")
    }


    res.send(course);
})

// Handle HTTP POST Request
app.post("/api/course", (req, res) => { // Validate using Joi
    const {error} = validateCourse(req.body); // result.error
    if (error) { // 400 Bad Request
        res.status(400).send(error.details[0].message)
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})


// Handle HTTP PUT Request
app.put("/api/course/:id", (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (! course) {
        res.status(404).send("The courses with the given ID was not found")
    }


    const {error} = validateCourse(req.body); // result.error
    if (error) { // 400 Bad Request
        res.status(400).send(error.details[0].message)
        return;
    }

    // Update Course
    course.name = req.body.name
    res.send(course)
    // Return the updated course
})

// Handle HTTP DELETE Request
app.delete("/api/course/:id", (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (! course) {
        res.status(404).send("The courses with the given ID was not found")
        return;
    }

    // Delete
    const index = courses.indexOf(course)
    courses.splice(index, 1)

    res.send(course)
})


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(course, schema)

}


const port = process.env.port || 3000;
app.listen(port, () => console.log('Listening on ' + port + '...'));
