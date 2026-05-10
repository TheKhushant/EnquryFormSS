const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '1.1.1.1']
);

dotenv.config();

const app = express();

// Middleware
// app.use(cors({
//     origin: 'http://localhost:5173', // Change to your frontend URL
//     credentials: true
// }));
app.use(cors({
    origin: ['https://enqury-form-ss.vercel.app'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/enquiries', require('./routes/enquiryRoutes'));

// Health check
app.get('/', (req, res) => {
    res.send('Enquiry Backend is running...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`--->   Server running on port ${PORT}    <---`);
    });
};

startServer();