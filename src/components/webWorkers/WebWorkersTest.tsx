import { useEffect, useMemo } from "react";

const generateData = (numRecords: number): any[] => {
  const data = [];
  for (let i = 0; i < numRecords; i++) {
    data.push({
      id: i,
      name: `Record ${i}`,
      description: `This is a record with ID ${i}`,
      timestamp: Date.now(),
    });
  }
  return data;
};

// #region test worker with Shared Array Buffer
const testWorkerWithSharedArrayBuffer = (data: any) => {
  const worker = new Worker(
    new URL("../../workers/sharedArrayBufferWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );

  const startTime = performance.now();
  
  const sheetString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const uint8 = encoder.encode(sheetString);
  const sharedBuffer = new SharedArrayBuffer(uint8.byteLength);
  const sharedUint8 = new Uint8Array(sharedBuffer);
  sharedUint8.set(uint8);
  
  
  const endTime = performance.now();
  const elapsed = (endTime - startTime) // / 1000; // calculate elapsed time in seconds
  console.log(`Elapsed time: ${elapsed} seconds`);

  
  worker.onmessage = () => {
    performance.mark("end");
    performance.measure("duration", "start", "end");
    var duration = performance.getEntriesByName("duration")[0].duration;
    console.log("Time taken: " + duration + "ms");
  };
  
  
  
  
  // worker.postMessage(data);
  performance.mark("start");
  worker.postMessage(sharedBuffer, [sharedBuffer]);
}
// #endregion

// #region test worker with Array Buffer
const testWorkerWithBuffer = (data: any) => {
  const worker = new Worker(
    new URL("../../workers/arrayBufferWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );


  const startTime = performance.now();
  const sheetString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(sheetString);
  const buffer = new ArrayBuffer(dataBytes.length);
  const view = new Uint8Array(buffer);
  view.set(dataBytes);
  const endTime = performance.now();
  const elapsed = (endTime - startTime) // / 1000; // calculate elapsed time in seconds
  console.log(`Elapsed time: ${elapsed} seconds`);
  // const view = new Uint8Array(buffer);
  // for (let i = 0; i < dataBytes.length; i++) {
  //   view[i] = dataBytes[i];
  // }
  // Create a SharedArrayBuffer to store the sheet string
  // const buffer = new SharedArrayBuffer(sheetString.length * 2);

  // // Create a view of the buffer to write the sheet string
  // const writer = new Int16Array(buffer);
  // for (let i = 0; i < sheetString.length; i++) {
  //   writer[i] = sheetString.charCodeAt(i);
  // }

  worker.onmessage = () => {
    performance.mark("end");
    performance.measure("duration", "start", "end");
    var duration = performance.getEntriesByName("duration")[0].duration;
    console.log("Time taken: " + duration + "ms");
  };

   performance.mark("start");
  // worker.postMessage(data);
  worker.postMessage(buffer, [buffer]);
};
// #endregion test worker with Array Buffer


// #region test post speed with worker
const testPostSpeedWithWorker = (data: any) => {
  const worker = new Worker(
    new URL("../../workers/speedTestWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );

  worker.onmessage = () => {
    performance.mark("end");
    performance.measure("duration", "start", "end");
    var duration = performance.getEntriesByName("duration")[0].duration;
    console.log("Time taken: " + duration + "ms");
  };

  const startTime = performance.now();

  const bytesInFloat32 = 4;
  // const dataArray = new Float32Array(
  //   new ArrayBuffer(bytesInFloat32 * data.length * Object.keys(data[0]).length)
  // );
  // let dataIndex = 0;
  // for (let i = 0; i < data.length; i++) {
  //   for (let key in data[i]) {
  //     dataArray[dataIndex++] = data[i][key];
  //   }
  // }
  // worker.postMessage(dataArray.buffer, [dataArray.buffer]); // pass ownership of the buffer to the worker

  // shared array buffer
  var buffer = new SharedArrayBuffer(data.length * Float64Array.BYTES_PER_ELEMENT);
  var view = new Float64Array(buffer);
  view.set(data);
  // Array buffer
  // const bytesInFloat32 = 4;
  // const dataArray = new Float32Array(
  //   new ArrayBuffer(bytesInFloat32 * data.length)
  // );
  // dataArray.set(data);
  const endTime = performance.now();
  const elapsed = (endTime - startTime) / 1000; // calculate elapsed time in seconds

  console.log(`Elapsed time: ${elapsed} seconds`);

  // const t1 = performance.now()
  performance.mark("start");
  worker.postMessage(buffer, [buffer]);
  // worker.postMessage(dataArray.buffer, [dataArray.buffer]);
};
// #endregion

const executeExternalWorker = (
  type = "SAVE_FIRST_MSG",
  msg = "Hello from the main thread!"
) => {
  const worker = new Worker(
    new URL("../../workers/dbWorker.ts", import.meta.url),
    {
      type: "module",
    }
  );

  worker.onmessage = (event: MessageEvent) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      if (data.type === "TERMINATE") {
        console.log("terminating worker");
        worker.terminate();
      }
    }
  };
  console.log("posting message...");

  worker.postMessage({
    msg,
    type,
  });
  // worker.postMessage(
  //   JSON.stringify({
  //       msg,
  //       type,
  //   })
  // );
};

const WebWorkerTest = () => {
  const worker1: Worker = useMemo(
    () => new Worker(new URL("../../workers/dbWorker.ts", import.meta.url)),
    []
  );

  const worker2: Worker = useMemo(
    () => new Worker(new URL("../../workers/dbWorker.ts", import.meta.url)),
    []
  );

  useEffect(() => {
    // worker1Ref.current = new Worker("");

    // Listen for messages from worker 1
    worker1.onmessage = (event: MessageEvent) => {
      console.log("Received message from worker 1:", event.data);
    };

    worker2.onmessage = (event: MessageEvent) => {
      console.log("Received message from worker 2:", event.data);
    };

    const data = generateData(3500000);
    const t1 = performance.now();
    JSON.stringify(data);
    const t2 = performance.now();
    console.log("t2-t1", t2 - t1);

    const t3 = performance.now();

    const t4 = performance.now();
    console.log("t4-t3", t4 - t3);

    return () => {
      worker1.terminate();
      worker2.terminate();
    };
  }, []);

  const postFirstMessage = () => {
    if (worker1) {
      worker1.postMessage({
        msg: "Hello from the main thread!",
        type: "SAVE_FIRST_MSG",
      });

      //   webWorker.terminate();
    }
  };

  const postAnotherMessage = () => {
    if (worker2) {
      worker2.postMessage({
        msg: "2nd Message",
        type: "SAVE_SECOND_MSG",
      });

      //   webWorker.terminate();
    }
  };

  const data = generateData(5000);

  return (
    <div>
      <button onClick={postFirstMessage}>Post 1st Message to Web-worker</button>
      <button onClick={postAnotherMessage}>
        Post 2nd Message to Web-worker
      </button>
      <button onClick={() => executeExternalWorker()}>
        External worker wait msg
      </button>
      <button onClick={() => executeExternalWorker("SAVE_SECOND_MSG")}>
        External worker 2nd msg
      </button>
      <button onClick={() => executeExternalWorker("SAVE_THIRD_MSG")}>
        External worker 3rd msg
      </button>
      <button onClick={() => executeExternalWorker("", JSON.stringify(data))}>
        External worker with large data
      </button>
      <button onClick={() => executeExternalWorker("READ_DATA")}>
        Read Data
      </button>

      <div>
        <button onClick={() => testPostSpeedWithWorker(data)}>
          Test Post Speed
        </button>
      </div>

      <button onClick={() => testWorkerWithBuffer(data)}>
        Test Array Buffer
      </button>

      <div>
        <button onClick={() => testWorkerWithSharedArrayBuffer(data)}>
          Test Shared Array Buffer
        </button>
      </div>
    </div>
  );
};

export default WebWorkerTest;
