// 
import DisciplineTrend from "../components/analytics/DisciplineTrend";
import StabilityRadar from "../components/analytics/StabilityRadar";
import ViolationCard from "../components/analytics/ViolationCard";
import ParticipationCard from "../components/analytics/Participation";

export default function Analytics() {
  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Trader Discipline Report
        </h1>
        <p className="text-gray-500 text-sm">
          Behavioral Analysis & Risk Protocol Adherence
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <DisciplineTrend data={[]} />
          <StabilityRadar />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <ViolationCard />
          <ParticipationCard progress={40} />
        </div>

      </div>

    </main>
  );
}