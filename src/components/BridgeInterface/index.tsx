"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import BridgeAIAgent from "../../services/BridgeAIAgent";
import type { BridgeResponse } from "../../services/BridgeAIAgent/types";

const BridgeInterface: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<BridgeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProviderReady, setIsProviderReady] = useState(false);

  useEffect(() => {
    const initializeProvider = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        BridgeAIAgent.setProvider(provider);
        setIsProviderReady(true);
      }
    };

    initializeProvider();
  }, []);

  const handleBridge = async () => {
    if (!userInput.trim() || !isProviderReady) return;

    setLoading(true);
    try {
      const response = await BridgeAIAgent.handleBridgeRequest(userInput);
      setResult(response);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setResult({
        status: "error",
        message: error.message,
        userInstructions: "Please try again or use the manual bridge interface",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isProviderReady) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Web3 Provider Not Found</AlertTitle>
          <AlertDescription>
            Please install MetaMask or another Web3 wallet to use this
            application.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Bridge Assistant</h1>
        <p className="text-gray-600">
          Tell me how much ETH you want to bridge to Arbitrum Sepolia
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Example: I want to bridge 0.001 sepolia to arbitrum"
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleBridge}
          disabled={loading || !userInput.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Processing...
            </>
          ) : (
            "Bridge ETH"
          )}
        </button>

        {result && (
          <Alert
            className={
              result.status === "success" ? "bg-green-50" : "bg-red-50"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-lg font-semibold">
              {result.status === "success" ? "Success!" : "Error"}
            </AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <p>{result.message}</p>
                {result.txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${result.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    View on Etherscan →
                  </a>
                )}
                {result.userInstructions && (
                  <div className="mt-4 p-3 bg-white rounded-lg border">
                    <h4 className="font-medium mb-2">Next Steps:</h4>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {result.userInstructions}
                    </pre>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default BridgeInterface;
