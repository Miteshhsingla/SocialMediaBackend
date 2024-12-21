const express = require('express');
const pool = require('./config.js/db'); // ensure db is connected
const authRoutes = require('./routes/auth.routes');
const dotenv = require('dotenv');
const swaggerDocs = require("./swaggerConfig");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
const app = express();


app.use(express.json());
app.use('/api/auth', authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  

  