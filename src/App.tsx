import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Pool from "./components/Pool";
import { promptForUpdate } from "./dbPool/modal";
import { alertPrompt } from "./components/permissionPrompt/PermissionPromp";

// import './swRegistration'

function App() {
  const setPrompt = async () => {
    console.log("calling prompt");
    // const res = await promptForUpdate();

    const res = await alertPrompt()

    console.log("res", res);
  };
  // console.log("prompt")
  return (
    <div>
      <Pool />

      <button onClick={setPrompt}>prompt main</button>
    </div>
  );
}


export default App;
