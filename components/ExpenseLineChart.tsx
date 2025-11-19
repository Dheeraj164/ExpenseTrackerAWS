import { useApp } from "@/utils/AppContextProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function ExpenseLineChart() {
  const { expenses } = useApp();

  // ✅ Transform expenses → group by date
  const chartData =
    expenses?.reduce<Record<string, number>>((acc, exp) => {
      const date = exp.date; // assuming it's already like "2025-09-15"
      const amount = Number(exp.amount);
      acc[date] = (acc[date] || 0) + amount;
      return acc;
    }, {}) || {};

  // ✅ Convert grouped object into array for Recharts
  const dataArray = Object.entries(chartData).map(([date, total]) => ({
    date,
    amount: total,
  }));

  // ✅ Sort by date (optional, but nice for clean chart)
  dataArray.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <LineChart
      className="focus:outline-none focus:ring-0 "
      width={500}
      height={300}
      data={dataArray}>
      <CartesianGrid
        className="focus:outline-none focus:ring-0 "
        strokeDasharray="3 3"
      />
      <XAxis className="focus:outline-none focus:ring-0 " dataKey="date" />
      <YAxis className="focus:outline-none focus:ring-0 " />
      <Tooltip />
      <Legend className="focus:outline-none focus:ring-0 " />
      <Line
        className="focus:outline-none focus:ring-0 "
        type="monotone"
        dataKey="amount"
        stroke="#0088FE"
      />
    </LineChart>
  );
}
