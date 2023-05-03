export {};

onmessage = (event: MessageEvent) => {
  const sharedUint8 = new Uint8Array(event.data);
  const str = new TextDecoder().decode(sharedUint8);
  const obj = JSON.parse(str);

  postMessage("");

  console.log("obj", obj)
};
