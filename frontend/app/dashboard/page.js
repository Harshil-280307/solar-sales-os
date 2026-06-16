"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import {
  Doughnut,
  Line,
} from "react-chartjs-2";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    lost: 0,
    followups: 0,
    avgBill: 0,
    revenuePotential: 0,
    revenueGenerated: 0,
  });

  const [recentLeads, setRecentLeads] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [trendData, setTrendData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`)
      .then((res) => res.json())
      .then((data) => {
        setRecentLeads(
          [...data].reverse().slice(0, 5)
        );

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const monthlyCounts = new Array(12).fill(0);

        data.forEach((lead) => {
          if (lead.created_at) {
            const month = new Date(
              lead.created_at
            ).getMonth();

            monthlyCounts[month]++;
          }
        });

        setTrendData({
          labels: months,
          datasets: [
            {
              label: "Leads",
              data: monthlyCounts,
              borderColor: "#3b82f6",
              backgroundColor: "#3b82f6",
              tension: 0.4,
            },
          ],
        }); 
        
        const total = data.length;

        const hot = data.filter(
          (l) => l.status === "hot"
        ).length;

        const warm = data.filter(
          (l) => l.status === "warm"
        ).length;

        const cold = data.filter(
          (l) => l.status === "cold"
        ).length;

        const closed = data.filter(
          (l) => l.status === "closed"
        ).length;

        const lost = data.filter(
          (l) => l.status === "lost"
        ).length;

        setChartData({
          labels: [
            "Hot",
            "Warm",
            "Cold",
            "Closed",
          ],
          datasets: [
            {
              data: [
                hot,
                warm,
                cold,
                closed,
              ],
              backgroundColor: [
                "#ef4444",
                "#facc15",
                "#3b82f6",
                "#22c55e",
              ],
              borderWidth: 0,
            },
          ],
        });

        const followups = data.filter(
          (l) => l.follow_up_count < 3
        ).length;

        const totalBill = data.reduce(
          (sum, l) => sum + (l.bill || 0),
          0
        );

        const avgBill =
          total > 0 ? totalBill / total : 0;

        const revenueGenerated = data
          .filter(
            (l) => l.status === "closed"
          )
          .reduce(
            (sum, l) =>
              sum +
              ((l.system_size || 0) * 50000),
            0
          );

        const revenuePotential = data
          .filter(
            (l) =>
              l.status !== "closed" &&
              l.status !== "lost"
          )
          .reduce(
            (sum, l) =>
              sum +
              ((l.system_size || 0) * 50000),
            0
          );

        setStats({
          total,
          hot,
          lost,
          followups,
          avgBill,
          revenuePotential,
          revenueGenerated,
        });
      })
      .catch((err) =>
        console.error(err)
      );
  }, []);

  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      color: "from-blue-600 to-blue-800",
      icon: "📋",
    },
    {
      title: "Hot Leads",
      value: stats.hot,
      color: "from-red-600 to-red-800",
      icon: "🔥",
    },
    {
      title: "Lost Leads",
      value: stats.lost,
      color: "from-gray-600 to-gray-800",
      icon: "❌",
    },
    {
      title: "Follow Ups",
      value: stats.followups,
      color: "from-yellow-500 to-orange-600",
      icon: "📞",
    },
    {
      title: "Average Bill",
      value: `₹${stats.avgBill.toFixed(0)}`,
      color: "from-purple-600 to-purple-800",
      icon: "💵",
    },
    {
      title: "Revenue Generated",
      value: `₹${stats.revenueGenerated.toLocaleString()}`,
      color: "from-green-600 to-green-800",
      icon: "💰",
    },
    {
      title: "Revenue Potential",
      value: `₹${stats.revenuePotential.toLocaleString()}`,
      color: "from-cyan-600 to-cyan-800",
      icon: "⚡",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl text-white font-bold mb-8">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 shadow-lg`}
          >
            <p className="text-white/80">
              {card.icon} {card.title}
            </p>

            <h2 className="text-4xl font-bold text-white mt-3">
              {card.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">
          Quick Actions
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center transition"
          >
            <div className="text-3xl mb-2">➕</div>
            <p className="font-semibold">
              New Proposal
            </p>
          </Link>

          <Link
            href="/leads"
            className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center transition"
          >
            <div className="text-3xl mb-2">👥</div>
            <p className="font-semibold">
              Manage Leads
            </p>
          </Link>

          <Link
            href="/followups"
            className="bg-yellow-500 hover:bg-yellow-600 text-black p-6 rounded-xl text-center transition"
          >
            <div className="text-3xl mb-2">📞</div>
            <p className="font-semibold">
              Follow Ups
            </p>
          </Link>

          <button
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl text-center transition"
          >
            <div className="text-3xl mb-2">📄</div>
            <p className="font-semibold">
              Generate PDF
            </p>
          </button>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">
          Recent Leads
        </h2>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >
                <div>
                  <h3 className="text-white font-semibold">
                    {lead.name}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {lead.phone}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lead.status === "hot"
                      ? "bg-red-500/20 text-red-400"
                      : lead.status === "warm"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : lead.status === "closed"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-400">
              No leads available
            </p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">
          Lead Status Analytics
        </h2>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          {chartData && (
            <div className="max-w-md mx-auto">
              <Doughnut data={chartData} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">

        <h2 className="text-2xl font-bold text-white mb-4">
          Monthly Lead Trend
        </h2>

        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

          {trendData && (
            <Line data={trendData} />
          )}

        </div>

      </div>



    </div>
  );
}