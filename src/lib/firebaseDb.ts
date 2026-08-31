import { initializeApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  query, 
  where,
  orderBy
} from "firebase/firestore";
import fs from "fs";
import path from "path";
import { INITIAL_ARTICLES } from "../data/mockNews.js";

const RETENTION_DAYS = 15;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

const DEFAULT_FIREBASE_CONFIG = {
  projectId: "gen-lang-client-0365610015",
  appId: "1:1011537026315:web:9a8e51b2b2e4bfa0c6960e",
  apiKey: "AIzaSyCe8CkRp8W2EaYLsUxpdioSqsfL4_MXtuY",
  authDomain: "gen-lang-client-0365610015.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-realestateagentp-26934774-3dcd-4f1e-8c1b-ec604f316df9",
  storageBucket: "gen-lang-client-0365610015.firebasestorage.app",
  messagingSenderId: "1011537026315",
};

let dbInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  
  let config: any = { ...DEFAULT_FIREBASE_CONFIG };

  // Attempt to load from candidate paths if available on disk
  const candidatePaths = [
    path.join(process.cwd(), "firebase-applet-config.json"),
    path.join(process.cwd(), "dist", "firebase-applet-config.json")
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(p, "utf-8"));
        config = { ...config, ...fileContent };
        break;
      } catch (e) {
        // Continue to fallback
      }
    }
  }

  const firebaseConfig = {
    apiKey: config.apiKey || process.env.FIREBASE_API_KEY,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const databaseId = config.firestoreDatabaseId || "(default)";
  
  dbInstance = databaseId && databaseId !== "(default)" ? getFirestore(app, databaseId) : getFirestore(app);
  return dbInstance;
}

/**
 * Automatically prunes articles in Firestore that are older than 15 days,
 * as well as explicitly deprecated/removed stories.
 */
export async function pruneOldArticles(): Promise<{ prunedCount: number; remainingCount: number }> {
  try {
    const db = getDb();
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);
    
    const now = Date.now();
    const cutoffMs = now - RETENTION_MS;
    
    let prunedCount = 0;
    let remainingCount = 0;

    const deletePromises: Promise<void>[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const createdAtMs = data.createdAtMs || (data.publishedAtMs ? Number(data.publishedAtMs) : now);
      const isCondoConundrum = docSnap.id === 'report-oc-condo-conundrum' || (data.title && data.title.toLowerCase().includes('condo conundrum'));
      
      if (createdAtMs < cutoffMs || isCondoConundrum) {
        prunedCount++;
        deletePromises.push(deleteDoc(doc(db, "articles", docSnap.id)));
      } else {
        remainingCount++;
      }
    });

    await Promise.all(deletePromises);
    if (prunedCount > 0) {
      console.log(`[Firebase Pruner] Pruned ${prunedCount} articles (older than 15 days or deprecated).`);
    }
    return { prunedCount, remainingCount };
  } catch (error) {
    console.error("[Firebase Pruner] Error during automatic pruning:", error);
    return { prunedCount: 0, remainingCount: 0 };
  }
}

/**
 * Retrieves all valid articles from Firestore (under 14 days old),
 * automatically seeding initial articles if collection is empty.
 */
export async function getArticlesFromDb() {
  try {
    const db = getDb();
    const articlesRef = collection(db, "articles");
    const snapshot = await getDocs(articlesRef);

    // If empty, seed Firestore with default initial articles
    if (snapshot.empty) {
      console.log("[Firebase] Seeding initial news articles into Firestore...");
      const now = Date.now();
      const seedPromises = INITIAL_ARTICLES.map((article, idx) => {
        // Offset timestamps slightly for realistic ordering
        const articleCreated = now - (idx * 3 * 3600 * 1000); 
        const docRef = doc(db, "articles", article.id);
        return setDoc(docRef, {
          ...article,
          createdAtMs: articleCreated,
          updatedAt: new Date(articleCreated).toISOString()
        });
      });
      await Promise.all(seedPromises);
      
      // Re-fetch after seeding
      const seededSnapshot = await getDocs(articlesRef);
      const seededArticles: any[] = [];
      seededSnapshot.forEach(docSnap => seededArticles.push(docSnap.data()));
      return seededArticles.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
    }

    // Run 14-day automatic pruning pass
    await pruneOldArticles();

    // Fetch remaining active articles
    const remainingSnapshot = await getDocs(articlesRef);
    const articles: any[] = [];
    remainingSnapshot.forEach((docSnap) => {
      articles.push(docSnap.data());
    });

    return articles.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
  } catch (error) {
    console.error("[Firebase] Error fetching articles from Firestore:", error);
    // Fallback to in-memory initial articles if Firestore connection has issue
    return INITIAL_ARTICLES;
  }
}

/**
 * Saves or updates a single article document in Firestore.
 */
export async function saveArticleToDb(article: any) {
  try {
    const db = getDb();
    const now = Date.now();
    const articleData = {
      ...article,
      createdAtMs: article.createdAtMs || now,
      updatedAt: new Date().toISOString()
    };
    const docRef = doc(db, "articles", article.id);
    await setDoc(docRef, articleData);
    return articleData;
  } catch (error) {
    console.error("[Firebase] Error saving article to Firestore:", error);
    throw error;
  }
}

/**
 * Deletes an article document by ID from Firestore.
 */
export async function deleteArticleFromDb(id: string) {
  try {
    const db = getDb();
    const docRef = doc(db, "articles", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`[Firebase] Error deleting article ${id} from Firestore:`, error);
    throw error;
  }
}
