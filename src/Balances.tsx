import { useEffect, useState } from "react";
import { useGarden, useMetaMaskStore } from "./store";
import { Contract } from "ethers";
import { ERC20ABI } from "./erc20";

export const Balances = () => {
  const { bitcoin } = useGarden();
  const { evmProvider } = useMetaMaskStore();
  const [bitcoinBalance, setBitcoinBalance] = useState(0);
  const [wbtcBalance, setWBTCBalance] = useState(0);

  useEffect(() => {
    if (!bitcoin || !evmProvider) return;
    (async () => {
      const balance = await bitcoin.getBalance();
      setBitcoinBalance(balance);
      const erc20 = new Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        ERC20ABI,
        evmProvider
      );
      const signer = await evmProvider.getSigner();
      const address = await signer.getAddress();
      const wbtcBalance = await erc20.balanceOf(address);
      setWBTCBalance(+wbtcBalance.toString());
    })();
  }, [bitcoin, evmProvider]);

  return (
    <div className="balances">
      <p>Bitcoin: {bitcoinBalance}</p>
      <p>WBTC: {wbtcBalance}</p>
    </div>
  );
};
