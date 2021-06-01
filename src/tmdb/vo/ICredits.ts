import ICast from './ICast';
import ICrew from './ICrew';

export default interface ICredits {
    id: number;
    cast: Array<ICast>;
    crew: Array<ICrew>;
}
