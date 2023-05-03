import logo from "./logo.svg";
import "./App.css";
import Pool from "./components/Pool";
import { alertPrompt } from "./components/permissionPrompt/PermissionPromp";

// import './swRegistration'
import { useEffect, useId, useRef, useState } from "react";
import MultiTabTest from "./components/multiTabTest/MultiTabTest";
import WebWorkerTest from "./components/webWorkers/WebWorkersTest";
import SharedWorkerTest from "./components/multiTabTest/SharedWorkerTest";

function App() {
  // #region useEffect

  const [pageId, setPageId] = useState("");

  const connectShareWorker = () => {
    // const worker = new SharedWorker("./workers/sharedWorker.ts")
    const worker = new SharedWorker(
      new URL("./workers/sharedWorker.ts", import.meta.url),
      {
        type: "module",
      }
    );

  

    worker.port.start();
    console.log("worker port started...");

    worker.port.onmessage = (event) => {
      console.log("event -- Main thread", event);
      // if (event.data === "connect") {
      // Establish socket connection
      // const socket = new WebSocket("ws://localhost:8080");
      // ...
      // }
    };

    worker.port.postMessage("connect");
  }

  useEffect(() => {
   

    // navigator.serviceWorker.addEventListener("message", (event) => {
    //   console.log("message received")
    //   console.log(event.data.type, event.data.clientId);

    //   setPageId(pageId)
    // });

    // navigator.serviceWorker.controller?.postMessage({ type: 'INITIATE_WINDOW' });
  }, []);

  // #region functions
  const setPrompt = async () => {
    const res = await alertPrompt();

    console.log("res", res);
  };

  const postMessage = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration: any) => {
        // Send a message to the service worker
        registration.active.postMessage({
          type: "SKIP_WAITING",
          message: "Hi",
        });
      });
    }
  };
  // #endregion functions
  // console.log("prompt")
  return (
    <div>
      {/* <img src={logo} /> */}
      <Pool />

      <button onClick={setPrompt}>prompt</button>

      <button onClick={postMessage}>Post Message</button>

      <button onClick={connectShareWorker}>Connect Shared Worker</button>
      
      <SharedWorkerTest />
      {/* <MultiTabTest pageId={pageId}  /> */}

      {/* <WebWorkerTest /> */}
    </div>
  );
}

export default App;
