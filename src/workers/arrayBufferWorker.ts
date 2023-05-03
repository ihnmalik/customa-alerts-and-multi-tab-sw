
export {}

onmessage = (event: MessageEvent) => {
    const buffer = event.data;
    const view = new Uint8Array(buffer);
    const decoder = new TextDecoder();
    const dataString = decoder.decode(view);
    const data = JSON.parse(dataString);

    postMessage("")

    // console.log("data", data)
}