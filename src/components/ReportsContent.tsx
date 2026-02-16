"use client";

import React from "react";
import { Line, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ReportsContent() {
  const lineData = {
    labels: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],
    datasets: [
      {
        label: "عملکرد",
        data: [65, 72, 68, 85, 90, 88],
        borderColor: "#9c27b0",
        backgroundColor: "rgba(156, 39, 176, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const polarData = {
    labels: ["لایک", "کامنت", "اشتراک", "بازدید"],
    datasets: [
      {
        data: [85, 70, 65, 95],
        backgroundColor: [
          "rgba(255, 23, 68, 0.7)",
          "rgba(156, 39, 176, 0.7)",
          "rgba(33, 150, 243, 0.7)",
          "rgba(76, 175, 80, 0.7)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#999", font: { family: "var(--font-vazirmatn)" } } },
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
      <div className="mb-10 grid grid-cols-1 gap-[25px] sm:grid-cols-3">
        {[
          { label: "کل بازدیدها", value: "125K", icon: "fa-eye", color: "blue", change: "22.1%" },
          { label: "نرخ کلیک", value: "89.5%", icon: "fa-mouse-pointer", color: "purple", change: "8.3%" },
          { label: "اشتراک‌گذاری‌ها", value: "12,840", icon: "fa-share-alt", color: "pink", change: "15.7%" },
        ].map((item, i) => (
          <div key={i} className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
            <div className={`mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[15px] text-[28px] text-white ${
              item.color === 'blue' ? 'bg-gradient-to-br from-[var(--primary-blue)] to-[#42a5f5]' :
              item.color === 'purple' ? 'bg-gradient-to-br from-[var(--primary-purple)] to-[#ba68c8]' :
              'bg-gradient-to-br from-[var(--primary-pink)] to-[#ff5252]'
            }`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div className="font-lalezar text-[36px] font-extrabold mb-2">{item.value}</div>
            <div className="text-[#999] text-sm mb-[15px]">{item.label}</div>
            <div className="inline-flex items-center rounded-[10px] bg-[#4caf5033] px-3 py-1.25 text-xs font-semibold text-[var(--success)]">
              <i className="fas fa-arrow-up ml-1.25"></i>
              <span>{item.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10 grid grid-cols-1 gap-[25px] lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <h3 className="mb-[25px] text-xl font-semibold">گزارش عملکرد ماهانه</h3>
          <div className="relative h-[259px]">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <h3 className="mb-[25px] text-xl font-semibold">نرخ تعامل</h3>
          <div className="relative h-[229px]">
            <PolarArea data={polarData} options={{ ...chartOptions, scales: { r: { ticks: { color: "#999", backdropColor: "transparent" }, grid: { color: "rgba(255,255,255,0.1)" } } } }} />
          </div>
        </div>
      </div>

      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <h3 className="mb-5 text-xl font-semibold">صادرات گزارش‌ها</h3>
        <div className="flex flex-wrap gap-[15px]">
          {[
            { label: "خروجی PDF", icon: "fa-file-pdf" },
            { label: "خروجی Excel", icon: "fa-file-excel" },
            { label: "خروجی CSV", icon: "fa-file-csv" },
            { label: "ارسال ایمیل", icon: "fa-envelope" },
          ].map((btn, i) => (
            <button key={i} className="flex flex-1 min-w-[150px] items-center justify-center gap-2.5 rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-sm font-semibold transition-all hover:translate-y-[-3px] hover:border-transparent hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:shadow-[0_10px_30px_rgba(156,39,176,0.4)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)] light-theme:hover:text-white">
              <i className={`fas ${btn.icon} text-lg`}></i> {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
