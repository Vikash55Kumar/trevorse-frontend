// 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PositionCard from "../components/positions/PositionCard";
import OrdersCard from "../components/positions/OrdersCard";

import type { Position, Order, OrderTab } from "../types/trading";

// ============================
// MOCK DATA
// ============================

const positions: Position[] = [
  {
    id: 1,
    symbol: "USDINR23JUNFUT",
    exchange: "CDS",
    qty: -1,
    avg: 82,
    ltp: 82,
    pnl: -490,
    product: "NRML",
  },
  {
    id: 2,
    symbol: "USDINR23JUNFUT",
    exchange: "CDS",
    qty: -1,
    avg: 82,
    ltp: 82,
    pnl: -490,
    product: "NRML",
  },
];

const orders: Order[] = [
  {
    id: 1,
    date: "04 October, 2023",
    time: "11:16 AM",
    symbol: "IEL",
    type: "BUY",
    qty: 9,
    avg: 17.4,
  },
  {
    id: 2,
    date: "03 October, 2023",
    time: "11:16 AM",
    symbol: "IEL",
    type: "BUY",
    qty: 9,
    avg: 17.4,
  },
];

// ============================
// COMPONENT
// ============================

export default function Positions() {
  const [tab, setTab] = useState<OrderTab>("stocks");
  const navigate = useNavigate();

  // 🔹 Calculate summary
  const totalPnL = positions.reduce((acc, p) => acc + p.pnl, 0);
  const totalPositions = positions.length;

  return (
    <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">

      {/* ============================ */}
      {/* HEADER */}
      {/* ============================ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h1 className="text-2xl font-semibold">Positions & Orders</h1>
          <p className="text-sm text-slate-500">
            Track your open positions and order history
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/trade")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
          >
            Go to Trade
          </button>

          <button className="bg-slate-200 hover:bg-slate-300 px-5 py-2 rounded-lg transition">
            Refresh
          </button>
        </div>

      </div>

      {/* ============================ */}
      {/* SUMMARY CARDS */}
      {/* ============================ */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Total Positions</p>
          <p className="text-xl font-semibold">{totalPositions}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Total P&L</p>
          <p
            className={`text-xl font-semibold ${
              totalPnL >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ₹ {totalPnL}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border">
          <p className="text-sm text-slate-500">Active Orders</p>
          <p className="text-xl font-semibold">{orders.length}</p>
        </div>

      </section>

      {/* ============================ */}
      {/* MAIN CONTENT */}
      {/* ============================ */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* POSITIONS */}
        <PositionCard pnl={totalPnL} positions={positions} />

        {/* ORDERS */}
        <OrdersCard
          tab={tab}
          onTabChange={setTab}
          orders={orders}
        />

      </section>

    </main>
  );
}