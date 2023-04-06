import { precacheAndRoute } from "workbox-precaching";
import {
  registerRoute,
  Route,
  NavigationRoute,
  RegExpRoute,
} from "workbox-routing";

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

const filesRoute = new RegExpRoute(
  /\.(tsx|ts|js|scss|css|html|json)$/,
  new NetworkFirst({ cacheName: "files" })
);

registerRoute(imageRoute);
registerRoute(pagesRoute);
registerRoute(filesRoute);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
