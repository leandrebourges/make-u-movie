import express from 'express';
import { baseType } from './db.ts';

const app = express();
app.use(express.json());

app.get('/api/sante', (_req, res) => {
    const tokenPresent = Boolean(process.env.TMDB_TOKEN?.trim());
    res.json({
        serveur: 'ok',
        jetonTmdb: tokenPresent ? 'présent' : 'absent',
        base: baseType,
    });
});

async function fetchTmdb(endpoint: string) {
    return fetch(`https://api.themoviedb.org/3${endpoint}`, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            accept: 'application/json',
        },
    });
}


app.get('/api/recherche', async (req, res) => {
    const title = req.query.title;
    if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'aucun film recherché' });
        return;
    }
    const url = `/search/movie?query=${encodeURIComponent(title.trim())}&language=fr-FR`;
    try {
        const tmdbResponse = await fetchTmdb(url);

        if (tmdbResponse.status === 404) {
            res.status(404).json({ error: 'Film introuvable' });
            return;
        }

        if (!tmdbResponse.ok) {
            console.error(`Erreur TMDB : ${tmdbResponse.status} ${tmdbResponse.statusText}`);
            res.status(502).json({ error: "Erreur lors de la communication avec TMDB" });
            return;
        }
        const data = await tmdbResponse.json();
        const researchedData = data.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.slice(0, 4) : '',
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : null,
        }));
        res.json(researchedData);
    }
    catch (error) {
        console.error('Impossible de joindre TMDB :', error);
        res.status(502).json({ error: 'Impossible de joindre TMDB' });
    }
});

app.get('/api/films/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'Identifiant de film invalide' });
        return;
    }

    const url = `/movie/${id}?language=fr-FR`;

    try {
        const tmdbResponse = await fetchTmdb(url);
        if (tmdbResponse.status === 404) {
            res.status(404).json({ error: 'Film introuvable' });
            return;
        }
        if (!tmdbResponse.ok) {
            console.error(`Erreur TMDB : ${tmdbResponse.status} ${tmdbResponse.statusText}`);
            res.status(502).json({ error: "Erreur lors de la communication avec TMDB" });
            return;
        }
        const movie = await tmdbResponse.json();
        let duration = '';
        if (typeof movie.runtime === 'number' && movie.runtime > 0) {
            const hours = Math.floor(movie.runtime / 60);
            const minutes = movie.runtime % 60;
            duration = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
        }

        const genres = Array.isArray(movie.genres) ? movie.genres.map((g: { name: string }) => g.name).join(', ') : null;

        res.json({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.slice(0, 4) : '',
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
            overview: movie.overview || null,
            duration,
            genres,
        });
    }
    catch (error) {
        console.error('Impossible de joindre TMDB :', error);
        res.status(502).json({ error: 'Impossible de joindre TMDB' });
    }
})

if (!process.env.VERCEL) {
    app.listen(3000, () => {
        console.log('Sereveur local démarré sur http://localhost:3000');
    });
}

export default app;