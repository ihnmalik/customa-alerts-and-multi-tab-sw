/// <reference lib="webworker" />
/// <reference types="workbox-precaching" />
/// <reference types="workbox-routing" />
/// <reference types="workbox-background-sync" />
import { precacheAndRoute } from "workbox-precaching";
import {
  registerRoute,
  Route,
  NavigationRoute,
  RegExpRoute,
} from "workbox-routing";
import {Queue} from 'workbox-background-sync';
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import Dexie from 'dexie'

// Creating a queue for saving failed network request that'll be automatically handled by service worker on network restored
// BackgroundSyncPlugin: the failed requests are stored in IndexedDB
const queue = new Queue('failedRequestsQueue');


// Important as InjectManifest Method will look for self.__WB_MANIFEST
// then replace it by origin manifest(contains list of url/filepaths)
// then precacheAndRoute add it to cache 
// declare const self: ServiceWorkerGlobalScope;

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

// Handle images:
const imageRoute = new Route(
  ({ request }) => {
    return request.destination === "image";
  },
  new StaleWhileRevalidate({
    cacheName: "images",
  })
);

// We may need it in future when we'll have multiple pages to navigate & it should use NetworkFirst stragegy to
// ensure that the most up-to-date content is always served to the user
const pagesRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: "pages",
  })
);

// All Files with mathing regular expression shoud use NetworkFirst Stratregy
// As it will serve fresh data from the network and then add it to cache for offline use
const filesRoute = new RegExpRoute(
  /\.(tsx|ts|js|scss|css|html|json)$/,
  new NetworkFirst({ cacheName: "files" })
);

registerRoute(imageRoute);
registerRoute(pagesRoute);
registerRoute(filesRoute);


// Service worker message event 
self.addEventListener("message", async (event: any) => {
  console.log("event", event)
  console.log("message", event?.data.message)

  console.log('event-type',event.data.type)
  switch(event.data.type) {
    case "SAVE_SHEET_WAL": {
      saveSheetWAL(event.data.sheetId, event.source.id, event.data.message)
      break;
    }
  }

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  // switch(event.data.type) {
  //   case "INITIATE_WINDOW":
  //     console.log("initiaing window")
  //     postWindowId(event.source.id)
  //     break;
  // }
});

const saveSheetWAL = async (sheetId: string, clientId: string, message: string) => {
  const activeWAL = 1
      const db = new Dexie(`${sheetId}/${clientId}/${activeWAL}`)
      db.version(1).stores({
        walInfo: "++",
        store: '++'
      })

      await db.open()

      await db.table('store').put(message)
}

// self.addEventListener('activate', async (event: any) => {
//     console.log("activate")
//   // postWindowId()

//   console.log("event", event, event.source.id)

// });


// #region set window id
// const postWindowId = async (clientId: string) => {
//   // Calculate the total number of windows currently open for your app
 
  
//   const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
//   const numWindows = windows.length;

//   const client = await self.clients.get(clientId);

//   console.log("client", client)
//   if (!client) return;
//       // Send a message to the client.
//       client.postMessage({ type: 'Window_Id',  clientId});
  
//   // Broadcast the total number of windows to all other windows
//   // const channel = new BroadcastChannel('multi-tab-support');
//   // channel.postMessage({ type: 'numWindows', numWindows });
// }
// #endregion set window id

// #region fetch 
self.addEventListener('fetch', (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== 'POST') {
    return;
  }

  const bgSyncLogic = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({request: event.request});
      // return error;
      return new Response(null, {status: 503, statusText: 'Service Unavailable'});
    }
  };

  event.respondWith(bgSyncLogic());
});
// #endregion fetch
