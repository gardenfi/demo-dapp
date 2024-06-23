import {
  Actions,
  Order as OrderbookOrder,
  parseStatus,
} from "@gardenfi/orderbook";
import { useEffect, useState } from "react";
import { useGardenStore, useMetaMaskStore } from "./store.tsx";
import { formatUnits } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

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

  if (!orders.size) return;

  return (
    <div className="transaction-component">
      {Array.from(orders.values())
        .reverse()
        .slice(0, 3)
        .map((order) => (
          <OrderComponent order={order} key={order.ID} />
        ))}
    </div>
  );
}

type Order = {
  order: OrderbookOrder;
};

const OrderComponent: React.FC<Order> = ({ order }) => {
  const orderId = order.ID;
  const wbtcAmount = formatUnits(order.initiatorAtomicSwap.amount, 8);
  const btcAmount = formatUnits(order.followerAtomicSwap.amount, 8);
  const status = parseStatus(order);
  const [modelIsVisible, setModelIsVisible] = useState(false);

  const buttonOrSpan = (status: string): "button" | "span" => {
    switch (status) {
      case Actions.UserCanInitiate:
      case Actions.UserCanRedeem:
      case Actions.UserCanRefund:
        return "button";
      default:
        return "span";
    }
  };

  const getUserFriendlyStatus = (status: string) => {
    switch (status) {
      case Actions.NoAction:
        return "Working";
      case Actions.UserCanInitiate:
        return "Initiate";
      case Actions.UserCanRedeem:
        return "Redeem";
      case Actions.UserCanRefund:
        return "Refund";
      case Actions.CounterpartyCanInitiate:
        return "Awaiting counterparty deposite";
      default:
        return status.slice(0, 1).toUpperCase() + status.slice(1);
    }
  };

  const garden = useGardenStore();
  const handleClick = async () => {
    if (!garden) return;
    const swapper = garden.getSwap(order);
    // if it is UserCanInitiate, this step will lock the funds in the contract.
    // if it is UserCanRedeem, this step will unlocks the funds from the contract.
    const performedAction = await swapper.next();
    console.log(
      `Completed Action ${performedAction.action} with transaction hash: ${performedAction.output}`
    );
  };

  const toggleModelVisible = () => {
    setModelIsVisible((preIsVisible) => !preIsVisible);
  };

  const orderCreatedAt = new Date(order.CreatedAt).getTime();
  const timePassedSinceCreation = new Date().getTime() - orderCreatedAt;

  return (
    <div className="order">
      <div className="order-id">
        <div>
          Order Id <span>{orderId}</span>
        </div>
        <span className="enlarge">
          <FontAwesomeIcon
            icon={faUpRightAndDownLeftFromCenter}
            style={{ color: "#27272a" }}
            onClick={toggleModelVisible}
          />
        </span>
      </div>
      <div className="amount-and-status">
        <div className="amount-label">WBTC</div>
        <div className="amount-label">BTC</div>
        <div className="status-label">Status</div>
        <div className="amount">{wbtcAmount}</div>
        <div className="amount">{btcAmount}</div>
        <div className="status">
          {buttonOrSpan(status) === "button" ? (
            <button className="button-white" onClick={handleClick}></button>
          ) : (
            <span>
              {(order.status === 1 || order.status === 6) &&
              Math.floor(timePassedSinceCreation / 1000) / 60 > 3
                ? "Order expired"
                : order.status === 3
                ? "Completed"
                : getUserFriendlyStatus(status)}
            </span>
          )}
        </div>
      </div>
      {modelIsVisible && (
        <OrderPopUp order={order} toggleModelVisible={toggleModelVisible} />
      )}
    </div>
  );
};

type PopUp = {
  order: OrderbookOrder;
  toggleModelVisible: () => void;
};

const OrderPopUp: React.FC<PopUp> = ({ order, toggleModelVisible }) => {
  const {
    ID,
    maker: from,
    followerAtomicSwap: { redeemerAddress: to },
    CreatedAt,
  } = order;

  return (
    <div className="pop-up-container" onClick={toggleModelVisible}>
      <div className="pop-up" onClick={(e) => e.stopPropagation()}>
        <span>ID: {ID}</span>
        <span>Created At: {CreatedAt}</span>
        <span>From: {from}</span>
        <span>To: {to}</span>
      </div>
    </div>
  );
};

export default TransactionsComponent;
