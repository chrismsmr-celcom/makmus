const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// On sert les fichiers statiques (ton HTML, CSS, images)
app.use(express.static('public'));

// ROUTE API : C'est ici que ton site va demander les news
app.get('/api/news', async (req, res) => {
    try {
        const category = req.query.category || 'top';
        const query = req.query.q || '';
        const API_KEY = process.env.NEWSDATA_API_KEY; // Ta clé sera cachée ici

        let url = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=fr`;
        if (query) url += `&q=${encodeURIComponent(query)}`;
        if (category && category !== 'top') url += `&category=${category}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération des news" });
    }
});

app.listen(PORT, () => {
    console.log(`Le journal MAKMUS est lancé sur http://localhost:${PORT}`);
});
