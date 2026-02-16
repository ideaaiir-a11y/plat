"use client";

import React from "react";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container flex min-h-screen items-center justify-center p-5">
      <div className="login-box neon-border w-full max-w-[450px] rounded-[30px] bg-[var(--dark-card)] p-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-[10px] light-theme:bg-[var(--light-card)] light-theme:shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="mb-10 text-center">
          <h1 className="font-lalezar text-[42px] mb-2.5 bg-gradient-to-r from-[var(--primary-pink)] via-[var(--primary-purple)] to-[var(--primary-blue)] bg-clip-text text-transparent animate-textShine">
            🤖 روبیکا پنل
          </h1>
          <p className="text-[14px] text-[#999]">پنل مدیریت پیشرفته بات روبیکا</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-[25px]">
            <label className="mb-2 block text-sm font-medium">نام کاربری یا ایمیل</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 py-[15px] pl-5 pr-[50px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] focus:shadow-[0_0_20px_rgba(156,39,176,0.3)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
                placeholder="admin@rubika.ir"
                required
              />
              <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-[18px] text-[#666]"></i>
            </div>
          </div>
          <div className="mb-[25px]">
            <label className="mb-2 block text-sm font-medium">رمز عبور</label>
            <div className="relative">
              <input
                type="password"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 py-[15px] pl-5 pr-[50px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] focus:shadow-[0_0_20px_rgba(156,39,176,0.3)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
                placeholder="••••••••"
                required
              />
              <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-[18px] text-[#666]"></i>
            </div>
          </div>
          <div className="mb-[25px]">
            <label className="mb-2 block text-sm font-medium">کد تایید دو مرحله‌ای (2FA)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 py-[15px] pl-5 pr-[50px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] focus:shadow-[0_0_20px_rgba(156,39,176,0.3)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
                placeholder="123456"
                maxLength={6}
              />
              <i className="fas fa-shield-alt absolute left-5 top-1/2 -translate-y-1/2 text-[18px] text-[#666]"></i>
            </div>
          </div>
          <button type="submit" className="btn-primary-gradient w-full rounded-[15px] py-4 text-base font-semibold">
            ورود به پنل
          </button>
        </form>
      </div>
    </div>
  );
}
