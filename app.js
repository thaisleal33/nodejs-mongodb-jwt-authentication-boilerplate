require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

//Config JSON response
app.use(express.json());

//Open Route - Public Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Bem-vindo à API!" });
});

//Auth Routes
app.use('/auth', authRoutes);

// Credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.rrt1nmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
.then(() => {
    app.listen(3000);
    console.log('Conectado ao banco de dados!');
})
.catch((err) => console.log(err));
