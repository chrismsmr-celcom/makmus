const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// --- SYSTÈME DE CACHE ---
let newsCache = {}; // Stocke les news par catégorie/requête
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes

// --- FONCTION IA (OPENAI) ---
async function rewriteWithOpenAI(title) {
    if (!process.env.OPENAI_API_KEY) return title;
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Tu es le rédacteur en chef de MAKMUS. Réécris ce titre pour qu'il soit élégant, percutant et journalistique (style New York Times). Réponds uniquement avec le nouveau titre en français." },
                    { role: "user", content: title }
                ],
                max_tokens: 60,
                temperature: 0.7
            },
            {
                headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
                timeout: 5000
            }
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.log("IA indisponible, titre original conservé.");
        return title;
    }
}

// --- ROUTE API AVEC CACHE ---
app.get('/api/news', async (req, res) => {
    const category = req.query.category || 'top';
    const query = req.query.q || '';
    const cacheKey = `${category}-${query}`; // Identifiant unique pour ce flux

    // 1. Vérifier si on a un cache valide (moins de 30 min)
    const now = Date.now();
    if (newsCache[cacheKey] && (now - newsCache[cacheKey].timestamp < CACHE_DURATION)) {
        console.log(`Cache utilisé pour : ${cacheKey}`);
        return res.json({ results: newsCache[cacheKey].data });
    }

    // 2. Si pas de cache, on appelle NewsAPI
    try {
        console.log(`Appel NewsAPI pour : ${cacheKey}`);
        const API_KEY = process.env.NEWSDATA_API_KEY;
        let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=fr`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (category && category !== 'top') url += `&category=${category}`;

        const response = await axios.get(url);
        let articles = response.data.results || [];

        // 3. On ne fait travailler l'IA que sur les nouveaux articles (Top 5)
        for (let i = 0; i < Math.min(articles.length, 5); i++) {
            articles[i].title = await rewriteWithOpenAI(articles[i].title);
        }

        // 4. On enregistre dans le cache avant d'envoyer
        newsCache[cacheKey] = {
            timestamp: now,
            data: articles
        };

        res.json({ results: articles });
    } catch (error) {
        console.error("Erreur NewsAPI:", error.message);
        res.status(500).json({ results: [], error: "Erreur serveur" });
    }
});

app.listen(PORT, () => {
    console.log(`MAKMUS actif sur le port ${PORT} avec système de cache.`);
});
