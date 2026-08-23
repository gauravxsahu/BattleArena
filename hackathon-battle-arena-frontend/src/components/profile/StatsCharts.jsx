import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Card from "../ui/Card.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import { BarChart3 } from "lucide-react";

const CHART_COLORS = ["#7c5cff", "#00e5a0", "#ffb020", "#ff4d6d"];

/**
 * Renders win/loss ratio and a simple performance snapshot from data the
 * user already has (wins/losses/xp/coins). A dedicated rating-history
 * endpoint isn't part of the current backend contract, so this stays
 * lightweight rather than inventing time-series data.
 */
export default function StatsCharts({ user }) {
  const wins = user?.wins || 0;
  const losses = user?.losses || 0;
  const hasGames = wins + losses > 0;

  const winLossData = [
    { name: "Wins", value: wins },
    { name: "Losses", value: losses },
  ];

  const performanceData = [
    { name: "Rating", value: user?.rating || 0 },
    { name: "XP", value: user?.xp || 0 },
    { name: "Coins", value: user?.coins || 0 },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-arena-text">Win / Loss Ratio</h3>
        {hasGames ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={winLossData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {winLossData.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index]} stroke="none" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#181b23", border: "1px solid #242832", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState icon={BarChart3} title="No games yet" description="Play your first match to see stats here." />
        )}
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-arena-text">Performance Snapshot</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242832" vertical={false} />
            <XAxis dataKey="name" stroke="#8b90a0" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#8b90a0" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(124,92,255,0.08)" }}
              contentStyle={{ background: "#181b23", border: "1px solid #242832", borderRadius: 12 }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#7c5cff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
