import Card from "../common/Card";

type LeaderboardItem = {
  id: string | number;
  rank: string;      // "1st", "2nd"
  name: string;
  value: number;     // percentage
};

interface LeaderboardProps {
  data: LeaderboardItem[];
  title?: string;
  className?: string;
}

export default function Leaderboard({
  data,
  title = "Leaderboard",
  className,
}: LeaderboardProps) {
  return (
    <Card className={className}>
      {/* Header */}
      <h2 className="font-semibold mb-4">{title}</h2>

      {/* List */}
      {data.map((item, index) => (
        <div
          key={item.id}
          className={`flex justify-between py-2 ${
            index !== data.length - 1 ? "border-b" : ""
          }`}
        >
          <span>{item.rank}</span>
          <span>{item.name}</span>
          <span>{item.value}%</span>
        </div>
      ))}
    </Card>
  );
}
