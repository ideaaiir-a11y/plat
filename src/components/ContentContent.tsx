"use client";

import React from "react";

export default function ContentContent() {
  return (
    <div className="animate-fadeIn">
      <div className="mb-[30px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <h3 className="mb-[25px] text-[22px] font-semibold">ایجاد محتوای جدید</h3>
        <form>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">عنوان محتوا</label>
              <input
                type="text"
                placeholder="عنوان محتوا را وارد کنید"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">نوع محتوا</label>
              <select className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
                <option>پست متنی</option>
                <option>تصویر</option>
                <option>ویدیو</option>
                <option>نظرسنجی</option>
                <option>فایل</option>
              </select>
            </div>
          </div>
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-medium">متن محتوا</label>
            <textarea
              placeholder="متن محتوا را بنویسید..."
              className="min-h-[150px] w-full resize-y rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
            ></textarea>
          </div>
          <div className="mb-5 flex flex-col gap-2">
            <label className="text-sm font-medium">آپلود فایل</label>
            <div className="cursor-pointer rounded-[15px] border-2 border-dashed border-white/20 p-10 text-center transition-all hover:border-[var(--primary-purple)] hover:bg-[rgba(156,39,176,0.1)] light-theme:border-black/20">
              <i className="fas fa-cloud-upload-alt mb-[15px] text-[48px] text-[var(--primary-purple)]"></i>
              <p>فایل را اینجا بکشید یا کلیک کنید</p>
              <input type="file" className="hidden" />
            </div>
          </div>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">زمان انتشار</label>
              <input
                type="datetime-local"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">کانال هدف</label>
              <select className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
                <option>کانال اصلی</option>
                <option>کانال آزمایشی</option>
                <option>گروه پشتیبانی</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <button type="submit" className="btn-primary-gradient flex w-auto items-center gap-2.5 rounded-[15px] px-10 py-[15px] text-base font-semibold">
              <i className="fas fa-paper-plane"></i> انتشار فوری
            </button>
            <button type="button" className="flex w-auto items-center gap-2.5 rounded-xl border-2 border-white/10 bg-white/5 px-10 py-[15px] text-sm transition-all hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:border-black/10">
              <i className="fas fa-clock"></i> زمان‌بندی انتشار
            </button>
            <button type="button" className="flex w-auto items-center gap-2.5 rounded-xl border-2 border-white/10 bg-white/5 px-10 py-[15px] text-sm transition-all hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:border-black/10">
              <i className="fas fa-eye"></i> پیش‌نمایش
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="mb-[25px]">
          <h3 className="text-xl font-semibold">محتواهای زمان‌بندی شده</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 light-theme:bg-black/2">
              <tr>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عنوان</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">نوع</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">زمان انتشار</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">کانال</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">وضعیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-[18px_15px]">معرفی محصول جدید</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#2196f333] px-3 py-1.25 text-xs font-semibold text-[var(--primary-blue)]">تصویر</span>
                </td>
                <td className="p-[18px_15px]">1402/12/15 - 14:30</td>
                <td className="p-[18px_15px]">کانال اصلی</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#ff980033] px-3 py-1.25 text-xs font-semibold text-[var(--warning)]">در انتظار</span>
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
                <td className="p-[18px_15px]">نظرسنجی رضایت</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#9c27b033] px-3 py-1.25 text-xs font-semibold text-[var(--primary-purple)]">نظرسنجی</span>
                </td>
                <td className="p-[18px_15px]">1402/12/16 - 10:00</td>
                <td className="p-[18px_15px]">کانال اصلی</td>
                <td className="p-[18px_15px]">
                  <span className="inline-block rounded-lg bg-[#ff980033] px-3 py-1.25 text-xs font-semibold text-[var(--warning)]">در انتظار</span>
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
