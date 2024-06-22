import { useEffect } from "react";
import { create } from "zustand";
import { EVMWallet } from "@catalogfi/wallets";
import { BrowserProvider } from "ethers";
import { GardenJS } from "@gardenfi/core";
import { Assets, Actions, parseStatus } from "@gardenfi/orderbook";
import { Orderbook, Chains } from "@gardenfi/orderbook";
import {
  BitcoinNetwork,
  BitcoinOTA,
  BitcoinProvider,
} from "@catalogfi/wallets";

type EvmWalletState = {
  metaMaskIsConnected: boolean;
  evmProvider: BrowserProvider | null;
};

type EvmWalletAction = {
  connectMetaMask: () => Promise<void>;
};

const useMetaMaskStore = create<EvmWalletState & EvmWalletAction>((set) => ({
  metaMaskIsConnected: false,
  evmProvider: null,
  connectMetaMask: async () => {
    if (window.ethereum !== null) {
      const provider = new BrowserProvider(window.ethereum);
      set(() => ({
        evmProvider: provider,
        metaMaskIsConnected: true,
      }));
    } else {
      throw new Error("MetaMask not Found");
    }
  },
}));

type GardenStore = {
  garden: GardenJS | null;
  setGarden: (garden: GardenJS) => void;
};

const gardenStore = create<GardenStore>((set) => ({
  garden: null,
  setGarden: (garden: GardenJS) => {
    set(() => ({
      garden,
    }));
  },
}));

const useGardenStore = () => gardenStore((state) => state.garden);

const useGardenSetup = () => {
  const evmProvider = useMetaMaskStore((state) => state.evmProvider);
  const setGarden = gardenStore((state) => state.setGarden);

  useEffect(() => {
    (async () => {
      if (!evmProvider) return;
      const signer = await evmProvider.getSigner();
      const bitcoinProvider = new BitcoinProvider(BitcoinNetwork.Testnet);

      const orderbook = await Orderbook.init({
        url: "https://stg-test-orderbook.onrender.com/",
        signer: signer,
        opts: {
          domain: (window as any).location.host,
          store: localStorage,
        },
      });

      const wallets = {
        [Chains.bitcoin_testnet]: new BitcoinOTA(bitcoinProvider, signer),
        [Chains.ethereum_sepolia]: new EVMWallet(signer),
      };

      const garden = new GardenJS(orderbook, wallets);

      setGarden(garden);
    })();
  }, [evmProvider]);
};

export {
  useMetaMaskStore,
  useGardenStore,
  useGardenSetup,
};
