const mongoose = require('mongoose');

const destinationSchema = mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  clues: {
    type: [String],
    required: true
  },
  fun_fact: {
    type: [String],
    required: true
  },
  trivia: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Destination', destinationSchema);