import Dexie from "dexie";

export {};

function wait() {
  return new Promise((resolve) => {
    let start = Date.now();
    let delay = 5000;

    while (Date.now() - start < delay) {
      // Loop for 5 seconds
    }

    resolve(true);
  });
}

console.log("Worker started");

// Listen for messages from the main thread
onmessage = async (event: MessageEvent) => {
  const db = new Dexie("myDatabase");
  db.version(1).stores({
    myTable: "++id, data",
    anotherTable: "++id, data",
    thirdTable: "++id, data",
    fourthTable: "++",
  });

  await db.open();

  console.log("Received message from main thread:");

  if (event.data) {
    const obj = event.data;
    console.log("OBJ", obj.type)

    if (obj.type === "SAVE_FIRST_MSG") {
      // await wait()

      // Get the start time
      const startTime = new Date().getTime();

      // Loop for 5 seconds and insert data into the database
      while (new Date().getTime() - startTime < 5000) {
        console.log("saving data....");
        await db.table("myTable").add({ data: event.data });
      }

      console.log("First Message Processed");
    } else if (obj.type === "SAVE_SECOND_MSG") {
      const startTime = new Date().getTime();


      console.log("start saving 2nd", performance.now())
      // Loop for 5 seconds and insert data into the database
      while (new Date().getTime() - startTime < 5000) {
        console.log("saving 2nd msg")
        await db
          .table("anotherTable")
          .add({ data: "Second message saved" }, `${Math.random()}-custom_id`);
      }
      console.log("second data saved....");
      console.log("Second Message Processed");
    } else if (obj.type === "SAVE_THIRD_MSG") {
      const startTime = new Date().getTime();

      console.log("start saving 3rd", performance.now())
      // Loop for 5 seconds and insert data into the database
      while (new Date().getTime() - startTime < 5000) {
        await db
          .table("thirdTable")
          .add({ data: "Third message saved" }, `${Math.random()}-third_id`);
      }
      console.log("third saved")
    } else if (obj.type === "READ_DATA") {
      console.log("reading data");
      const startTime = performance.now();
      // console.log("event.data", event.data)
      const data = await db.table("thirdTable").toArray();
      const endTime = performance.now(); // stop the timer
      const elapsed = (endTime - startTime) / 1000; // calculate elapsed time in seconds

      console.log(`Elapsed time: in reading ${elapsed} seconds`, data);
      // console.timeEnd('task1');
      // console.log("data saved", t2 - t1 /1000)
    } else {
      console.log("saving data");
      const startTime = performance.now();
      // console.log("event.data", event.data)
      await db.table("fourthTable").put(event.data, 'key');
      const endTime = performance.now(); // stop the timer
      const elapsed = (endTime - startTime) / 1000; // calculate elapsed time in seconds

      console.log(`Elapsed time: ${elapsed} seconds`);
      // console.timeEnd('task1');
      // console.log("data saved", t2 - t1 /1000)
    }
  }

  db.close();
  // Do some processing here
  //   const result = event.data + " - processed by the worker";

  // Send a message back to the main thread
  postMessage(
    JSON.stringify({
      type: "TERMINATE",
    })
  );
  // self.postMessage("Task Completed");
};
