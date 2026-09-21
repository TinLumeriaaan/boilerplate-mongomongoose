require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

const Person = mongoose.model('Person', personSchema);
const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Mary",
    age: 30,
    favoriteFoods: ["pasta", "apples"]
  });

  person.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const fooding = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    
    person.favoriteFoods.push(fooding);

    person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    (err, updatedDoc) => {
      if (err) return console.error(err);
      done(null, updatedDoc);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndDelete(personId)
    .then(data => done(null, data))
    .catch(err => done(err));
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.deleteMany({ name: nameToRemove })
    .then(outcome => done(null, outcome))
    .catch(err => done(err));
};

const queryChain = (foodToSearch, done) => {
  const actualDone = typeof foodToSearch === 'function' ? foodToSearch : done;
  const actualFood = typeof foodToSearch === 'function' ? "burrito" : foodToSearch;

  Person.find({ favoriteFoods: actualFood })
    .sort({ name: 'asc' })
    .limit(2)
    .select('-age')
    .exec((err, data) => {
      if (err) {
        if (typeof actualDone === 'function') return actualDone(err);
        return console.error(err);
      }
      if (typeof actualDone === 'function') {
        actualDone(null, data);
      }
    });
};
/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
