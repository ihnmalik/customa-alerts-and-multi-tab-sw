// module.exports = {
//   plugins: [
//     new InjectManifest({
//       swSrc: './src/sw.ts',
//       swDest: 'sw.js',
//     }),
//   ],
// }


import path from "path";
import { InjectManifest } from "workbox-webpack-plugin";


export function webpack(config, env) {
  // if (env === "production") {
  const workboxConfigProd = {
    swSrc: path.join(__dirname, "build", "service-worker.js"),
    swDest: "service-worker.js",
    importWorkboxFrom: "disabled",
  };
  // config = removeSWPrecachePlugin(config);
  config.plugins.push(new InjectManifest(workboxConfigProd));
  // }
  return config;
}

// module.exports = {
//   // other webpack configurations...

//   plugins: [
//     new InjectManifest({
//       // swSrc: "./src/service-worker.js",
//       // swDest: "service-worker.js",
//       swSrc: path.join(__dirname, "build", "service-worker.js"), //"./src/service-worker.js" ,
//       swDest: "service-worker.js",
//       importWorkboxFrom: "disabled",
//       // importWorkboxFrom: "disabled",
//     }),
//   ],

// };
