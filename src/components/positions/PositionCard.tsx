import Card from "../common/Card";
import clsx from "clsx";
import type { Position } from "../../types/trading";

interface Props {
  pnl: number;
  positions: Position[];
}

export default function PositionCard({ pnl, positions }: Props) {
  return (
    <Card className="p-0 overflow-hidden">
      
      {/* HEADER */}
      <div className="text-center py-6 border-b">
        <p className="text-sm text-gray-500">Net P & L</p>
        <p
          className={clsx(
            "text-xl font-semibold mt-1",
            pnl >= 0 ? "text-green-600" : "text-red-500"
          )}
        >
          {pnl >= 0 ? "+" : ""}₹ {pnl.toFixed(2)}
        </p>
      </div>

      {/* LIST */}
      <div>
        {positions.map((pos, i) => (
          <div
            key={pos.id}
            className={clsx(
              "px-5 py-4",
              i !== positions.length - 1 && "border-b"
            )}
          >
            {/* TOP */}
            <div className="flex justify-between text-sm text-gray-500">
              <p>
                Qty:{" "}
                <span className={pos.qty < 0 ? "text-red-500" : "text-green-600"}>
                  {pos.qty}
                </span>{" "}
                Avg. {pos.avg}
              </p>

              <span className="bg-orange-100 text-orange-500 text-xs px-2 py-0.5 rounded">
                {pos.product}
              </span>
            </div>

            {/* MIDDLE */}
            <div className="flex justify-between mt-2">
              <div>
                <p className="font-medium text-sm">{pos.symbol}</p>
                <p className="text-xs text-gray-400">{pos.exchange}</p>
              </div>

              <p className={pos.pnl >= 0 ? "text-green-600" : "text-red-500"}>
                {pos.pnl >= 0 ? "+" : ""}
                {pos.pnl.toFixed(4)}
              </p>
            </div>

            {/* BOTTOM */}
            <div className="flex justify-end text-xs text-gray-400 mt-1">
              LTP {pos.ltp}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}