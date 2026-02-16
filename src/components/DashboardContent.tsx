"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardContent() {
  const lineData = {
    labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
    datasets: [
      {
        label: "کاربران فعال",
        data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
        borderColor: "#ff1744",
        backgroundColor: "rgba(255, 23, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "پیام‌های ارسالی",
        data: [800, 1200, 1000, 1600, 1400, 1900, 1700],
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ["فعال", "غیرفعال", "پرخطر"],
    datasets: [
      {
        data: [8542, 4305, 1234],
        backgroundColor: ["#4caf50", "#9e9e9e", "#ff1744"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
    datasets: [
      {
        label: "پیام‌های دریافتی",
        data: [3200, 4100, 3800, 5200, 4600, 5900, 5400],
        backgroundColor: "rgba(156, 39, 176, 0.8)",
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#999", font: { family: "var(--font-vazirmatn)" } },
      },
    },
    scales: {
      y: {
        ticks: { color: "#999", font: { family: "var(--font-vazirmatn)" } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      x: {
        ticks: { color: "#999", font: { family: "var(--font-vazirmatn)" } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  return (
    <div className="animate-fadeIn">
      {/* Stats Cards */}
      <div className="mb-10 grid grid-cols-1 gap-[25px] sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "کل کاربران", value: "12,847", change: "12.5%", icon: "fa-users", color: "pink" },
          { label: "کل پیام‌ها", value: "45,290", change: "8.2%", icon: "fa-comments", color: "purple" },
          { label: "کاربران فعال", value: "8,542", change: "15.3%", icon: "fa-user-check", color: "blue" },
          { label: "نرخ تعامل", value: "94.2%", change: "5.1%", icon: "fa-chart-line", color: "green" },
        ].map((stat, i) => (
          <div key={i} className="stat-card-gradient relative overflow-hidden rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_50px_rgba(156,39,176,0.3)] light-theme:bg-[var(--light-card)] light-theme:shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
            <div className={`mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[15px] text-[28px] text-white ${
              stat.color === 'pink' ? 'bg-gradient-to-br from-[var(--primary-pink)] to-[#ff5252]' :
              stat.color === 'purple' ? 'bg-gradient-to-br from-[var(--primary-purple)] to-[#ba68c8]' :
              stat.color === 'blue' ? 'bg-gradient-to-br from-[var(--primary-blue)] to-[#42a5f5]' :
              'bg-gradient-to-br from-[var(--success)] to-[#66bb6a]'
            }`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="font-lalezar text-4xl font-extrabold mb-2">{stat.value}</div>
            <div className="text-[#999] text-sm mb-4">{stat.label}</div>
            <div className="inline-flex items-center rounded-[10px] bg-[#4caf5033] px-3 py-1.25 text-xs font-semibold text-[var(--success)]">
              <i className="fas fa-arrow-up ml-1.25"></i>
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-10 grid grid-cols-1 gap-[25px] lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <div className="mb-[25px] flex items-center justify-between">
            <h3 className="text-xl font-semibold">آمار فعالیت کاربران</h3>
            <div className="flex gap-2.5">
              <button className="rounded-10 bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-purple)] px-4 py-2 text-xs text-white">روزانه</button>
              <button className="rounded-10 border-2 border-white/10 px-4 py-2 text-xs text-white/70 light-theme:border-black/10 light-theme:text-black/60">هفتگی</button>
              <button className="rounded-10 border-2 border-white/10 px-4 py-2 text-xs text-white/70 light-theme:border-black/10 light-theme:text-black/60">ماهانه</button>
            </div>
          </div>
          <div className="relative h-[300px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <div className="mb-[25px]">
            <h3 className="text-xl font-semibold">توزیع کاربران</h3>
          </div>
          <div className="relative h-[300px]">
            <Doughnut data={doughnutData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'bottom', labels: { color: '#999', padding: 20 } } } }} />
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="mb-[25px] flex items-center justify-between">
          <h3 className="text-xl font-semibold">تحلیل پیام‌های ارسالی</h3>
        </div>
        <div className="relative h-[300px]">
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
