const mongoose = require('mongoose')

const url = 'mongodb://admin:adm1nadm1n@ds125331.mlab.com:25331/phonebook'
mongoose.connect(url)

const Person = mongoose.model('Person', {
	name: String,
        number: String
})


databaseFunctionality = () => {

if(process.argv.length < 4){
console.log("Puhelinluettelo:")
Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {

const person = new Person({
	name: process.argv[2],
	number: process.argv[3]
})

person
  .save()
  .then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}

}

databaseFunctionality()

