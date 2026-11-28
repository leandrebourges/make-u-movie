
import { useState, type FormEvent } from 'react';

type Movie = {
    id: number;
    title: string;
    year: string;
    poster: string | null;
    overview: string | null;
    duration: string;
    genres: string | null;
};

type FilmCardProp = {
    movie: Movie;
    onSelect: () => void;
}

function FilmCard({ movie, onSelect }: FilmCardProp) {
    return (
        <article className="movie" onClick={onSelect} role="button" style={{ cursor: 'pointer' }}>
            {movie.poster ? (
                <img src={movie.poster} alt={movie.title} className="poster" />
            ) : (
                <div className="poster">
                    <strong> {movie.title} </strong>
                </div>
            )}
            <h3>{movie.title}</h3>
            <p className="year">{movie.year}</p>
        </article>
    );
}

export function Accueil() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    async function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setHasSearched(true);
        setSelectedMovie(null);
        try {
            const response = await fetch(`/api/recherche?title=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (!response.ok) {
                setMovies([]);
                setError(data.error || 'Une erreur est survenue.');
                return;
            }
            setMovies(data);
        }
        catch {
            setError('Impossible de contacter le serveur.');
        }
        finally {
            setLoading(false);
        }

    }

    async function handleMovieSelection(movieId: number) {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/films/${movieId}`);
            const data = await response.json();
            if (!response.ok) {
                setSelectedMovie(null);
                setError(data.error || 'Une erreur est survenue.');
                return;
            }
            setSelectedMovie(data);
        }
        catch {
            setError('Impossible de contacter le serveur.');
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>MAKEuMOVIE</h1>
            <p> On regarde quoi ce soir?</p>

            <form onSubmit={handleSearch}>
                <input id="query" type="text" placeholder="Rechercher un film" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit" disabled={loading}>Rechercher</button>
            </form>

            {loading && <p>Chargement des films…</p>}
            {error && <p className="error">{error}</p>}
            {hasSearched && !loading && !error && movies.length === 0 && (
                <p>Aucun film trouvé.</p>
            )}
            {!loading && !error && selectedMovie === null && (
                <section>
                    <div className="movies">
                        {movies.map((movie) => (
                            <FilmCard key={movie.id} movie={movie} onSelect={() => handleMovieSelection(movie.id)} />
                        ))}
                    </div>
                </section>
            )}
            {selectedMovie !== null && (
                <section className="filmCard">
                    {selectedMovie.poster ? (
                        <img src={selectedMovie.poster} alt={selectedMovie.title} className="poster" />
                    ) : (
                        <div className="poster">
                            <strong> {selectedMovie.title} </strong>
                        </div>
                    )}
                    <h2>{selectedMovie.title} ({selectedMovie.year})</h2>
                    <p>{selectedMovie.duration || null}</p>
                    <p>{selectedMovie.genres || null}</p>
                    <p>{selectedMovie.overview || 'Aucun résumé disponible'}</p>
                    <button type="button" onClick={() => setSelectedMovie(null)}>
                        Retour aux résultats
                    </button>
                </section>
            )}
            <footer>
                <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
            </footer>
        </main>
    );
}
