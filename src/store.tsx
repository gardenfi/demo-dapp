import { useEffect } from "react";
import { create } from "zustand";
import { EVMWallet } from "@catalogfi/wallets";
// import {BitcoinProvider, BitcoinNetwork} from "@catalogfi/wallets";
import { BrowserProvider } from "ethers";
import { type GardenJS } from "@gardenfi/core";

import {
  Orderbook,
  Chains,
  Assets,
  Actions,
  parseStatus,
} from "@gardenfi/orderbook";

type EvmWalletState = {
  metaMaskIsConnected: boolean;
  evmProvider: BrowserProvider | null;
  evmWallet: EVMWallet | null;
};

type EvmWalletAction = {
  connectMetaMask: () => Promise<void>;
};

const useMetaMaskStore = create<EvmWalletState & EvmWalletAction>((set) => ({
  metaMaskIsConnected: false,
  evmProvider: null,
  evmWallet: null,
  connectMetaMask: async () => {
    if (window.ethereum !== null) {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      set(() => ({
        evmProvider: provider,
        evmWallet: new EVMWallet(signer),
        metaMaskIsConnected: true,
      }));
    } else {
      throw new Error("MetaMask not Found");
    }
  },
}));

// type BitcoinWalletState = {
//   BitcoinProvider: BitcoinProvider | null;
//   BitcoinWallet: EVMWallet | null;
// };

// type BitcoinWalletAction = {
//   updateWallet: () => Promise<void>;
// };

// const useBitcoinStore = create<BitcoinWalletState & BitcoinWalletAction>(
//   (set) => ({
//     BitcoinProvider: new BitcoinProvider(BitcoinNetwork.Testnet),
//     BitcoinWallet: null,
//     updateWallet: async () => {
//       set(() => ({
//         BitcoinWallet: new EVMWallet(signer),
//       }));
//     },
//   })
// );

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
    async () => {
      const orderbook = await Orderbook.init({
        signer: ,
      });
    };
  }, [evmProvider]);
};

export {
  useMetaMaskStore,
  useAmountStore,
  useAddressStore,
  useGardenStore,
  useGardenSetup,
};
