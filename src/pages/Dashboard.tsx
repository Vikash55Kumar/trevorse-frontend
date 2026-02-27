import PortfolioCard from "../components/dashboard/PortfolioCard";
import Leaderboard from "../components/dashboard/Leaderboard";
import IndexCard from "../components/dashboard/IndexCard";
import StockTable from "../components/dashboard/StockTable";
import type { Stock } from "../components/dashboard/StockTable";

// ===============================
// 🔹 MOCK DATA (replace with API later)
// ===============================

const leaderboardData = [
  { id: 1, rank: "1st", name: "Harsh", value: 46 },
  { id: 2, rank: "2nd", name: "Aman", value: 40 },
  { id: 3, rank: "3rd", name: "Riya", value: 35 },
];

const indices = [
  { name: "NIFTY 50", price: 158.34, change: 3.82, percentage: 2.4 },
  { name: "BANK NIFTY", price: 42000, change: -120, percentage: -0.5 },
  { name: "SENSEX", price: 72000, change: 150, percentage: 0.3 },
  { name: "MIDCAP", price: 31000, change: -50, percentage: -0.2 },
];

const gainers: Stock[] = [
  { id: 1, symbol: "TSLA", name: "Tesla", price: 245, change: 5.2, percentage: 2.4 },
  { id: 2, symbol: "AAPL", name: "Apple", price: 180, change: 3.1, percentage: 1.8 },
];

const losers: Stock[] = [
  { id: 3, symbol: "META", name: "Meta", price: 310, change: -4.5, percentage: -1.3 },
  { id: 4, symbol: "NFLX", name: "Netflix", price: 420, change: -2.1, percentage: -0.8 },
];

// ===============================
// 🔹 COMPONENT
// ===============================

export default function Dashboard() {
  return (
    <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Portfolio + Leaderboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioCard
          invested={2000000}
          current={2010450}
        />

        <Leaderboard data={leaderboardData} />
      </section>

      {/* Indices */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {indices.map((item) => (
          <IndexCard key={item.name} {...item} />
        ))}
      </section>

      {/* Stock Tables */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockTable
          title="Top Gainers"
          data={gainers}
          onViewAll={() => console.log("View All Gainers")}
        />

        <StockTable
          title="Top Losers"
          data={losers}
          onViewAll={() => console.log("View All Losers")}
        />
      </section>

    </main>
  );
}