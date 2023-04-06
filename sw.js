// import { createDbPool } from './db';

// const dbName = 'my-database';

// // Create a pool of database connections
// const dbPool = createDbPool(dbName);

// // Add a fetch event listener to the service worker
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     // Try to acquire a connection from the connection pool
//     dbPool
//       .acquire()
//       .then((db) =>
//         // Use the connection to fetch the requested data from IndexedDB
//         db
//           .transaction('my-object-store')
//           .objectStore('my-object-store')
//           .get(event.request.url)
//           .finally(() => {
//             // Release the connection back to the pool
//             dbPool.release(db);
//           })
//       )
//       .then((result) => {
//         if (result) {
//           // If the data is found in IndexedDB, return it as the response
//           return new Response(JSON.stringify(result), {
//             headers: { 'Content-Type': 'application/json' },
//           });
//         } else {
//           // If the data is not found in IndexedDB, fetch it from the network
//           return fetch(event.request).then((response) => {
//             if (response.status === 200) {
//               // If the response is successful, store it in IndexedDB for future use
//               dbPool
//                 .acquire()
//                 .then((db) =>
//                   db
//                     .transaction('my-object-store', 'readwrite')
//                     .objectStore('my-object-store')
//                     .put(response.clone().json(), event.request.url)
//                     .finally(() => {
//                       dbPool.release(db);
//                     })
//                 )
//                 .catch((error) => {
//                   console.error('Error storing response in IndexedDB', error);
//                 });
//             }
//             // Return the response to the original request
//             return response;
//           });
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching data from IndexedDB', error);
//         // If an error occurs, fetch the data from the network as a fallback
//         return fetch(event.request);
//       })
//   );
// });
