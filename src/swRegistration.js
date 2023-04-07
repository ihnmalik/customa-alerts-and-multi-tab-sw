import { Workbox, WorkboxLifecycleWaitingEvent } from "workbox-window";

const promptForUpdate = async () => {
  const message =
    "A new version of the app is available. Do you want to update?";
  const result = window.prompt(message, "yes");
  return result === "yes";
};

if ("serviceWorker" in navigator) {
  const wb = new Workbox("service-worker.js");

  let registration;

  wb.addEventListener("installed", () => {
    console.log("installed");
  });

  const showSkipWaitingPrompt = async (event) => {
    // WorkboxLifecycleWaitingEvent
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener("controlling", () => {
      // At this point, reloading will ensure that the current
      // tab is loaded under the control of the new service worker.
      // Depending on your web app, you may want to auto-save or
      // persist transient state before triggering the reload.
      window.location.reload();
    });

    // When `event.wasWaitingBeforeRegister` is true, a previously
    // updated service worker is still waiting.
    // You may want to customize the UI prompt accordingly.

    // This code assumes your app has a promptForUpdate() method,
    // which returns true if the user wants to update.
    // Implementing this is app-specific; some examples are:
    // https://open-ui.org/components/alert.research or
    // https://open-ui.org/components/toast.research
    const updateAccepted = await promptForUpdate();

    if (updateAccepted) {
      wb.messageSkipWaiting();
    }

    wb.addEventListener("installed", (event) => {
      console.log(process.env.NODE_ENV, wb, "installed");
    });
  };

  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener("waiting", (event) => {
    showSkipWaitingPrompt(event);
  });

  wb.register()
    .then((registration) => console.log("registration", registration))
    .catch((err) => console.log(err));
}
