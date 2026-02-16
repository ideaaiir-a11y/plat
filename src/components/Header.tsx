"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  isLightTheme: boolean;
}

export default function Header({
  title,
  subtitle,
  onMenuToggle,
  onThemeToggle,
  isLightTheme,
}: HeaderProps) {
  return (
    <header className="mb-10 flex items-center justify-between rounded-[20px] bg-[var(--dark-card)] px-[30px] py-[25px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)] light-theme:shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="header-title">
        <h1 className="font-lalezar text-[32px] mb-1">{title}</h1>
        <p className="text-[#999] text-sm">{subtitle}</p>
      </div>
      <div className="flex items-center gap-[15px]">
        <button
          onClick={onMenuToggle}
          className="flex lg:hidden h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-white/10 border-none text-white cursor-pointer text-[20px] light-theme:bg-black/5 light-theme:text-[var(--text-light)]"
        >
          <i className="fas fa-bars"></i>
        </button>
        <button
          id="themeToggle"
          onClick={onThemeToggle}
          className="flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-white/10 border-none text-white cursor-pointer text-[20px] transition-all duration-300 hover:scale-110 hover:rotate-[15deg] hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] hover:text-white light-theme:bg-black/5 light-theme:text-[var(--text-light)]"
        >
          <i className={twMerge("fas", isLightTheme ? "fa-sun" : "fa-moon")}></i>
        </button>
        <button className="relative flex h-[50px] w-[50px] items-center justify-center rounded-[15px] bg-white/10 border-none text-white cursor-pointer text-[20px] transition-all duration-300 light-theme:bg-black/5 light-theme:text-[var(--text-light)]">
          <i className="fas fa-bell"></i>
          <span className="absolute -left-[5px] -top-[5px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[var(--danger)] text-[11px] font-bold text-white animate-pulse">
            3
          </span>
        </button>
        <div className="flex items-center gap-3 rounded-[15px] bg-white/10 px-5 py-2.5 transition-all duration-300 hover:bg-gradient-to-br hover:from-[var(--primary-pink)] hover:to-[var(--primary-purple)] cursor-pointer light-theme:bg-black/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-pink)] to-[var(--primary-blue)] text-lg font-bold">
            A
          </div>
          <div className="user-info">
            <h4 className="text-sm font-semibold mb-0.5">ادمین</h4>
            <p className="text-[11px] text-[#999]">مدیر سیستم</p>
          </div>
        </div>
      </div>
    </header>
  );
}
