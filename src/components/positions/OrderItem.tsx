import clsx from "clsx";
import type { Order } from "../../types/trading";

interface Props {
  order: Order;
}

export default function OrderItem({ order }: Props) {
  const isBuy = order.type === "BUY";

  return (
    <div className="flex justify-between py-3 border-b last:border-none">
      
      {/* LEFT */}
      <div>
        <p className="text-xs text-gray-400">{order.time}</p>
        <p className="text-sm font-medium">{order.symbol}</p>
        <p className="text-xs text-gray-400">Delivery</p>
      </div>

      {/* RIGHT */}
      <div className="text-right">
        <p className={clsx("text-xs", isBuy ? "text-green-600" : "text-red-500")}>
          {order.type}
        </p>

        <p className="text-sm flex items-center gap-1 justify-end">
          <span
            className={clsx(
              "w-2 h-2 rounded-full",
              isBuy ? "bg-green-500" : "bg-red-500"
            )}
          />
          {order.qty}
        </p>

        <p className="text-xs text-gray-400">
          Avg ₹ {order.avg.toFixed(2)}
        </p>
      </div>
    </div>
  );
}