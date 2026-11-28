import { createRoot } from 'react-dom/client';
import { SoireePage } from './SoireePage';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('La page ne contient pas l’élément root.');
}

createRoot(rootElement).render(
    <SoireePage
        name="Soirée test"
        date="2026-11-28"
        members={[
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Sam' },
        ]}
        movies={[
            {
                id: 1,
                title: 'Film ancien, un oui',
                releaseYear: 2020,
                votes: ['oui'],
            },
            {
                id: 2,
                title: 'Film récent, un oui',
                releaseYear: 2024,
                votes: ['oui'],
            },
            {
                id: 3,
                title: 'Film récent, un oui et déjà vu',
                releaseYear: 2026,
                votes: ['oui', 'deja_vu'],
            },
            {
                id: 4,
                title: 'Film avec seulement déjà vu',
                releaseYear: 2026,
                votes: ['deja_vu'],
            },
        ]}
    />
);