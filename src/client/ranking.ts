export type VoteChoice = 'oui' | 'non' | 'deja_vu';

export type MovieForRanking = {
    id: number;
    title: string;
    releaseYear: number | null;
    votes: VoteChoice[];
};

export type RankedMovie = MovieForRanking & {
    score: number;
    alreadySeenCount: number;
};

export function rankMovies(movies: MovieForRanking[]): RankedMovie[] {
    return movies
        .map((movie) => {
            const score = movie.votes.reduce((total, vote) => {
                if (vote === 'oui') return total + 1;
                if (vote === 'non') return total - 1;
                return total;
            }, 0);

            const alreadySeenCount = movie.votes.filter(
                (vote) => vote === 'deja_vu'
            ).length;

            return { ...movie, score, alreadySeenCount };
        })
        .sort((a, b) => {
            if (a.score !== b.score) return b.score - a.score;
            if (a.alreadySeenCount !== b.alreadySeenCount) {
                return a.alreadySeenCount - b.alreadySeenCount;
            }
            return (b.releaseYear ?? 0) - (a.releaseYear ?? 0);
        });
}