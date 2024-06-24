import SwapComponent from "./SwapComponent";
import TransactionsComponent from "./TransactionComponent";
import "./App.css";
import { useGardenSetup } from "./store";
import { Balances } from "./Balances";

function App() {
  useGardenSetup();
  return (
    <div id="container">
      <Balances />
      <SwapComponent></SwapComponent>
      <TransactionsComponent></TransactionsComponent>
    </div>
  );
}

export default App;
