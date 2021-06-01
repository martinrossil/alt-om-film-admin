import IGenre from '../vo/IGenre';

export type JSONMovie = {
    adult: boolean,
    backdrop_path: string | null,
    belongs_to_collection: Record<string, unknown> | null,
    budget: number,
    genres: Array<IGenre>
}
