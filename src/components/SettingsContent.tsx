"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

const tabs = [
  { id: "general", label: "عمومی" },
  { id: "bot", label: "تنظیمات بات" },
  { id: "security", label: "امنیت" },
  { id: "notifications", label: "اعلان‌ها" },
  { id: "api", label: "API" },
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="animate-fadeIn">
      <div className="mb-[30px] flex flex-wrap gap-2.5 border-b-2 border-white/10 pb-1.25 light-theme:border-black/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              "rounded-t-xl px-6 py-3 text-[15px] font-medium transition-all duration-300 text-white/60 light-theme:text-black/60",
              activeTab === tab.id && "bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-purple)] text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-contents">
        {activeTab === "general" && (
          <div className="animate-fadeIn">
            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">تنظیمات عمومی</h3>
              <div className="flex items-center justify-between border-b border-white/5 py-[15px] last:border-0 light-theme:border-black/5">
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">زبان رابط کاربری</h4>
                  <p className="text-[13px] text-[#999]">انتخاب زبان نمایش پنل</p>
                </div>
                <select className="w-[200px] rounded-[15px] border-2 border-white/10 bg-white/5 p-2 text-sm outline-none light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
                  <option>فارسی</option>
                  <option>English</option>
                </select>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 py-[15px] last:border-0 light-theme:border-black/5">
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">تم پیش‌فرض</h4>
                  <p className="text-[13px] text-[#999]">انتخاب تم روشن یا تیره</p>
                </div>
                <select className="w-[200px] rounded-[15px] border-2 border-white/10 bg-white/5 p-2 text-sm outline-none light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
                  <option>تیره</option>
                  <option>روشن</option>
                  <option>خودکار</option>
                </select>
              </div>
            </div>

            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">تنظیمات نمایش</h3>
              <div className="flex items-center justify-between border-b border-white/5 py-[15px] last:border-0 light-theme:border-black/5">
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">انیمیشن‌ها</h4>
                  <p className="text-[13px] text-[#999]">فعال یا غیرفعال کردن انیمیشن‌های رابط کاربری</p>
                </div>
                <label className="relative inline-block h-[30px] w-[60px] cursor-pointer">
                  <input type="checkbox" className="peer hidden" defaultChecked />
                  <span className="absolute inset-0 rounded-[30px] bg-white/10 transition-all duration-400 peer-checked:bg-gradient-to-r peer-checked:from-[var(--primary-pink)] peer-checked:to-[var(--primary-purple)] before:absolute before:bottom-1 before:left-1 before:h-[22px] before:w-[22px] before:rounded-full before:bg-white before:transition-all before:duration-400 peer-checked:before:translate-x-[30px]"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bot" && (
          <div className="animate-fadeIn">
            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">اطلاعات بات</h3>
              <div className="mb-5 flex flex-col gap-2">
                <label className="text-sm font-medium">توکن بات</label>
                <input type="text" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none light-theme:border-black/10 light-theme:bg-black/2" defaultValue="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" />
              </div>
              <button className="btn-primary-gradient w-auto rounded-[15px] px-[30px] py-3 text-sm font-semibold">
                <i className="fas fa-save ml-2"></i> ذخیره تغییرات
              </button>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly if needed, but this covers the structure */}
      </div>
    </div>
  );
}
