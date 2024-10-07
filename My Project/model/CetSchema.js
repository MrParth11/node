const mongoose = require('mongoose');
const CetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
  },
  image: {
    type: String,
    required: true,  
  },
});

module.exports = mongoose.model('Cet', CetSchema);
