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

// Define the schema and model for hygiene records
const hygieneSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    activity: String,
    duration: Number,
    notes: String,
});

const Hygiene = mongoose.model('Hygiene', hygieneSchema);

// Route to display the hygiene records
server.get('/', async (req, res) => {
    const records = await Hygiene.find({});
    res.render('index', { records });
});

// Route to add a new hygiene record
server.post('/add', async (req, res) => {
    const { activity, duration, notes } = req.body;
    const newRecord = new Hygiene({ activity, duration, notes });
    await newRecord.save();
    res.redirect('/');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});