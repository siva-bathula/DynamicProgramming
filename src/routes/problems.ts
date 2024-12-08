import { Request, Response } from "express";

const express = require('express');
const router = express.Router();

router.get('/:num', async (req: Request, res: Response, next: Function) => {
    const problemNum = req.params.num;
    try {
        const modulePath = `../${problemNum}.ts`;
        const module = require(modulePath); 
        if (module && typeof module.run === 'function') { 
            const result = await module.run(problemNum, module);
            res.send(`${result}`);
        } else {
            res.status(500).send('Invalid module or function'); 
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error in module for day ${problemNum}`);
    }
});

module.exports = router;