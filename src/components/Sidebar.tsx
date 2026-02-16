"use client";

import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  onLogout: () => void;
}

const menuItems = [
  { id: "dashboard", label: "داشبورد", icon: "fas fa-home" },
  { id: "users", label: "مدیریت کاربران", icon: "fas fa-users" },
  { id: "prediction", label: "پیش‌بینی هوشمند", icon: "fas fa-brain" },
  { id: "content", label: "مدیریت محتوا", icon: "fas fa-file-alt" },
  { id: "reports", label: "گزارش‌دهی", icon: "fas fa-chart-bar" },
  { id: "messages", label: "مدیریت پیام‌ها", icon: "fas fa-comments" },
  { id: "settings", label: "تنظیمات", icon: "fas fa-cog" },
];

export default function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  onLogout,
}: SidebarProps) {
  return (
    <aside
      className={twMerge(
        "fixed right-0 top-0 z-[1000] h-screen w-[280px] overflow-y-auto bg-[var(--dark-card)] p-7.5 transition-all duration-300 shadow-[-5px_0_30px_rgba(0,0,0,0.3)] light-theme:bg-[var(--light-card)] light-theme:shadow-[-5px_0_30px_rgba(0,0,0,0.05)]",
        !isOpen && "translate-x-full lg:translate-x-0",
        isOpen && "translate-x-0"
      )}
    >
      <div className="mb-10 border-b-2 border-white/10 pb-7.5 text-center">
        <h2 className="font-lalezar text-[28px] bg-gradient-to-r from-[var(--primary-pink)] via-[var(--primary-purple)] to-[var(--primary-blue)] bg-clip-text text-transparent">
          🤖 روبیکا پنل
        </h2>
      </div>
      <ul className="list-none">
        {menuItems.map((item) => (
          <li key={item.id} className="mb-2.5">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.id);
              }}
              className={twMerge(
                "relative flex items-center overflow-hidden rounded-[15px] px-5 py-[15px] text-white/70 no-underline transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-x-1.25 light-theme:text-black/60 light-theme:hover:bg-black/5 light-theme:hover:text-[var(--text-light)]",
                activePage === item.id && "sidebar-link-active text-white"
              )}
            >
              <i className={twMerge(item.icon, "ml-[15px] w-[25px] text-[20px]")}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
        <li className="mb-2.5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="relative flex items-center overflow-hidden rounded-[15px] px-5 py-[15px] text-white/70 no-underline transition-all duration-300 hover:bg-white/10 hover:text-white hover:-translate-x-1.25 light-theme:text-black/60 light-theme:hover:bg-black/5 light-theme:hover:text-[var(--text-light)]"
          >
            <i className="fas fa-sign-out-alt ml-[15px] w-[25px] text-[20px]"></i>
            <span>خروج</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}
