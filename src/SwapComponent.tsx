function SwapComponent() {
  return (
    <div className="swap-component">
      <SwapComponentTop />
      <hr></hr>
      <SwapComponentMiddle />
      <hr></hr>
      <SwapComponentBottom />
    </div>
  );
}

function SwapComponentTop() {
  return (
    <div className="swap-component-top-section">
      <span className="swap-title">Swap</span>
      <button className="connect-metamask button-black">
        Connect Metamask
      </button>
    </div>
  );
}

function SwapComponentMiddle() {
  return (
    <div className="swap-component-middle-section">
      <div>
        <label htmlFor="send-input">Send WBTC</label>
        <div className="input-component">
          <input id="send-input" placeholder="WBTC" />
          <button>WBTC</button>
        </div>
      </div>
      <div>
        <label htmlFor="receive-input">Receive BTC</label>
        <div className="input-component">
          <input id="receive-input" placeholder="BTC" />
          <button>BTC</button>
        </div>
      </div>
    </div>
  );
}

function SwapComponentBottom() {
  return (
    <div className="swap-component-bottom-section">
      <div>
        <label htmlFor="receive-address">Receive address</label>
        <div className="input-component">
          <input id="receive-address" placeholder="Enter BTC Address" />
        </div>
      </div>
      <button className="button-white">Initiate</button>
    </div>
  );
}

export default SwapComponent;
