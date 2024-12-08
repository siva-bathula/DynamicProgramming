"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const router = require('./routes/problems');
app.use(router);
app.listen(PORT, () => {
    console.info(`App listening on port ${PORT}`);
});
