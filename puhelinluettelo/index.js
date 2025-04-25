require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
app.use(express.static('dist'))
app.use(express.json())
app.use(bodyParser.json())
const morgan = require('morgan')
app.use(morgan(':method :url :body'))
app.use(cors())
morgan.token('body', request => JSON.stringify(request.body))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
      })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.status(204).end()
    })
})
    

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
    if (!body.number) {
    return response.status(400).json({ 
        error: 'content missing' 
    })
    }

    //if ((persons.map(person => person.name).indexOf(body.name) != -1)){
        //return response.status(400).json({
            //error: 'name must be unique'
        //})
    //}
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    app.use(morgan('body'))
    person.save().then(savedPerson => {
        response.json(savedPerson)
      })
  })

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length}</p> <br>
        <div>${new Date()}</div>`)
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})