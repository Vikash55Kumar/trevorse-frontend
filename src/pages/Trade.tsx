import { useState } from "react";

import Button from "../components/common/Button";

import WatchlistTabs from "../components/trade/WatchlistTabs";
import WatchlistItem from "../components/trade/WatchlistItem";
import ChartCard from "../components/trade/ChartCard";

import type { TabKey } from "../components/trade/WatchlistTabs";
import Card from "../components/common/Card";

// =====================
// MOCK DATA (WITH SYMBOLS)
// =====================

const watchlist = [
  {
    name: "Suzlon Energy",
    symbol: "NSE:SUZLON",
    price: 158.34,
    change: 3.82,
    percentage: 2.47,
  },
  {
    name: "Vodafone Idea",
    symbol: "NSE:IDEA",
    price: 12.5,
    change: -0.5,
    percentage: -2.4,
  },
  {
    name: "Reliance",
    symbol: "NSE:RELIANCE",
    price: 2450,
    change: 15,
    percentage: 0.6,
  },
];

// =====================
// COMPONENT
// =====================

export default function Trade() {
  const [tab, setTab] = useState<TabKey>("explore");

  // 🔥 IMPORTANT STATE
  const [selectedStock, setSelectedStock] = useState(watchlist[0]);

  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="bg-blue-500 text-white px-6">
          Switch To Trade
        </Button>

        <Button className="bg-orange-400 text-white px-6">
          + Add a list
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Watchlist */}
        <Card>
          <WatchlistTabs active={tab} onChange={setTab} />

          <div className="mt-4 space-y-2">
            {watchlist.map((item, idx) => (
              <WatchlistItem
                key={idx}
                {...item}
                isActive={selectedStock.symbol === item.symbol}
                onClick={() => setSelectedStock(item)}
              />
            ))}
          </div>
        </Card>

        {/* Chart */}
        <ChartCard stock={selectedStock} />

      </div>

    </main>
  );
}