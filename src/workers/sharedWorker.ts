export {};

const clients = [];
let masterTab: MessagePort;

// @ts-ignore
onconnect = (event: any) => {
  const port = event.ports[0];


  if(!masterTab) {
    masterTab = port;
    clients.push(port)
    port.postMessage({
        type: "MASTER_TAB"
    })
  } else {
    port.postMessage({
        type: "SECONDARY_TAB",
    })
  }


  port.onmessage = (e: MessageEvent) => {
    // console.log("[port]", e.data)
    port.postMessage(Math.random() + e.data +  clients.length);
  }
//   port.onmessage = (event: any) => {
    // console.log("Received message in shared worker:", event.data);
//   };
};

// onmessage = (event) => {
//   console.log("event", event);
  // addEventListener("connect", function(event: any) {
  //   const port = event.ports[0];

  //   clients.push(port);

  //   console.log("port => ",port);
  //   console.log("clients", clients.length)

  //   port.addEventListener("message", function(event: MessageEvent) {
  //     if (event.data === "connect") {
  //       if (!masterTab) {
  //         // masterTab = port
  //         // This is the first tab, set it as the master tab
  //         port.postMessage({
  //             type: "MASTER_TAB",
  //             port
  //         });
  //         // ...
  //       } else {
  //         port.postMessage({
  //             type: "CHILD_TAB",
  //             port
  //         });
  //       }
  //     }
  //   });
// };
