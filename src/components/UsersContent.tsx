"use client";

import React, { useState } from "react";

const initialUsers = [
  { id: 1, name: "علی محمدی", username: "@user1", status: "inactive", messages: 234, lastActivity: "25 روز پیش", risk: "low" },
  { id: 2, name: "سارا احمدی", username: "@user2", status: "active", messages: 508, lastActivity: "20 روز پیش", risk: "low" },
  { id: 3, name: "سارا احمدی", username: "@user3", status: "inactive", messages: 489, lastActivity: "11 روز پیش", risk: "high" },
  { id: 4, name: "فاطمه کریمی", username: "@user4", status: "active", messages: 63, lastActivity: "7 روز پیش", risk: "low" },
  { id: 5, name: "علی محمدی", username: "@user5", status: "inactive", messages: 323, lastActivity: "28 روز پیش", risk: "high" },
  { id: 6, name: "علی محمدی", username: "@user6", status: "active", messages: 497, lastActivity: "4 روز پیش", risk: "low" },
  { id: 7, name: "حسین نوری", username: "@user7", status: "inactive", messages: 412, lastActivity: "18 روز پیش", risk: "medium" },
  { id: 8, name: "فاطمه کریمی", username: "@user8", status: "inactive", messages: 346, lastActivity: "8 روز پیش", risk: "medium" },
  { id: 9, name: "محمد رضایی", username: "@user9", status: "active", messages: 95, lastActivity: "2 روز پیش", risk: "high" },
  { id: 10, name: "سارا احمدی", username: "@user10", status: "inactive", messages: 373, lastActivity: "3 روز پیش", risk: "high" },
];

export default function UsersContent() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = initialUsers.filter(user =>
    user.name.includes(searchTerm) || user.username.includes(searchTerm)
  );

  return (
    <div className="animate-fadeIn">
      <div className="mb-10 grid grid-cols-1 gap-[25px] sm:grid-cols-3">
        <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <div className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[15px] bg-gradient-to-br from-[var(--success)] to-[#66bb6a] text-[28px] text-white">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="font-lalezar text-4xl mb-2">8,542</div>
          <div className="text-[#999] text-sm">کاربران فعال</div>
        </div>
        <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <div className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[15px] bg-gradient-to-br from-[var(--danger)] to-[#ef5350] text-[28px] text-white">
            <i className="fas fa-user-times"></i>
          </div>
          <div className="font-lalezar text-4xl mb-2">4,305</div>
          <div className="text-[#999] text-sm">کاربران غیرفعال</div>
        </div>
        <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
          <div className="mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-[15px] bg-gradient-to-br from-[var(--warning)] to-[#ffa726] text-[28px] text-white">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="font-lalezar text-4xl mb-2">1,234</div>
          <div className="text-[#999] text-sm">کاربران در معرض خطر</div>
        </div>
      </div>

      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="mb-[25px] flex flex-wrap items-center justify-between gap-[15px]">
          <h3 className="text-xl font-semibold">لیست کاربران</h3>
          <div className="relative flex-1 min-w-[250px]">
            <i className="fas fa-search absolute right-[18px] top-1/2 -translate-y-1/2 text-[#666]"></i>
            <input
              type="text"
              placeholder="جستجوی کاربران..."
              className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 py-3 pl-5 pr-[45px] text-sm outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2.5">
            <button className="flex items-center gap-2 rounded-xl border-2 border-white/10 bg-white/5 px-5 py-3 text-sm transition-all hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
              <i className="fas fa-filter"></i> فیلتر
            </button>
            <button className="flex items-center gap-2 rounded-xl border-2 border-white/10 bg-white/5 px-5 py-3 text-sm transition-all hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
              <i className="fas fa-download"></i> خروجی Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 light-theme:bg-black/2">
              <tr>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">کاربر</th>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">وضعیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">تعداد پیام</th>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">آخرین فعالیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">ریسک ترک</th>
                <th className="p-[15px] text-right text-[13px] font-semibold uppercase text-[#999]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
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
                    <span className={`inline-block rounded-lg px-3 py-1.25 text-xs font-semibold ${user.status === 'active' ? 'bg-[#4caf5033] text-[var(--success)]' : 'bg-[#f4433633] text-[var(--danger)]'}`}>
                      {user.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="p-[18px_15px]">{user.messages}</td>
                  <td className="p-[18px_15px]">{user.lastActivity}</td>
                  <td className="p-[18px_15px]">
                    <span className={`inline-block rounded-lg px-3 py-1.25 text-xs font-semibold ${
                      user.risk === 'high' ? 'bg-[#ff174433] text-[var(--primary-pink)]' :
                      user.risk === 'medium' ? 'bg-[#ff980033] text-[var(--warning)]' :
                      'bg-[#00bcd433] text-[var(--info)]'
                    }`}>
                      {user.risk === 'high' ? 'بالا' : user.risk === 'medium' ? 'متوسط' : 'پایین'}
                    </span>
                  </td>
                  <td className="p-[18px_15px]">
                    <div className="flex gap-2">
                      <button className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#2196f333] text-[var(--primary-blue)] transition-all hover:scale-110">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#f4433633] text-[var(--danger)] transition-all hover:scale-110">
                        <i className="fas fa-trash"></i>
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
