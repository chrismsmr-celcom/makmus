const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// --- FONCTION DE RÉDACTION AVEC OPENAI ---
async function rewriteWithOpenAI(title) {
    if (!process.env.OPENAI_API_KEY) return title;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Tu es le rédacteur en chef du journal MAKMUS. Réécris ce titre pour qu'il soit élégant, percutant et journalistique (style NYT). Réponds uniquement avec le nouveau titre en français." },
                    { role: "user", content: title }
                ],
                max_tokens: 50,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI Error:", error.response ? error.response.data : error.message);
        return title; // Retour au titre original si l'IA échoue
    }
}

app.get('/api/news', async (req, res) => {
    try {
        const category = req.query.category || 'top';
        const query = req.query.q || '';
        const API_KEY = process.env.NEWSDATA_API_KEY;

        let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=fr`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (category && category !== 'top') url += `&category=${category}`;

        const response = await axios.get(url);
        let articles = response.data.results || [];

        // On réécrit les 5 premiers articles pour donner du cachet à la Une
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            articles[i].title = await rewriteWithOpenAI(articles[i].title);
        }

        res.json({ results: articles });
    } catch (error) {
        console.error("NewsAPI Error:", error.message);
        res.status(500).json({ results: [], error: "Erreur lors de la récupération des news" });
    }
});

app.listen(PORT, () => {
    console.log(`MAKMUS actif sur le port ${PORT}`);
});
