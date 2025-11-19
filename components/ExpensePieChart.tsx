import { useApp } from "@/utils/AppContextProvider";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A020F0",
  "#FF1493",
];

export default function ExpensePieChart() {
  const { expenses } = useApp();

  // Group by type
  const groupedData = expenses?.reduce((acc, exp) => {
    const type = exp.type?.trim() || "Other"; // normalize
    const amount = Number(exp.amount) || 0;

    if (!acc[type]) acc[type] = 0;
    acc[type] += amount;

    return acc;
  }, {} as Record<string, number>);

  // Convert into array for Recharts
  const chartData = groupedData
    ? Object.entries(groupedData).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={chartData}
        cx={200}
        cy={150}
        labelLine={false}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label>
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <div className="p-2 pt-5">
        <Tooltip />
        <Legend />
      </div>
    </PieChart>
  );
}
