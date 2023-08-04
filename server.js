const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

connectDB();

app.use(express.json());


app.get("/",(req, res) => {
    res.json("Hello");
  
});

app.use('/api/ServiceProvider', require('./routes/api/ServiceProvider'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/ServiceProviderprofile', require('./routes/api/ServiceProviderprofile'));
app.use('/api/Normaluser', require('./routes/api/Normaluser'));
app.use('/api/getservice', require('./routes/api/GetService'));



app.listen(9000, () => console.log(`Server started...`));
