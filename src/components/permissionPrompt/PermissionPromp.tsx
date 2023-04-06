import React, { useState } from "react";
import "./prompt.css";
import { createRoot } from "react-dom/client";

interface IPromptForUpdate {
  onUpdate: (val: boolean) => void;
}

const PromptForUpdate: React.FC<IPromptForUpdate> = ({ onUpdate }) => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
    onUpdate(true);
  };

  const handleReject = () => {
    setVisible(false);
    onUpdate(false);
  };

  if (!visible) return null;

  return (
    <div className="prompt-for-update">
      <div className="prompt-for-update-content">
        <p>
          A new version of the app is available. Would you like to update now?
        </p>
        <div className="prompt-for-update-buttons">
          <button onClick={handleAccept}>Yes</button>
          <button onClick={handleReject}>No</button>
        </div>
      </div>
    </div>
  );
};

export const alertPrompt = async function () {
  return await new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const onUpdate = (accepted: boolean) => {

    //   createRoot(container).unmount();
      document.body.removeChild(container);
      resolve(accepted);
    };

    const prompt = <PromptForUpdate onUpdate={onUpdate} />;

    createRoot(container).render(prompt);
  });
};
