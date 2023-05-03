export {};

onmessage = (event: MessageEvent) => {
  console.log("data received");

  console.log("event.data", event.data.length);

  const buffer = event.data;
  const view = new DataView(buffer);
  const numProperties = Object.keys(event.data[0]).length;// ... the number of properties in each object
  const propertyNames= Object.keys(event.data[0]); 
  const length = buffer.byteLength / (4 * numProperties); // assuming each value is 4 bytes
  const result = [];
  let dataIndex = 0;
  for (let i = 0; i < length; i++) {
    const obj = {};
    for (let j = 0; j < numProperties; j++) {
      const value = view.getFloat32(dataIndex * 4);
    //   @ts-ignore
      obj[propertyNames[j]] = value;
      dataIndex++;
    }
    result.push(obj);
  }

  postMessage("");


  console.log("view", result)
};
