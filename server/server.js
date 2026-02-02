const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// --- FONCTION DE RÉDACTION VIRTUELLE (IA) ---
async function rewriteWithIA(title, description) {
    // Si tu n'as pas encore de clé IA, on renvoie le titre original
    if (!process.env.GEMINI_API_KEY) return title;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const prompt = {
            "contents": [{
                "parts": [{
                    "text": `Tu es le rédacteur en chef de MAKMUS, un journal prestigieux. 
                    Réécris ce titre d'actualité pour qu'il soit percutant, sérieux et élégant (style New York Times). 
                    Ne réponds QUE le nouveau titre, sans guillemets.
                    Titre original : ${title}`
                }]
            }]
        };

        const response = await axios.post(url, prompt);
        return response.data.candidates[0].content.parts[0].text.trim();
    } catch (error) {
        console.error("L'IA est fatiguée, on garde le titre original.");
        return title;
    }
}

// --- ROUTE API AVEC TRANSFORMATION ---
app.get('/api/news', async (req, res) => {
    try {
        const category = req.query.category || 'top';
        const query = req.query.q || '';
        const API_KEY = process.env.NEWSDATA_API_KEY;

        let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=fr`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (category && category !== 'top') url += `&category=${category}`;

        const response = await axios.get(url);
        const articles = response.data.results;

        // On fait réécrire les 5 premiers titres par l'IA (pour la Une)
        const transformedArticles = await Promise.all(articles.map(async (art, index) => {
            if (index < 5) {
                art.title = await rewriteWithIA(art.title);
            }
            return art;
        }));

        res.json({ results: transformedArticles });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`MAKMUS tourne sur le port ${PORT}`);
});
