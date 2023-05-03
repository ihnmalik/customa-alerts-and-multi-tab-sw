import { useEffect, useState } from "react";

function SharedWorkerTest() {
    const [messageFromWorker, setMessageFromWorker] = useState('');
  
    useEffect(() => {
      const sharedWorker = new SharedWorker(
        new URL("../../workers/sharedWorker", import.meta.url),
        {
          type: "module",
        }
      );
  

    //   sharedWorker.port.addEventListener("message", (e) => {
    //     console.log("Recieved message...", e.data)
    //   })
      sharedWorker.port.onmessage = (event) => {
        console.log("event. data", event.data)
        // console.log('Received message from shared worker:', event.data);
        // setMessageFromWorker(event.data);
      };
  
    //   sharedWorker.port.postMessage('Hello from the main thread!');
    //   sharedWorker.port.postMessage('Hello from the main thread!');
    //   sharedWorker.port.postMessage('Hello from the main thread!');
  
      return () => {
        sharedWorker.port.close();
      };
    }, []);
  
    const handleClick = () => {
      const sharedWorker = new SharedWorker('worker.js');
      sharedWorker.port.postMessage('Hello again from the main thread!');
    };
  
    return (
      <div>
        <p>Message from worker: {messageFromWorker}</p>
        <button onClick={handleClick}>Send another message</button>
      </div>
    );
  }
  
  export default SharedWorkerTest;