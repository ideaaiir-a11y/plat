"use client";

import React from "react";

export default function MessagesContent() {
  return (
    <div className="animate-fadeIn">
      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="mb-[25px] flex items-center justify-between">
          <h3 className="text-xl font-semibold">مدیریت پیام‌ها و Keypad</h3>
          <button className="btn-primary-gradient flex w-auto items-center gap-2 rounded-[15px] px-[30px] py-3 text-sm font-semibold">
            <i className="fas fa-plus ml-2"></i> ارسال پیام جدید
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 light-theme:bg-black/2">
              <tr>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">گیرنده</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">متن پیام</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">نوع</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">زمان ارسال</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">وضعیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[18px_15px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-blue)] text-sm font-bold text-white">
                      ک
                    </div>
                    <div>
                      <div className="font-semibold">کانال اصلی</div>
                      <div className="text-xs text-[#999]">@main_channel</div>
                    </div>
                  </div>
                </td>
                <td className="p-[18px_15px]">خوش آمدید! برای شروع دکمه زیر را بزنید</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#2196f333] px-3 py-1.25 text-xs font-semibold text-[var(--primary-blue)]">Keypad</span>
                </td>
                <td className="p-[18px_15px]">1402/12/14 - 15:30</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#4caf5033] px-3 py-1.25 text-xs font-semibold text-[var(--success)]">ارسال شده</span>
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
              <tr>
                <td className="p-[18px_15px]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-blue)] text-sm font-bold text-white">
                      گ
                    </div>
                    <div>
                      <div className="font-semibold">گروه پشتیبانی</div>
                      <div className="text-xs text-[#999]">@support_group</div>
                    </div>
                  </div>
                </td>
                <td className="p-[18px_15px]">نظرسنجی: نظر شما در مورد خدمات ما؟</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#9c27b033] px-3 py-1.25 text-xs font-semibold text-[var(--primary-purple)]">Poll</span>
                </td>
                <td className="p-[18px_15px]">1402/12/14 - 12:00</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#4caf5033] px-3 py-1.25 text-xs font-semibold text-[var(--success)]">ارسال شده</span>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
