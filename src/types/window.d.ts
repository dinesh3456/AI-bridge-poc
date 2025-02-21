/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/window.d.ts

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, handler: (params?: any) => void) => void;
    removeListener: (
      eventName: string,
      handler: (params?: any) => void
    ) => void;
  };
}
