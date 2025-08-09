interface PhantomSolana {
  isPhantom: boolean;
  request: (params: { method: string; params?: any }) => Promise<any>;
}

interface Window {
  phantom?: {
    solana?: PhantomSolana;
  };
}
