import { ApplicationElement, ArrayCollection, IArrayCollection } from 'enta';
import { Config } from './Config';
import ITMDB from './tmdb/ITMDB';
import TMDB from './tmdb/TMDB';
import { getDatabase, useDatabaseEmulator, FirebaseDatabase, ref, set, get, Reference, increment, child } from 'firebase/database';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { FirebaseFirestore, getFirestore, useFirestoreEmulator, doc, addDoc, DocumentReference, setDoc, serverTimestamp, FieldValue, getDoc, DocumentSnapshot, query, where, getDocs, CollectionReference, orderBy, limit, DocumentData, collection } from 'firebase/firestore';
import { Providers } from './enums/Providers';
import TMDBMovie from './tmdb/vo/TMDBMovie';
import TMDBCollection from './tmdb/vo/TMDBCollection';
import IMovieChange from './tmdb/vo/IMovieChange';
import IMovie from './tmdb/vo/IMovie';

export default class AltOmFilmAdmin extends ApplicationElement {
    public constructor() {
        super();
        this.name = 'AltOmFilmAdmin';
        console.log(this.name);
        let scrabing = false;
        window.addEventListener('click', async () => {
            if (scrabing) {
                return;
            }
            scrabing = true;
            console.log('starting index scrabing');
            this.startScrabing();
        });
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private currentIndex = NaN;

    private async startScrabing(): Promise<void> {
        const dbRef = ref(this.database);
        const currentIndexSnap = await get(child(dbRef, 'currentIndex'));
        if (!currentIndexSnap.exists()) {
            await set(ref(this.database, 'currentIndex'), 0);
            this.currentIndex = 0;
        } else {
            this.currentIndex = currentIndexSnap.val();
        }
        this.getNextTMDBMovie(this.currentIndex);
    }

    private async getNextTMDBMovie(index: number): Promise<void> {
        console.log('getNextTMDBMovie()', index);
        try {
            const movie: IMovie = await this.tmdb.getMovie(index);
            await this.delay(500);
            await this.insertMovieInFirestore(movie, 'tmdb_movies');
            await set(ref(this.database, 'currentIndex'), this.currentIndex++);
            this.getNextTMDBMovie(this.currentIndex);
        } catch (error) {
            console.log(error);
            await set(ref(this.database, 'currentIndex'), this.currentIndex++);
            this.getNextTMDBMovie(this.currentIndex);
        }
    }

    private currentPage = 0;

    /* private async continueScrabe(): Promise<void> {
        this.currentPage++;
        try {
            const movies = await this.tmdb.getMoviesWithProvider(Providers.AMAZON_PRIME_VIDEO, this.currentPage);
            console.log(movies.page + ' of ' + movies.total_pages);
            for (const movie of movies.results) {
                if (this.isMovieValid(movie)) {
                    await this.insertMovieInFirestore(movie, 'tmdb_movies');
                } else {
                    await this.insertMovieInFirestore(movie, 'invalid_tmdb_movies');
                }
            }
            if (this.currentPage < movies.total_pages) {
                this.continueScrabe();
            } else {
                console.log('disney done!');
            }
        } catch (error) {
            console.error('Error adding movie: ', error);
        }
    } */

    private isMovieValid(movie: TMDBMovie): boolean {
        if (!movie.backdrop_path) {
            return false;
        }
        if (!movie.genre_ids.length) {
            return false;
        }
        if (!movie.original_language) {
            return false;
        }
        if (!movie.original_title) {
            return false;
        }
        if (!movie.overview) {
            return false;
        }
        if (!movie.poster_path) {
            return false;
        }
        if (!movie.release_date) {
            return false;
        }
        if (!movie.title) {
            return false;
        }
        if (!movie.vote_average) {
            return false;
        }
        if (!movie.vote_count) {
            return false;
        }
        return true;
    }

    private async insertMovieInFirestore(movie: IMovie, collection: string): Promise<IMovie> {
        console.log('insertMovieInFirestore', movie.title, movie.release_date);
        const movieRef: DocumentReference<IMovie> = doc(this.firestore, collection, movie.id.toString());
        const movieSnap = await getDoc(movieRef);
        if (!movieSnap.exists()) {
            await setDoc(movieRef, movie);
        } else {
            console.log(movie.title, 'exists');
        }
        return Promise.resolve(movie);
    }

    private firebaseApp: FirebaseApp = initializeApp(Config.FIREBASE_OPTIONS);

    private _database!: FirebaseDatabase;

    private get database(): FirebaseDatabase {
        if (!this._database) {
            this._database = getDatabase();
            if (Config.isDevelopment) {
                useDatabaseEmulator(this._database, 'localhost', 9000);
            }
        }
        return this._database;
    }

    private _firestore!: FirebaseFirestore;

    private get firestore(): FirebaseFirestore {
        if (!this._firestore) {
            this._firestore = getFirestore();
            if (Config.isDevelopment) {
                useFirestoreEmulator(this._firestore, 'localhost', 8080);
            }
        }
        return this._firestore;
    }

    private _tmdb!: ITMDB;

    private get tmdb(): ITMDB {
        if (!this._tmdb) {
            this._tmdb = new TMDB(Config.TMDB_TOKEN);
        }
        return this._tmdb;
    }
}
customElements.define('alt-om-film-admin', AltOmFilmAdmin);
