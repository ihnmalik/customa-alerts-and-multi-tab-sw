import { createPool, Pool } from "generic-pool";
import { IDBPDatabase, openDB } from "idb";

interface IDBPoolList {
  [key: string]: Pool<IDBPDatabase>;
}
export const dbPoolList: IDBPoolList = {};

export function createDbPool(dbName: string): Pool<IDBPDatabase> {
  const poolFactory = {
    create: (): Promise<IDBPDatabase> => openDB(dbName, 1, {
      upgrade(db) {
        db.createObjectStore('testing-store', {
          autoIncrement: true
        })
      }
    }),
    destroy: (db: IDBPDatabase): Promise<void> =>
      new Promise<void>((resolve, reject) => {
        db.close();
        resolve();
      }),
  };

  const options = {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 5000,
  };

  return createPool(poolFactory, options);
}

// Define a function to get a connection from a pool for a specific database name
export async function getDb(dbName: string) {
    // Check if a pool exists for the database name
    let pool = dbPoolList[dbName];
  
    // If a pool exists, acquire a connection
    if (pool) {
      try {
        const db = await pool.acquire();
        console.log("pool already exists")
        return db;
      } catch (error: any) {
        // If the pool is flushed due to acquireTimeoutMillis or idleTimeoutMillis, create a new pool
        if (error.message === 'ResourceRequest timed out') {
          console.warn(`Pool for ${dbName} was flushed due to timeout, creating a new pool`);
          pool = createDbPool(dbName);
          dbPoolList[dbName] = pool;
          const db = await pool.acquire();
          return db;
        }
        throw error;
      }
    }
  
    // If a pool doesn't exist, create a new pool and acquire a connection
    console.log(`Creating a new pool for ${dbName}`);
    pool = createDbPool(dbName);
    dbPoolList[dbName] = pool;
    const db = await pool.acquire();
    return db;
  }
  
  // Define a function to release a connection to a pool for a specific database name
  export async function releaseDb(dbName: string, db: IDBPDatabase) {
    // Check if a pool exists for the database name
    const pool = dbPoolList[dbName];
    if (!pool) {
      throw new Error(`Pool for ${dbName} doesn't exist`);
    }
  
    // Release the connection back to the pool
    await pool.release(db);
    console.log("connection released")
  }