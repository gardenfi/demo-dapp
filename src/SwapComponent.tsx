import { useMetaMaskStore, useAmountStore, useAddressStore } from "./store";

const SwapComponent: React.FC = () => {
  return (
    <div className="swap-component">
      <SwapComponentTop />
      <hr></hr>
      <SwapComponentMiddle />
      <hr></hr>
      <SwapComponentBottom />
    </div>
  );
};

const SwapComponentTop: React.FC = () => {
  const { connectMetaMask, metaMaskIsConnected } = useMetaMaskStore();
  return (
    <div className="swap-component-top-section">
      <span className="swap-title">Swap</span>
      <button
        className="connect-metamask button-black"
        onClick={connectMetaMask}
      >
        {metaMaskIsConnected ? "Connected" : "Connect Metamask"}
      </button>
    </div>
  );
};

const SwapComponentMiddle: React.FC = () => {
  const { wbtcAmount, btcAmount, changeAmount } = useAmountStore();
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

const SwapComponentBottom: React.FC = () => {
  const { btcAddress, updateBtcAddress } = useAddressStore();
  return (
    <div className="swap-component-bottom-section">
      <div>
        <label htmlFor="receive-address">Receive address</label>
        <div className="input-component">
          <input
            id="receive-address"
            placeholder="Enter BTC Address"
            value={btcAddress ? btcAddress : ""}
            onChange={(e) => updateBtcAddress(e.target.value)}
          />
        </div>
      </div>
      <button className="button-white">Swap</button>
    </div>
  );
};

export default SwapComponent;
