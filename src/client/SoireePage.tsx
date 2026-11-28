import { rankMovies, type MovieForRanking } from './ranking';

type Member = {
    id: number;
    name: string;
};

type SoireePageProps = {
    name: string;
    date: string;
    members: Member[];
    movies: MovieForRanking[];
};

export function SoireePage({ name, date, members, movies }: SoireePageProps) {
    const rankedMovies = rankMovies(movies);

    return (
        <main>
            <h1>{name}</h1>
            <p>Date : <time>{date}</time></p>

            <section aria-labelledby="members-title">
                <h2 id="members-title">Membres</h2>
                {members.length === 0 ? (
                    <p>Aucun membre dans cette soirée.</p>
                ) : (
                    <ul>
                        {members.map((member) => (
                            <li key={member.id}>{member.name}</li>
                        ))}
                    </ul>
                )}
            </section>

            <section aria-labelledby="movies-title">
                <h2 id="movies-title">Films proposés et classement</h2>
                {rankedMovies.length === 0 ? (
                    <p>Aucun film proposé pour le moment.</p>
                ) : (
                    <ol>
                        {rankedMovies.map((movie, index) => (
                            <li key={movie.id}>
                                <h3>
                                    {index + 1}. {movie.title}
                                </h3>
                                <p>
                                    Score : {movie.score} — Déjà vu : {movie.alreadySeenCount}
                                </p>
                            </li>
                        ))}
                    </ol>
                )}
            </section>
        </main>
    );
}