import { create } from "zustand";
import { EVMWallet } from "@catalogfi/wallets";
import { BrowserProvider } from "ethers";

type EvmWalletState = {
  metaMaskIsConnected: boolean;
  EvmProvider: BrowserProvider | null;
  EvmWallet: EVMWallet | null;
};

type EvmWalletAction = {
  connectMetaMask: () => Promise<void>;
};

const useMetaMaskStore = create<EvmWalletState & EvmWalletAction>((set) => ({
  metaMaskIsConnected: false,
  EvmProvider: null,
  EvmWallet: null,
  connectMetaMask: async () => {
    if (window.ethereum !== null) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      set(() => ({
        EvmProvider: provider,
        EvmWallet: new EVMWallet(signer),
        metaMaskIsConnected: true,
      }));
    } else {
      throw new Error("MetaMask not Found");
    }
  },
}));

type AmountState = {
  wbtcAmount: string | null;
  btcAmount: string | null;
};

type AmountAction = {
  changeAmount: (of: "WBTC" | "BTC", value: string) => void;
};

const useAmountStore = create<AmountState & AmountAction>((set) => ({
  wbtcAmount: null,
  btcAmount: null,
  changeAmount: (of, value) => {
    if (of === "WBTC") {
      if (Number(value) <= 0) {
        set(() => ({
          wbtcAmount: value,
          btcAmount: null,
        }));
        return;
      }

      const btcAmount = (1 - 0.3 / 100) * Number(value);
      set(() => ({
        wbtcAmount: value,
        btcAmount: btcAmount.toString(),
      }));
    }
  },
}));

type AddressState = {
  btcAddress: string | null;
};

type AddressAction = {
  updateBtcAddress: (btcAddress: string) => void;
};

const useAddressStore = create<AddressState & AddressAction>((set) => ({
  btcAddress: null,
  updateBtcAddress: (btcAddress) => {
    set(() => ({ btcAddress }));
  },
}));

export { useMetaMaskStore, useAmountStore, useAddressStore };
