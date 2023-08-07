const cors = require('cors');
const express = require('express');
const { Configuration, OpenAIApi } = require("openai")
require('dotenv').config();

const app = express();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(cors())

app.post('/api/gpt-3', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        response = chatCompletion.data.choices[0].message
        console.log(response)
        res.json(response.content)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
