import {
  Actions,
  Order as OrderbookOrder,
  parseStatus,
} from "@gardenfi/orderbook";
import { useEffect, useState } from "react";
import { useGardenStore, useMetaMaskStore } from "./store.tsx";
import { formatUnits } from "ethers";

function TransactionsComponent() {
  const garden = useGardenStore();
  const [orders, setOrders] = useState(new Map<number, OrderbookOrder>());
  const { evmProvider } = useMetaMaskStore();

  useEffect(() => {
    if (!garden) return;
    (async () => {
      const evmAddress = await (await evmProvider?.getSigner())?.getAddress();
      if (!evmAddress) return;
      garden.subscribeOrders(evmAddress, async (updatedOrders) => {
        setOrders((orders) => {
          const ordersMap = new Map<number, OrderbookOrder>();
          for (const o of orders.values()) {
            ordersMap.set(o.ID, o);
          }
          for (const o of updatedOrders) {
            ordersMap.set(o.ID, o);
          }
          return ordersMap;
        });
      });
    })();
  }, [garden]);

  if(!orders.size) return;

  return (
    <div className="transaction-component">
      {Array.from(orders.values())
        .reverse()
        .slice(0, 3)
        .map((order) => (
          <OrderComponent
            orderId={order.ID}
            wbtcAmount={formatUnits(order.initiatorAtomicSwap.amount, 8)}
            btcAmount={formatUnits(order.followerAtomicSwap.amount, 8)}
            status={parseStatus(order)}
          />
        ))}
    </div>
  );
}

type Order = {
  orderId: number;
  wbtcAmount: string;
  btcAmount: string;
  status: Actions;
};

const OrderComponent: React.FC<Order> = ({
  orderId,
  wbtcAmount,
  btcAmount,
  status,
}) => {
  const buttonOrSpan = (status: string): "button" | "span" => {
    switch (status) {
      case "somthing":
        return "button";
      default:
        return "span";
    }
  };

  const getUserFriendlyStatus = (status: string) => {
    switch (status) {
      case "no action can be performed":
        return "Matching Order";
      default:
        return status;
    }
  };

  return (
    <div className="order">
      <div className="order-id">
        Order Id <span>{orderId}</span>
      </div>
      <div className="amount-and-status">
        <div className="amount-label">WBTC</div>
        <div className="amount-label">BTC</div>
        <div className="status-label">Status</div>
        <div className="amount">{wbtcAmount}</div>
        <div className="amount">{btcAmount}</div>
        <div className="status">
          {buttonOrSpan(status) === "span" ? (
            <button className="button-white">
              {getUserFriendlyStatus(status)}
            </button>
          ) : (
            <span>{getUserFriendlyStatus(status)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsComponent;
