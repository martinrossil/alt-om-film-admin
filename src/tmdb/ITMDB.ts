import ICredits from './vo/ICredits';
import IImages from './vo/IImages';
import IMovie from './vo/IMovie';
import IMovieChange from './vo/IMovieChange';
import IPerson from './vo/IPerson';
import IPersonChange from './vo/IPersonChange';
import IPersonMovieCredits from './vo/IPersonMovieCredits';
import IProvider from './vo/IProvider';
import IProviders from './vo/IProviders';
import TMDBCollection from './vo/TMDBCollection';
import TMDBMovie from './vo/TMDBMovie';

export default interface ITMDB {
    getMovie(id: number): Promise<IMovie>;
    getMovieCredits(id: number): Promise<ICredits>;
    getPerson(id: number): Promise<IPerson>;
    getPersonMovieCredits(id: number): Promise<IPersonMovieCredits>;
    getMovieImages(id: number): Promise<IImages>;
    getMovieProviders(id: number): Promise<IProviders>;
    getProviders(): Promise<Array<IProvider>>;
    getMoviesWithProvider(id: number, page: number):Promise<TMDBCollection<TMDBMovie>>;
    getMovieChanges(): Promise<TMDBCollection<IMovieChange>>;
    getPersonChanges(): Promise<TMDBCollection<IPersonChange>>;
}
