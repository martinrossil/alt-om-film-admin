import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const api = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
});

export const updateTMDBCollectionCount = functions.firestore.document('/tmdb_movies/{documentId}')
    .onCreate((snap, context) => {
        const database = admin.database();
        const countRef = database.ref('stats/');
        return countRef.update({
            tmdb_collection_count: admin.database.ServerValue.increment(1)
    })
});

export const updateInvalidTMDBCollectionCount = functions.firestore.document('/invalid_tmdb_movies/{documentId}')
    .onCreate((snap, context) => {
        const database = admin.database();
        const countRef = database.ref('stats/');
        return countRef.update({
            invalid_tmdb_collection_count: admin.database.ServerValue.increment(1)
    })
});
