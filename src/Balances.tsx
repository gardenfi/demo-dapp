import { useCallback, useEffect, useState } from "react";
import { useGarden, useMetaMaskStore } from "./store";
import { Contract, formatUnits } from "ethers";
import { ERC20ABI } from "./erc20";
import { BitcoinOTA } from "@catalogfi/wallets";
import { BrowserProvider } from "ethers";

export const Balances = () => {
  const { bitcoin } = useGarden();
  const { evmProvider } = useMetaMaskStore();
  const [bitcoinBalance, setBitcoinBalance] = useState("0");
  const [wbtcBalance, setWBTCBalance] = useState("0");

  const fetchBalance = useCallback(
    async (bitcoin: BitcoinOTA, evmProvider: BrowserProvider) => {
      const balance = await bitcoin.getBalance();
      setBitcoinBalance(Number(formatUnits(balance, 8)).toFixed(6));
      const erc20 = new Contract(
        "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        ERC20ABI,
        evmProvider
      );
      const signer = await evmProvider.getSigner();
      const address = await signer.getAddress();
      const wbtcBalance = await erc20.balanceOf(address);
      setWBTCBalance(
        Number(formatUnits(+wbtcBalance.toString(), 8)).toFixed(6)
      );
    },
    [bitcoin, evmProvider]
  );

  useEffect(() => {
    if (!bitcoin || !evmProvider) return;
    const id = setInterval(() => fetchBalance(bitcoin, evmProvider), 10000);

    return () => clearInterval(id);
  }, [fetchBalance]);

  useEffect(() => {
    if (!bitcoin || !evmProvider) return;
    fetchBalance(bitcoin, evmProvider);
  });

  return (
    <div className="balances">
      <p>Bitcoin: {bitcoinBalance}</p>
      <p>WBTC: {wbtcBalance}</p>
    </div>
  );
};
