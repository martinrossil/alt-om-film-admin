import IPersonMovieCreditsCast from './IPersonMovieCreditsCast';
import IPersonMovieCreditsCrew from './IPersonMovieCreditsCrew';

export default interface IPersonMovieCredits {
    id: number;
    cast: Array<IPersonMovieCreditsCast>;
    crew: Array<IPersonMovieCreditsCrew>;
}
