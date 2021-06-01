import ITMDB from './ITMDB';
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

export default class TMDB implements ITMDB {
    private static BASE_URL_V3 = 'https://api.themoviedb.org/3';
    private token: string;
    public constructor(token: string) {
        this.token = token;
    }

    public async getPersonChanges(): Promise<TMDBCollection<IPersonChange>> {
        const url = TMDB.BASE_URL_V3 + '/person/changes';
        try {
            const response = await fetch(url, this.requestInit);
            const result: TMDBCollection<IPersonChange> = await response.json();
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMovieChanges(): Promise<TMDBCollection<IMovieChange>> {
        const url = TMDB.BASE_URL_V3 + '/movie/changes';
        try {
            const response = await fetch(url, this.requestInit);
            const result: TMDBCollection<IMovieChange> = await response.json();
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMoviesWithProvider(id: number, page = 1):Promise<TMDBCollection<TMDBMovie>> {
        const url = TMDB.BASE_URL_V3 + '/discover/movie?include_adult=false&language=da&watch_region=DK&page=' + page + '&with_watch_providers=' + id;
        try {
            const response = await fetch(url, this.requestInit);
            const result: TMDBCollection<TMDBMovie> = await response.json();
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getProviders(): Promise<Array<IProvider>> {
        const url = TMDB.BASE_URL_V3 + '/watch/providers/movie?language=da&watch_region=DK';
        try {
            const response = await fetch(url, this.requestInit);
            const result: Record<string, Array<IProvider>> = await response.json();
            return Promise.resolve(result.results);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMovieProviders(id: number): Promise<IProviders> {
        const url = TMDB.BASE_URL_V3 + '/movie/' + id + '/watch/providers?language=da&watch_region=DK';
        try {
            const response = await fetch(url, this.requestInit);
            const providers = await response.json() as IProviders;
            return Promise.resolve(providers);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getPersonMovieCredits(id: number): Promise<IPersonMovieCredits> {
        const url = TMDB.BASE_URL_V3 + '/person/' + id + '/movie_credits?language=da';
        try {
            const response = await fetch(url, this.requestInit);
            const personMovieCredits = await response.json() as IPersonMovieCredits;
            return Promise.resolve(personMovieCredits);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getPerson(id: number): Promise<IPerson> {
        const url = TMDB.BASE_URL_V3 + '/person/' + id + '?language=da';
        try {
            const response = await fetch(url, this.requestInit);
            const person = await response.json() as IPerson;
            return Promise.resolve(person);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMovieCredits(id: number): Promise<ICredits> {
        const url = TMDB.BASE_URL_V3 + '/movie/' + id + '/credits?language=da';
        try {
            const response = await fetch(url, this.requestInit);
            const credits = await response.json() as ICredits;
            return Promise.resolve(credits);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMovieImages(id: number): Promise<IImages> {
        const url = TMDB.BASE_URL_V3 + '/movie/' + id + '/images?language=da&include_image_language=da,en';
        try {
            const response = await fetch(url, this.requestInit);
            const images = await response.json() as IImages;
            return Promise.resolve(images);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getMovie(id: number): Promise<IMovie> {
        try {
            const movieUrl = TMDB.BASE_URL_V3 + '/movie/' + id + '?language=da';
            const movieResponse = await fetch(movieUrl, this.requestInit);
            if (!movieResponse.ok) {
                return Promise.reject(new Error('Movie with id [' + id + '] was NOT found.'));
            }
            const movie: IMovie = await movieResponse.json() as IMovie;
            await this.delay(500);
            const { cast, crew } = await this.getMovieCredits(id);
            movie.cast = cast;
            movie.crew = crew;
            await this.delay(500);
            const { backdrops, posters } = await this.getMovieImages(id);
            movie.backdrops = backdrops;
            movie.posters = posters;
            return Promise.resolve(movie);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    private get requestInit(): RequestInit {
        return {
            method: 'GET',
            headers: this.headersInit
        }
    }

    private get headersInit(): HeadersInit {
        return {
            Authorization: 'Bearer ' + this.token,
            'Content-Type': 'application/json;charset=utf-8'
        }
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
