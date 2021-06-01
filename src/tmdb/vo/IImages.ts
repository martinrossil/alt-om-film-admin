import IBackdrop from './IBackdrop';
import IPoster from './IPoster';

export default interface IImages {
    id: number;
    backdrops: Array<IBackdrop>;
    posters: Array<IPoster>;
}
