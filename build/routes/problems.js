"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
router.get('/:num', async (req, res, next) => {
    const dayNum = req.params.num;
    try {
        const modulePath = `../${dayNum}.js`;
        const module = require(modulePath);
        if (module && typeof module.run === 'function') {
            const result = await module.run(dayNum, module);
            res.send(`${result}`);
        }
        else {
            res.status(500).send('Invalid module or function');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(`Error in module for day ${dayNum}`);
    }
});
module.exports = router;
