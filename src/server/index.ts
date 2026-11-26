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

if (!process.env.VERCEL) {
    app.listen(3000, () => {
        console.log('Sereveur local démarré sur http://localhost:3000');
    });
}

export default app;