function TransactionsComponent() {
  return (
    <div className="transaction-component">
      <OrderComponent
        orderId={3456}
        wbtcAmount={0.001}
        btcAmount={0.000991}
        status="initiate"
      />
      <OrderComponent
        orderId={3456}
        wbtcAmount={0.001}
        btcAmount={0.000991}
        status="initiate"
      />
      <OrderComponent
        orderId={3456}
        wbtcAmount={0.001}
        btcAmount={0.000991}
        status="initiate"
      />
    </div>
  );
}

type Order = {
  orderId: number;
  wbtcAmount: number;
  btcAmount: number;
  status: string;
};

const OrderComponent: React.FC<Order> = ({
  orderId,
  wbtcAmount,
  btcAmount,
  status,
}) => {
  return (
    <div className="order">
      <div className="order-id">
        Order Id <span>{orderId}</span>
      </div>
      <div className="amount-and-status">
        <div>
          <div className="amount">{wbtcAmount}</div>
          <div className="amount-label">WBTC</div>
        </div>
        <div>
          <div className="amount">{btcAmount}</div>
          <div className="amount-label">BTC</div>
        </div>
        <div>{status}</div>
      </div>
    </div>
  );
};

export default TransactionsComponent;
