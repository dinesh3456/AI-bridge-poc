// src/App.tsx

import React from "react";
import BridgeInterface from "../components/BridgeInterface";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <BridgeInterface />
      </div>
    </div>
  );
};

export default App;
