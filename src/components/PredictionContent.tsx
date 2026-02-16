"use client";

import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const riskUsers = [
  { id: 1, name: "علی محمدی", username: "@user1", risk: "84%", lastActivity: "16 روز پیش", strategy: "ارسال محتوای شخصی‌سازی شده" },
  { id: 2, name: "سارا احمدی", username: "@user2", risk: "71%", lastActivity: "6 روز پیش", strategy: "ارسال پیشنهاد ویژه" },
  { id: 3, name: "محمد رضایی", username: "@user3", risk: "85%", lastActivity: "11 روز پیش", strategy: "نظرسنجی رضایت" },
  { id: 4, name: "فاطمه کریمی", username: "@user4", risk: "84%", lastActivity: "10 روز پیش", strategy: "ارسال محتوای آموزشی" },
  { id: 5, name: "حسین نوری", username: "@user5", risk: "75%", lastActivity: "13 روز پیش", strategy: "تماس مستقیم" },
];

export default function PredictionContent() {
  const radarData = {
    labels: ["فعالیت", "تعامل", "زمان حضور", "پیام‌ها", "اشتراک"],
    datasets: [
      {
        label: "کاربران پرخطر",
        data: [45, 35, 25, 40, 30],
        borderColor: "#ff1744",
        backgroundColor: "rgba(255, 23, 68, 0.2)",
      },
      {
        label: "کاربران فعال",
        data: [85, 90, 80, 88, 92],
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#999", font: { family: "var(--font-vazirmatn)" } } },
    },
    scales: {
      r: {
        ticks: { color: "#999", backdropColor: "transparent" },
        grid: { color: "rgba(255,255,255,0.1)" },
        pointLabels: { color: "#999", font: { family: "var(--font-vazirmatn)" } },
      },
    },
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 grid grid-cols-1 gap-[25px] md:grid-cols-3">
        {[
          { label: "احتمال ترک کانال", value: "24%", icon: "fa-chart-line", color: "danger", sub: "بر اساس تحلیل 30 روز گذشته" },
          { label: "کاربران در معرض خطر", value: "1,234", icon: "fa-exclamation-triangle", color: "warning", sub: "نیاز به توجه فوری" },
          { label: "نرخ بازگشت پیش‌بینی شده", value: "82%", icon: "fa-arrow-trend-up", color: "success", sub: "با اعمال استراتژی‌های پیشنهادی" },
        ].map((item, i) => (
          <div key={i} className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1.25 light-theme:bg-[var(--light-card)]">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-base font-semibold">{item.label}</div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-white ${item.color === 'danger' ? 'bg-[var(--danger)]' : item.color === 'warning' ? 'bg-[var(--warning)]' : 'bg-[var(--success)]'}`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
            </div>
            <div className="font-lalezar text-[42px] font-extrabold mb-2.5 bg-gradient-to-r from-[var(--primary-pink)] via-[var(--primary-purple)] to-[var(--primary-blue)] bg-clip-text text-transparent">
              {item.value}
            </div>
            <p className="text-[#999] text-sm mb-4">{item.sub}</p>
            <div className="h-2.5 w-full rounded-full bg-white/10 light-theme:bg-black/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary-pink)] via-[var(--primary-purple)] to-[var(--primary-blue)] transition-all duration-1000"
                style={{ width: item.value }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10 rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <h3 className="mb-[25px] text-xl font-semibold">تحلیل الگوهای رفتاری</h3>
        <div className="relative h-[300px]">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="mb-[25px] flex items-center justify-between">
          <h3 className="text-xl font-semibold">کاربران پر ریسک</h3>
          <button className="flex items-center gap-2 rounded-xl border-2 border-white/10 bg-white/5 px-5 py-3 text-sm transition-all hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:border-black/10 light-theme:bg-black/2">
            <i className="fas fa-paper-plane"></i> ارسال پیام انگیزشی
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 light-theme:bg-black/2">
              <tr>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">کاربر</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">ریسک ترک</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">آخرین فعالیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">استراتژی پیشنهادی</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {riskUsers.map((user) => (
                <tr key={user.id} className="border-t border-white/5 transition-all hover:bg-white/5 light-theme:border-black/5 light-theme:hover:bg-black/2">
                  <td className="p-[18px_15px]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-blue)] text-sm font-bold text-white">
                        {user.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-[#999]">{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-[18px_15px]">
                    <span className="inline-block rounded-lg px-3 py-1.25 text-xs font-semibold bg-[#ff174433] text-[var(--primary-pink)]">
                      {user.risk}
                    </span>
                  </td>
                  <td className="p-[18px_15px]">{user.lastActivity}</td>
                  <td className="p-[18px_15px]">{user.strategy}</td>
                  <td className="p-[18px_15px]">
                    <div className="flex gap-2">
                      <button className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#4caf5033] text-[var(--success)] transition-all hover:scale-110">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                      <button className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#2196f333] text-[var(--primary-blue)] transition-all hover:scale-110">
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
