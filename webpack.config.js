import path from "path";
import { InjectManifest } from "workbox-webpack-plugin";

module.exports = {
  // other webpack configurations...

  plugins: [
    new InjectManifest({
      swSrc: path.join(__dirname, "build", "service-worker.js"),
      swDest: "service-worker.js",
    }),
  ],
};
