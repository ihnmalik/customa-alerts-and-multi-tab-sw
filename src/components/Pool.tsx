import { getDb, releaseDb } from "../dbPool/pool"




const Pool = () => {

    const writeData = async () => {
        const dbName = "wal";
        const db = getDb(dbName)
        await db.then(async (db) => {
            // db.transaction('testing-store', 'readwrite')
            await db.put('testing-store', 'Hasaan')

            releaseDb(dbName, db)
        })
        .catch(() => {
            console.log("db not found")
        })  

    }

    return (
        <div>
            <button onClick={writeData}>Testing Pool</button>
        </div>
    )
}

export default Pool