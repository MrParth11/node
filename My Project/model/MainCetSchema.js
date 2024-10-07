const mongoose = require('mongoose');

const MainCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const MainCategory = mongoose.models.MainCet || mongoose.model('MainCet', MainCategorySchema);

module.exports = MainCategory;
