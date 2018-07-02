const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
morgan.token('json', function (req, res) {
    return JSON.stringify(req.body);
})
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))
app.use(cors())

let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
    },
    {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 3
    }
]

const generateId = () => {
    const id = Math.floor((Math.random() * 1000) + 1);
    return id
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {

        return response.status(400).json({error: 'name or number is missing'})

    } else if (persons.find(person => person.name === body.name) !== undefined) {

        return response.status(400).json({error: 'name must be unique'})

    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (req, res) => {
    const total = persons.length
    const date = new Date()

    res.send(`<p> Puhelinluettelossa on ${total} henkilön tiedot </p> <p> ${date} </p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
