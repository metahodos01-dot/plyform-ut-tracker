import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import FIREBASE_CONFIG, { COLLECTION_NAME, DOCUMENT_ID } from "../config/firebaseConfig";

// Firebase state
let firebaseApp = null;
let firestoreDb = null;
let isFirebaseInitialized = false;

// Initialize Firebase
const initializeFirebase = async () => {
    if (isFirebaseInitialized) return true;

    try {
        firebaseApp = initializeApp(FIREBASE_CONFIG);
        firestoreDb = getFirestore(firebaseApp);
        isFirebaseInitialized = true;
        console.log('✅ Firebase inizializzato con successo');
        return true;
    } catch (error) {
        console.error('❌ Errore inizializzazione Firebase:', error);
        return false;
    }
};

// Save data to Firestore
export const saveToFirestore = async (data) => {
    if (!isFirebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) return false;
    }

    try {
        const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
        await setDoc(docRef, {
            ...data,
            lastUpdated: new Date().toISOString()
        });
        console.log('✅ Dati salvati su Firebase');
        return true;
    } catch (error) {
        console.error('❌ Errore salvataggio:', error);
        return false;
    }
};

// Load data from Firestore
export const loadFromFirestore = async () => {
    if (!isFirebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) return null;
    }

    try {
        const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('✅ Dati caricati da Firebase');
            return docSnap.data();
        }
        console.log('ℹ️ Nessun dato esistente, uso defaults');
        return null;
    } catch (error) {
        console.error('❌ Errore caricamento:', error);
        return null;
    }
};

// Subscribe to real-time updates
export const subscribeToUpdates = async (callback) => {
    if (!isFirebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) return () => { };
    }

    try {
        const docRef = doc(firestoreDb, COLLECTION_NAME, DOCUMENT_ID);
        return onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data());
            }
        });
    } catch (error) {
        console.error('❌ Errore subscription:', error);
        return () => { };
    }
};

export { initializeFirebase };
