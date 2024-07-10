import SwapComponent from "./SwapComponent";
import TransactionsComponent from "./TransactionComponent";
import Balances from "./Balances";
import { useGardenSetup } from "./store";
import "./App.css";

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
