const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(bodyParser.json())
app.use(morgan('tiny'))
morgan.token('json', function (request, response) {
    return JSON.stringify(request.body);
})
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))
app.use(cors())


check = (name) => {


}


app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons.map(Person.format))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'Error while fetching persons'})
        })

})


app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'Malformatted id'})
        })
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {

        return response.status(400).json({error: 'name or number is missing'})

    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    Person
        .find({name: person.name})
        .then(result => {
            if (result.length !== 0) {
                return response.status(400).json({error: 'Name already exists'})
            } else {
                person
                    .save()
                    .then(savedPerson => {
                        response.json(Person.format(savedPerson))
                    })
                    .catch(error => {
                        console.log(error)
                        response.status(400).send({error: 'Error while saving person'})
                    })
            }
        })


})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
})


app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            console.log(error)
            response.status(400).send({error: 'Malformatted id'})
        })
})

app.get('/info', (request, response) => {

    const date = new Date()
    let total = 0
    Person
        .find({})
        .then(persons => {
            total = persons.length
            response.send(`<p> Puhelinluettelossa on ${total} henkilön tiedot </p> <p> ${date} </p>`)
        })
        .catch(error => {
            console.log(error)
        })


})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
