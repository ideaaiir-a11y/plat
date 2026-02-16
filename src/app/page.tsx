"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Settings,
  Play,
  Gamepad2,
  History,
  Cpu,
  Globe,
  LogOut,
  User,
  Zap,
  CheckCircle2,
  Clock,
  Menu,
  X
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pipelineState, setPipelineState] = useState('idle'); // idle, running, completed
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [stats, setStats] = useState({
    daily: 24,
    scheduled: 0,
    pending: 0,
    progress: 0
  });

  const [config, setConfig] = useState({
    explorer: 'qwen3:4b',
    analyzer: 'gemma3:latest',
    reporter: 'llava:13b',
    scheduler: 'ideaai/hooshafza:latest'
  });

  // OX Game State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const calculateWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleSquareClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
    } else if (!newBoard.includes(null)) {
      setWinner('draw');
    }
  };

  useEffect(() => {
    if (!isXNext && !winner && activeTab === 'games') {
      const timeout = setTimeout(() => {
        const emptySquares = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        if (emptySquares.length > 0) {
          const randomIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];
          const newBoard = board.slice();
          newBoard[randomIndex] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
          const win = calculateWinner(newBoard);
          if (win) setWinner(win);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isXNext, board, winner, activeTab]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const startPipeline = async () => {
    if (pipelineState === 'running') return;

    setPipelineState('running');
    setLogs(['شروع فرآیند کاوش محتوا...', 'در حال اتصال به مدل Explorer...']);
    setStats(prev => ({ ...prev, progress: 10 }));

    try {
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config })
      });

      const data = await res.json();

      if (data.success) {
        setLogs(prev => [...prev, 'کاوش با موفقیت انجام شد.', 'در حال تحلیل و بازآفرینی محتوا...', 'زمان‌بندی پست‌ها تکمیل شد.']);
        setStats(prev => ({ ...prev, progress: 100, scheduled: data.data.length, pending: 0 }));
        setResults(data.data);

        await fetch('/api/storage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: data.data, type: 'posts' })
        });

        setPipelineState('completed');
      }
    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, 'خطا در اجرای پایپ‌لاین!']);
      setPipelineState('idle');
    }
  };

  useEffect(() => {
    // Check Ollama connection with a timeout to avoid long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    fetch('http://localhost:11434/api/tags', { signal: controller.signal })
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))
      .finally(() => clearTimeout(timeoutId));

    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('auth_session');
      if (auth) {
        try {
          const session = JSON.parse(auth);
          if (session.expiresAt > Date.now()) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('auth_session');
          }
        } catch (e) {
          localStorage.removeItem('auth_session');
        }
      }
    }
  }, []);

  const login = () => {
    const session = {
      user: 'admin',
      expiresAt: Date.now() + 3600000 // 1 hour
    };
    localStorage.setItem('auth_session', JSON.stringify(session));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    setIsAuthenticated(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'pipeline', label: 'پایپ‌لاین', icon: Zap },
    { id: 'history', label: 'تاریخچه', icon: History },
    { id: 'games', label: 'سرگرمی', icon: Gamepad2 },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#0f172a] border-l border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              هوش‌افزا
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] lg:text-xs font-medium border ${
              isConnected ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {isConnected ? 'Ollama متصل است' : 'Ollama قطع است'}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors hidden sm:block">
              <Globe size={20} />
            </button>
            <div className="h-8 w-px bg-slate-800 mx-2 hidden sm:block" />
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">کاربر مدیر</p>
                  <p className="text-[10px] text-slate-400">پنل اتوماسیون</p>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <User size={20} className="text-blue-400" />
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-4 lg:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 text-sm"
              >
                ورود به پنل
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold">داشبورد مدیریت محتوا</h2>
                  <p className="text-slate-400 mt-1">مدیریت فرآیندهای خودکار تولید پست روزانه</p>
                </div>
                <button
                  onClick={startPipeline}
                  disabled={pipelineState === 'running'}
                  className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-xl disabled:opacity-50 ${
                    pipelineState === 'running'
                    ? 'bg-amber-500 text-white shadow-amber-500/20'
                    : pipelineState === 'completed'
                    ? 'bg-blue-600 text-white shadow-blue-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {pipelineState === 'running' ? <><Clock size={20} className="animate-spin" /> در حال اجرا...</> : pipelineState === 'completed' ? <><CheckCircle2 size={20} /> تکمیل شد</> : <><Play size={20} /> شروع فرآیند</>}
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { label: 'پست‌های روزانه', value: stats.daily, icon: LayoutDashboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { label: 'زمان‌بندی شده', value: stats.scheduled, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'در انتظار', value: stats.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'پیشرفت کلی', value: `${stats.progress}%`, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Pipeline Config */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap size={20} className="text-blue-400" />
                        <h3 className="text-xl font-bold">تنظیمات مدل‌های پایپ‌لاین</h3>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { key: 'explorer', label: 'مدل کاوشگر (Explorer)', description: 'جستجو و استخراج عناوین', models: ['qwen3:4b', 'llama3.2:1b'] },
                        { key: 'analyzer', label: 'مدل تحلیل‌گر (Analyzer)', description: 'ویرایش و تحلیل علمی', models: ['gemma3:latest', 'gemma3:4b'] },
                        { key: 'reporter', label: 'مدل گزارشگر (Reporter)', description: 'تولید محتوا و رسانه', models: ['llava:13b', 'llama2:latest'] },
                        { key: 'scheduler', label: 'مدل زمان‌بند (Scheduler)', description: 'بازآفرینی و زمانبندی کرون', models: ['ideaai/hooshafza:latest', 'llama3.2:latest'] },
                      ].map((step) => (
                        <div key={step.key} className="space-y-3">
                          <label className="block">
                            <span className="text-sm font-bold text-slate-300">{step.label}</span>
                            <span className="block text-xs text-slate-500 mb-2">{step.description}</span>
                            <select
                              value={config[step.key as keyof typeof config]}
                              onChange={(e) => setConfig({...config, [step.key]: e.target.value})}
                              className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none shadow-inner"
                            >
                              {step.models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logs Section */}
                  <div className="bg-[#1e293b] border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-800">
                      <h3 className="font-bold flex items-center gap-2">
                        <History size={18} className="text-blue-400" />
                        لاگ‌های عملیاتی
                      </h3>
                    </div>
                    <div className="p-6 h-64 overflow-y-auto font-mono text-sm space-y-2 bg-[#020617]/50 scrollbar-thin scrollbar-thumb-slate-700">
                      {logs.length === 0 ? (
                        <p className="text-slate-600 italic">در انتظار شروع فرآیند...</p>
                      ) : (
                        logs.map((log, i) => (
                          <div key={i} className="flex gap-2 text-slate-300">
                            <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString('fa-IR')}]</span>
                            <span className="text-blue-400">»</span>
                            <span>{log}</span>
                          </div>
                        ))
                      )}
                      {pipelineState === 'running' && (
                        <div className="flex gap-2 animate-pulse text-emerald-400">
                           <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString('fa-IR')}]</span>
                           <span>...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl text-white">
                    <h3 className="text-lg font-bold mb-2">اشتراک ویژه</h3>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">شما از تمامی امکانات هوش مصنوعی به صورت نامحدود در سرورهای محلی خود استفاده می‌کنید.</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-2 rounded-lg">
                        <CheckCircle2 size={14} /> پشتیبانی از پردازش موازی
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-2 rounded-lg">
                        <CheckCircle2 size={14} /> ذخیره‌سازی خودکار در Liara
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] border border-slate-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold mb-4">زمان‌بندی کرون</h3>
                    <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 mb-4 text-center" dir="ltr">
                      <code className="text-emerald-400 font-mono text-lg">20/1 2 * 1 3</code>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      هر ۲۰ دقیقه در ساعت ۲، روزهای دوشنبه و چهارشنبه هر ماه. این تنظیمات توسط مدل زمان‌بند به صورت خودکار بهینه می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              {results.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <h3 className="text-xl font-bold mb-4">آخرین پست‌های تولید شده</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((post, i) => (
                      <div key={i} className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col h-full hover:border-blue-500/30 transition-colors">
                        <h4 className="font-bold text-lg mb-3 text-blue-400">{post.refinedTitle}</h4>
                        <p className="text-sm text-slate-300 flex-1 leading-relaxed mb-4">{post.content}</p>
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20">
                            زمان‌بندی: {new Date(post.scheduleTime).toLocaleTimeString('fa-IR')}
                          </span>
                          <CheckCircle2 size={18} className="text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'games' && (
            <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-500 p-4">
              <div className="bg-[#1e293b] p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center space-y-8 max-w-md w-full">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">بازی دوز (OX)</h3>
                  <p className="text-slate-400">یک بازی سریع برای زمان‌های انتظار</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {board.map((square, i) => (
                    <button
                      key={i}
                      onClick={() => handleSquareClick(i)}
                      className="w-20 h-20 bg-[#0f172a] rounded-2xl flex items-center justify-center text-4xl font-bold border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all shadow-inner"
                    >
                      <AnimatePresence mode="wait">
                        {square && (
                          <motion.span
                            key={square}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={square === 'X' ? 'text-blue-400' : 'text-emerald-400'}
                          >
                            {square}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  ))}
                </div>

                {winner && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-xl font-bold mb-4">
                      {winner === 'draw' ? 'بازی مساوی شد!' : `برنده: ${winner === 'X' ? 'شما' : 'هوش مصنوعی'}`}
                    </p>
                    <button
                      onClick={resetGame}
                      className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-600/20"
                    >
                      دوباره بازی کن
                    </button>
                  </motion.div>
                )}

                {!winner && (
                  <p className="text-slate-500 font-medium">
                    نوبت: {isXNext ? 'شما (X)' : 'هوش مصنوعی (O)'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 py-8">
              <h2 className="text-2xl lg:text-3xl font-bold">تنظیمات سیستم</h2>

              <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-8 shadow-sm">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                    <User size={20} className="text-blue-400" />
                    پروفایل کاربری
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">نام نمایشی</label>
                      <input
                        type="text"
                        defaultValue="کاربر مدیر"
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/50 outline-none text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Globe size={20} className="text-emerald-400" />
                    اتصال به شبکه
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                    <div>
                      <p className="font-bold">ذخیره‌سازی ابری Liara</p>
                      <p className="text-xs text-slate-500">storage.c2.liara.space/idea</p>
                    </div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1 cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full translate-x-6" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all transform active:scale-95">
                    ذخیره تغییرات
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && activeTab !== 'games' && activeTab !== 'settings' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <div className="w-16 h-16 bg-[#1e293b] rounded-2xl flex items-center justify-center border border-slate-800 shadow-sm">
                <Zap size={32} />
              </div>
              <p className="text-lg">در حال آماده‌سازی بخش {navItems.find(i => i.id === activeTab)?.label}...</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
