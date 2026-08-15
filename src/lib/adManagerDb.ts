import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from "firebase/firestore";
import { getDb } from "./firebaseDb.js";
import { INITIAL_ADS } from "../data/mockAds.js";
import { AdBanner } from "../types.js";

// In-memory cache store initialized with default ads to guarantee instant synchronization
let memoryAdsStore: AdBanner[] = [...INITIAL_ADS];
let isInitialSeedingDone = false;
let memoryMonetizationEnabled: boolean = true;

/**
 * Retrieves the global monetization engine status from Firestore.
 */
export async function getMonetizationStatusFromDb(): Promise<boolean> {
  try {
    const db = getDb();
    const docRef = doc(db, "settings", "monetization");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (typeof data.monetizationEnabled === "boolean") {
        memoryMonetizationEnabled = data.monetizationEnabled;
        return memoryMonetizationEnabled;
      }
    } else {
      // Initialize default
      await setDoc(docRef, {
        id: "monetization",
        monetizationEnabled: true,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn("[Firebase Settings] Using memory monetization status fallback:", error);
  }
  return memoryMonetizationEnabled;
}

/**
 * Updates the global monetization engine status in Firestore.
 */
export async function setMonetizationStatusInDb(enabled: boolean): Promise<boolean> {
  memoryMonetizationEnabled = enabled;
  try {
    const db = getDb();
    const docRef = doc(db, "settings", "monetization");
    await setDoc(docRef, {
      id: "monetization",
      monetizationEnabled: enabled,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log(`[Firebase Settings] Monetization status persisted to Firestore: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  } catch (error) {
    console.warn("[Firebase Settings] Error updating monetization in Firestore:", error);
  }
  return memoryMonetizationEnabled;
}

/**
 * Retrieves all ad banners from Firestore database in the cloud.
 * Automatically seeds default ads ONLY on the very first initialization when database is completely empty.
 */
export async function getAdsFromDb(): Promise<AdBanner[]> {
  try {
    const db = getDb();
    const adsRef = collection(db, "ads");
    const snapshot = await getDocs(adsRef);

    if (snapshot.empty && !isInitialSeedingDone) {
      isInitialSeedingDone = true;
      console.log("[Firebase Ads] Seeding initial ad banners into Firestore database...");
      const seedPromises = INITIAL_ADS.map((ad) => {
        const docRef = doc(db, "ads", ad.id);
        return setDoc(docRef, {
          ...ad,
          createdAtMs: ad.createdAtMs || Date.now(),
          updatedAt: new Date().toISOString()
        });
      });
      await Promise.all(seedPromises);

      const seededSnapshot = await getDocs(adsRef);
      const seededAds: AdBanner[] = [];
      seededSnapshot.forEach(docSnap => seededAds.push(docSnap.data() as AdBanner));
      if (seededAds.length > 0) {
        memoryAdsStore = seededAds;
      }
      return memoryAdsStore.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAtMs || 0).getTime();
        const timeB = new Date(b.updatedAt || b.createdAtMs || 0).getTime();
        return timeB - timeA;
      });
    }

    isInitialSeedingDone = true;
    const ads: AdBanner[] = [];
    snapshot.forEach((docSnap) => {
      ads.push(docSnap.data() as AdBanner);
    });

    memoryAdsStore = ads;
    return memoryAdsStore.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAtMs || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAtMs || 0).getTime();
      return timeB - timeA;
    });
  } catch (error) {
    console.error("[Firebase Ads] Error fetching ads from Firestore, using memoryStore fallback:", error);
    return memoryAdsStore.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAtMs || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAtMs || 0).getTime();
      return timeB - timeA;
    });
  }
}

/**
 * Resets or re-seeds all standard sample sponsors across locations and themes into Firestore and memory store.
 */
export async function resetSampleSponsorsInDb(): Promise<AdBanner[]> {
  const db = getDb();
  memoryAdsStore = [...INITIAL_ADS];
  
  try {
    const seedPromises = INITIAL_ADS.map((ad) => {
      const docRef = doc(db, "ads", ad.id);
      return setDoc(docRef, {
        ...ad,
        createdAtMs: ad.createdAtMs || Date.now(),
        updatedAt: new Date().toISOString()
      });
    });
    await Promise.all(seedPromises);
  } catch (err) {
    console.error("[Firebase Ads] Error resetting sample sponsors in Firestore:", err);
  }

  return memoryAdsStore;
}

/**
 * Creates or updates an ad banner document in Firestore and memory store.
 */
export async function saveAdToDb(adData: Partial<AdBanner> & { id?: string }): Promise<AdBanner> {
  const now = Date.now();
  const id = adData.id || `ad-${adData.category || 'promo'}-${now}`;

  const completeAd: AdBanner = {
    id,
    advertiserName: adData.advertiserName || 'Local Premier Business',
    category: adData.category || 'realtor',
    placement: adData.placement || 'feed-native',
    targetCity: adData.targetCity || 'All',
    title: adData.title || 'Special Promotion',
    subtitle: adData.subtitle || '',
    ctaText: adData.ctaText || 'Learn More',
    ctaUrl: adData.ctaUrl || '#',
    imageUrl: adData.imageUrl || '',
    logoUrl: adData.logoUrl || '',
    bgImageUrl: adData.bgImageUrl || '',
    sponsorBadge: adData.sponsorBadge || 'Featured Partner',
    phone: adData.phone || '',
    status: adData.status || 'active',
    priority: adData.priority || 'standard',
    impressions: adData.impressions || 0,
    clicks: adData.clicks || 0,
    createdAtMs: adData.createdAtMs || now,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately update in-memory store so changes reflect instantly
  const idx = memoryAdsStore.findIndex(a => a.id === id);
  if (idx >= 0) {
    memoryAdsStore[idx] = completeAd;
  } else {
    memoryAdsStore.unshift(completeAd);
  }

  // 2. Persist cleanly to Firestore cloud database
  try {
    const db = getDb();
    const docRef = doc(db, "ads", id);
    await setDoc(docRef, completeAd);
    console.log(`[Firebase Ads] Successfully persisted ad "${id}" to Firestore cloud database.`);
  } catch (error) {
    console.error("[Firebase Ads] Error saving ad to Firestore cloud database:", error);
    throw error;
  }

  return completeAd;
}

/**
 * Deletes an ad banner document from Firestore cloud database and memory store.
 */
export async function deleteAdFromDb(id: string): Promise<boolean> {
  // 1. Instantly purge from memory store
  memoryAdsStore = memoryAdsStore.filter(a => a.id !== id);

  // 2. Delete from Firestore cloud database
  try {
    const db = getDb();
    const docRef = doc(db, "ads", id);
    await deleteDoc(docRef);
    console.log(`[Firebase Ads] Successfully deleted ad "${id}" from Firestore cloud database.`);
  } catch (error) {
    console.warn(`[Firebase Ads] Deleted "${id}" from memory, Firestore deletion note:`, error);
  }

  return true;
}

/**
 * Increments impression counter for an ad.
 */
export async function recordAdImpression(id: string): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "ads", id);
    await updateDoc(docRef, {
      impressions: increment(1),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn(`[Firebase Ads] Could not record impression for ad ${id}:`, error);
  }
}

/**
 * Increments click counter for an ad.
 */
export async function recordAdClick(id: string): Promise<void> {
  try {
    const db = getDb();
    const docRef = doc(db, "ads", id);
    await updateDoc(docRef, {
      clicks: increment(1),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn(`[Firebase Ads] Could not record click for ad ${id}:`, error);
  }
}
