import { Workbox } from "workbox-window";

export default function registerServiceWorker() {
  // if ("production" !== process.env.NODE_ENV) {
  //   return;
  // }
  // Check if the serviceWorker Object exists in the navigator object ( means if browser supports SW )
  if ("serviceWorker" in navigator) {
    const wb = new Workbox("service-worker.js");

    wb.addEventListener("installed", (event) => {
      console.log(process.env.NODE_ENV, wb, "installed");
      /**
       * We have the condition - event.isUpdate because we don't want to show
       * this message on the very first service worker installation,
       * only on the updated
       */
      // if (event.isUpdate) {
      //   if (confirm(`New app update is available!. Click OK to refresh`)) {
      //     window.location.reload();
      //   }
      // }
    });
    wb.register();
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
