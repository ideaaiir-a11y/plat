"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Login from "@/components/Login";
import DashboardContent from "@/components/DashboardContent";
import UsersContent from "@/components/UsersContent";
import PredictionContent from "@/components/PredictionContent";
import ContentContent from "@/components/ContentContent";
import ReportsContent from "@/components/ReportsContent";
import MessagesContent from "@/components/MessagesContent";
import SettingsContent from "@/components/SettingsContent";
import FloatingBall from "@/components/FloatingBall";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "داشبورد اصلی", subtitle: "خوش آمدید به پنل مدیریت روبیکا" },
  users: { title: "مدیریت کاربران", subtitle: "مشاهده و مدیریت کاربران بات" },
  prediction: { title: "پیش‌بینی هوشمند", subtitle: "تحلیل و پیش‌بینی رفتار کاربران" },
  content: { title: "مدیریت محتوا", subtitle: "ایجاد و مدیریت محتوای بات" },
  reports: { title: "گزارش‌دهی", subtitle: "مشاهده گزارش‌های عملکرد" },
  messages: { title: "مدیریت پیام‌ها", subtitle: "ارسال و مدیریت پیام‌های بات" },
  settings: { title: "تنظیمات", subtitle: "پیکربندی و تنظیمات سیستم" },
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const savedTheme = localStorage.getItem("theme") === "light";
    setIsLoggedIn(savedLoggedIn);
    setIsLightTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (isLightTheme) {
      document.body.classList.add("light-theme");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-theme");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightTheme]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="bg-gradient"></div>
        <Login onLogin={handleLogin} />
      </>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <DashboardContent />;
      case "users": return <UsersContent />;
      case "prediction": return <PredictionContent />;
      case "content": return <ContentContent />;
      case "reports": return <ReportsContent />;
      case "messages": return <MessagesContent />;
      case "settings": return <SettingsContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="bg-gradient"></div>
      <FloatingBall />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        onLogout={handleLogout}
      />

      <main className={`main-content transition-all duration-300 ${isSidebarOpen ? "lg:mr-[280px]" : "mr-0"} w-full p-[30px]`}>
        <Header
          title={pageTitles[activePage].title}
          subtitle={pageTitles[activePage].subtitle}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onThemeToggle={() => setIsLightTheme(!isLightTheme)}
          isLightTheme={isLightTheme}
        />

        {renderContent()}
      </main>
    </div>
  );
}
