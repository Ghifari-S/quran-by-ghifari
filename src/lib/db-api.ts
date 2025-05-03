import { openDB, IDBPDatabase } from "idb";

const DB_NAME: string = "Quran";
const  STORE_NAME = "pages";
const DB_VERSION = 1;
let  dbInstance: IDBPDatabase<any> | null = null;

async function initDB(): Promise<IDBPDatabase<any>> {
  if (!dbInstance) {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      },
    });
  }
  return dbInstance;
}

// Tambah Data
export async function addData(data: any): Promise<IDBValidKey> {
  const db = await initDB();
  return db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).add(data);
}

// Ambil Semua Data
export async function getAllData(): Promise<any[]> {
  const db = await initDB();
  return db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
}

// Ambil Data Berdasarkan ID
export async function getDataById(id: IDBValidKey): Promise<any | undefined> {
  const db = await initDB();
  return db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
}

// Update Data
export async function updateData(data: any): Promise<IDBValidKey> {
  const db = await initDB();
  return db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(data);
}

// Hapus Data
export async function deleteData(id: IDBValidKey): Promise<void> {
  const db = await initDB();
  return db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
}
