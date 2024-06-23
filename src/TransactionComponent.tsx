import {
  Actions,
  Order as OrderbookOrder,
  parseStatus,
} from "@gardenfi/orderbook";
import { useEffect, useState } from "react";
import { useGarden, useMetaMaskStore } from "./store.tsx";
import { formatUnits } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";

function TransactionsComponent() {
  const garden = useGarden();
  const { evmProvider } = useMetaMaskStore();
  const [orders, setOrders] = useState(new Map<number, OrderbookOrder>());

  useEffect(() => {
    const fetchOrders = async () => {
      if (!garden || !evmProvider) return;

      const signer = await evmProvider.getSigner();
      const evmAddress = await signer.getAddress();

      if (!evmAddress) return;

      garden.subscribeOrders(evmAddress, (updatedOrders) => {
        setOrders((prevOrders) => {
          const updatedOrdersMap = new Map(prevOrders);
          updatedOrders.forEach((order) =>
            updatedOrdersMap.set(order.ID, order)
          );
          return updatedOrdersMap;
        });
      });
    };

    fetchOrders();
  }, [garden, evmProvider]);

  const recentOrders = Array.from(orders.values())
    .sort((a, b) => b.ID - a.ID)
    .slice(0, 3);

  if (!recentOrders.length) return null;

  return (
    <div className="transaction-component">
      {recentOrders.map((order) => (
        <OrderComponent order={order} key={order.ID} />
      ))}
    </div>
  );
}

type Order = {
  order: OrderbookOrder;
};

const OrderComponent: React.FC<Order> = ({ order }) => {
  const {
    ID: orderId,
    initiatorAtomicSwap,
    followerAtomicSwap,
    CreatedAt,
    status: orderStatus,
  } = order;
  const parsedStatus = parseStatus(order);
  const wbtcAmount = formatUnits(initiatorAtomicSwap.amount, 8);
  const btcAmount = formatUnits(followerAtomicSwap.amount, 8);
  const [modelIsVisible, setModelIsVisible] = useState(false);

  const isButton = [
    Actions.UserCanInitiate,
    Actions.UserCanRedeem,
    Actions.UserCanRefund,
  ].includes(parsedStatus);
  const userFriendlyStatus = getUserFriendlyStatus(parsedStatus);

  const garden = useGarden();
  const handleClick = async () => {
    if (!garden) return;
    const swapper = garden.getSwap(order);
    const performedAction = await swapper.next();
    console.log(
      `Completed Action ${performedAction.action} with transaction hash: ${performedAction.output}`
    );
  };

  const toggleModelVisible = () => setModelIsVisible((pre) => !pre);

  const orderCreatedAt = new Date(CreatedAt).getTime();
  const timePassedSinceCreation = new Date().getTime() - orderCreatedAt;
  const isOrderExpired =
    (orderStatus === 1 || orderStatus === 6) &&
    Math.floor(timePassedSinceCreation / 1000) / 60 > 3;

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
          {isButton ? (
            <button className="button-white" onClick={handleClick}></button>
          ) : (
            <span>
              {isOrderExpired
                ? "Order expired"
                : orderStatus === 3
                ? "Completed"
                : userFriendlyStatus}
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

function getUserFriendlyStatus(status: string) {
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
}

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
