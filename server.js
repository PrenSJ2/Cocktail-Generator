"use strict";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const app = express();

const port = process.env.PORT || 3000;

const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ingredients', async (req, res) => {
    const image = req.body.image;
    const response = await openai.images.recognizeObjects({
        image: image
    });
    res.json({
        ingredients: response.objects
    });
});

app.post('/api/generate', async (req, res) => {
    const prompt = req.body.prompt;
    const response = await openai.completions.create({
        engine: 'text-davinci-002',
        prompt: prompt,
        maxTokens: 1024,
        n: 1,
        stop: ['\n'],
        temperature: 0.5
    });
    res.json({
        text: response.choices[0].text
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});