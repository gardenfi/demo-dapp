import SwapComponent from "./SwapComponent";
import TransactionsComponent from "./TransactionComponent";
import "./App.css";
import { useGardenSetup } from "./store";

function App() {
  useGardenSetup();
  return (
    <div id="container">
      <SwapComponent></SwapComponent>
      <TransactionsComponent></TransactionsComponent>
    </div>
  );
}

export default App;
