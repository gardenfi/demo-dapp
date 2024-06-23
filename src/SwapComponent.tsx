import { useState } from "react";
import { useMetaMaskStore, useGardenStore, useGardenSetup } from "./store";
import { Assets } from "@gardenfi/orderbook";

const SwapComponent: React.FC = () => {
  useGardenSetup();
  const [amount, setAmount] = useState<{
    btcAmount: string | null;
    wbtcAmount: string | null;
  }>({ btcAmount: null, wbtcAmount: null });

  const { wbtcAmount, btcAmount } = amount;

  const changeAmount = (of: "WBTC" | "BTC", value: string) => {
    if (of === "WBTC") {
      if (Number(value) <= 0) {
        setAmount(() => ({
          wbtcAmount: value,
          btcAmount: null,
        }));
        return;
      }

      const btcAmount = (1 - 0.3 / 100) * Number(value);
      setAmount(() => ({
        wbtcAmount: value,
        btcAmount: btcAmount.toString(),
      }));
    }
  };

  return (
    <div className="swap-component">
      <SwapComponentTop />
      <hr></hr>
      <SwapComponentMiddle
        amount={amount}
        setAmount={setAmount}
        wbtcAmount={wbtcAmount}
        btcAmount={btcAmount}
        changeAmount={changeAmount}
      />
      <hr></hr>
      <SwapComponentBottom
        wbtcAmount={wbtcAmount}
        btcAmount={btcAmount}
        changeAmount={changeAmount}
      />
    </div>
  );
};

const SwapComponentTop: React.FC = () => {
  const { connectMetaMask, metaMaskIsConnected } = useMetaMaskStore();
  return (
    <div className="swap-component-top-section">
      <span className="swap-title">Swap</span>
      <button
        className={`connect-metamask button-${
          metaMaskIsConnected ? "black" : "white"
        }`}
        onClick={connectMetaMask}
      >
        {metaMaskIsConnected ? "Connected" : "Connect Metamask"}
      </button>
    </div>
  );
};

const SwapComponentMiddle: React.FC<{
  amount: { wbtcAmount: string | null; btcAmount: string | null };
  changeAmount: (of: "WBTC" | "BTC", value: string) => void;
  wbtcAmount: string | null;
  btcAmount: string | null;
  setAmount: React.Dispatch<
    React.SetStateAction<{
      btcAmount: string | null;
      wbtcAmount: string | null;
    }>
  >;
}> = ({ wbtcAmount, btcAmount, changeAmount }) => {
  return (
    <div className="swap-component-middle-section">
      <div>
        <label htmlFor="send-input">Send WBTC</label>
        <div className="input-component">
          <input
            id="send-input"
            placeholder="0"
            value={wbtcAmount ? wbtcAmount : ""}
            type="number"
            onChange={(e) => changeAmount("WBTC", e.target.value)}
          />
          <button>WBTC</button>
        </div>
      </div>
      <div>
        <label htmlFor="receive-input">Receive BTC</label>
        <div className="input-component">
          <input
            id="receive-input"
            placeholder="0"
            value={btcAmount ? btcAmount : ""}
            type="number"
            readOnly={true}
          />
          <button>BTC</button>
        </div>
      </div>
    </div>
  );
};

const SwapComponentBottom: React.FC<{
  wbtcAmount: string | null;
  btcAmount: string | null;
  changeAmount: (of: "WBTC" | "BTC", value: string) => void;
}> = ({ wbtcAmount, btcAmount, changeAmount }) => {
  const garden = useGardenStore();
  const [btcAddress, setBtcAddress] = useState<string>();
  const { metaMaskIsConnected } = useMetaMaskStore();

  const handleSwap = async () => {
    if (!garden) return;
    if (
      typeof Number(wbtcAmount) !== "number" ||
      typeof Number(btcAmount) !== "number"
    )
      return;
    const sendAmount = Number(wbtcAmount) * 1e8;
    const recieveAmount = Number(btcAmount) * 1e8;

    setBtcAddress(() => {
      changeAmount("WBTC", "");
      return "";
    });

    await garden.swap(
      Assets.ethereum_sepolia.WBTC,
      Assets.bitcoin_testnet.BTC,
      sendAmount,
      recieveAmount
    );
  };

  return (
    <div className="swap-component-bottom-section">
      <div>
        <label htmlFor="receive-address">Receive address</label>
        <div className="input-component">
          <input
            id="receive-address"
            placeholder="Enter BTC Address"
            value={btcAddress ? btcAddress : ""}
            onChange={(e) => setBtcAddress(e.target.value)}
          />
        </div>
      </div>
      <button
        className={`button-${metaMaskIsConnected ? "white" : "black"}`}
        onClick={handleSwap}
        disabled={!metaMaskIsConnected}
      >
        Swap
      </button>
    </div>
  );
};

export default SwapComponent;
