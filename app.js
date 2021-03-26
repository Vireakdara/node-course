const logger = require("./logger")
const auth = require("./auth")
const Joi = require('joi');
const express = require('express');
const helmet = require("helmet")
const morgan = require("morgan")
const app = express();
const config = require("config")


app.use(express.json()) // parse body object // Example : req.body

app.use(express.urlencoded({extended: true})) // key=value&key=value

app.use(express.static('public')); // static content

app.use(helmet()) // Helps secure your apps by setting various HTTP headers.

if (app.get('env') === "development") {
    app.use(morgan("tiny")) // HTTP request logger.
    console.log("Morgan is enable...")
}

/* Middleware Function is a function that takes a request object and either terminates 
 the request/response cycle or passes control to antother middleware function.*/

app.use(logger);

app.use(auth);

// Configuration
console.log("Application Name:" + config.get('name'))
console.log("Mail Server :" + config.get('mail.host'))


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
