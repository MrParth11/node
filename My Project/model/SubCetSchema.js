const mongoose = require('mongoose');
const SubCetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
  },
  image: {
    type: String,
    required: true,  
  },
  maincategory:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MainCet', // Ensure this matches your main category model
    required: true,
  },
});
module.exports = mongoose.model('SubCet', SubCetSchema);
