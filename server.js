require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');

const server = express();


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Set up EJS as the view engine
server.set('view engine', 'ejs');

// Middleware to parse request bodies
server.use(express.urlencoded({ extended: true }));

// Define the schema and model for clothing records
const clothingSchema = new mongoose.Schema({
    brand: String,
    type: String,
    size: String,
    clean: Boolean,
});

const Clothing = mongoose.model('Clothing', clothingSchema);

// Route to display the clothing records
server.get('/', async (req, res) => {
    const clothingRecords = await Clothing.find({});
    res.render('index', { clothingRecords });
});

// Route to add a new clothing record
server.post('/addClothing', async (req, res) => {
    const { brand, type, size, clean } = req.body;
    const newClothingRecord = new Clothing({ brand, type, size, clean });
    await newClothingRecord.save();
    res.redirect('/');
});

server.post('/deleteClothing', async (req, res) => {
    try {
        const clothingId = req.body.clothingId;  // Get the clothing ID from the form submission
        await Clothing.findByIdAndDelete(clothingId);  // Delete the item from the database
        res.redirect('/');  // Redirect back to the main page after deletion
    } catch (error) {
        console.error('Error deleting clothing item:', error);
        res.status(500).send('Error deleting clothing item');
    }
})

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});