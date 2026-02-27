import Card from "../common/Card";
import clsx from "clsx";
import OrderItem from "./OrderItem";
import type { Order, OrderTab } from "../../types/trading";

interface Props {
  orders: Order[];
  tab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
}

export default function OrdersCard({ orders, tab, onTabChange }: Props) {
  const grouped = orders.reduce<Record<string, Order[]>>((acc, order) => {
    if (!acc[order.date]) acc[order.date] = [];
    acc[order.date].push(order);
    return acc;
  }, {});

  return (
    <Card className="p-0 overflow-hidden">
      
      {/* HEADER */}
      <div className="px-5 pt-4">
        <h2 className="text-lg font-semibold mb-3">Orders</h2>

        <div className="flex gap-6 border-b text-sm">
          <button
            onClick={() => onTabChange("stocks")}
            className={clsx(
              "pb-2",
              tab === "stocks"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            )}
          >
            Stocks
          </button>

          <button
            onClick={() => onTabChange("mutual")}
            className={clsx(
              "pb-2",
              tab === "mutual"
                ? "border-b-2 border-blue-500 font-medium"
                : "text-gray-500"
            )}
          >
            Mutual Funds
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="px-5 py-4 space-y-4">
        {Object.entries(grouped).map(([date, list]) => (
          <div key={date}>
            <p className="text-sm font-medium text-gray-600 mb-2">{date}</p>

            {list.map((order) => (
              <OrderItem key={order.id} order={order} />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}