"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Square,
  Search,
  Brain,
  FileEdit,
  Save,
  CheckCircle,
  Clock,
  Loader2,
  FileText
} from "lucide-react";

export default function DashboardContent() {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
  const [searchQuery, setSearchQuery] = useState('scientific breakthrough latest discoveries');
  const [postCount, setPostCount] = useState(24);
  const [autoSave, setAutoSave] = useState(true);
  const [newsCount, setNewsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Pipeline progress
  const [stages, setStages] = useState([
    { id: 'search', title: 'جستجو', subtitle: 'جستجوی وب', icon: Search, status: 'waiting', info: 'در انتظار', color: 'bg-[#00c853]' },
    { id: 'analysis', title: 'تحلیل', subtitle: 'تحلیل AI', icon: Brain, status: 'waiting', info: 'در انتظار', color: 'bg-[#6200ea]' },
    { id: 'production', title: 'تولید محتوا', subtitle: 'ساخت پست', icon: FileEdit, status: 'waiting', info: 'در انتظار', color: 'bg-[#ffab00]' },
    { id: 'save', title: 'ذخیره لوکال', subtitle: 'ذخیره فایل', icon: Save, status: 'waiting', info: 'در انتظار', color: 'bg-[#d500f9]' },
  ]);

  const [savedFiles, setSavedFiles] = useState<string[]>([]);

  const runPipeline = async () => {
    setStatus('running');
    setError(null);
    setNewsCount(0);
    setSavedFiles([]);
    setStages(prev => prev.map(s => ({ ...s, status: 'waiting', info: 'در انتظار' })));

    const savedModels = localStorage.getItem('modelPrefs');
    const models = savedModels ? JSON.parse(savedModels) : null;

    try {
      // Step-by-step UI updates (simulated as the API is one block)
      setStages(prev => prev.map(s => s.id === 'search' ? { ...s, status: 'processing', info: 'در حال جستجو...' } : s));

      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: searchQuery,
          count: postCount,
          models: models
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewsCount(result.data.stats.newsCount);
        setSavedFiles(result.files);
        setStages(prev => prev.map(s => ({ ...s, status: 'completed', info: 'تکمیل شد' })));
        setStatus('completed');
      } else {
        throw new Error(result.error || 'Failed to run pipeline');
      }
    } catch (err: any) {
      console.error('Pipeline Error:', err);
      setError(err.message);
      setStatus('error');
      setStages(prev => prev.map(s => s.status === 'processing' ? { ...s, status: 'waiting', info: 'خطا' } : s));
    }
  };

  return (
    <div className="animate-fadeIn space-y-8 font-vazirmatn text-white">
      {/* Control Bar */}
      <div className="bg-[#0f152e] p-6 rounded-[30px] shadow-2xl flex flex-wrap items-center justify-between gap-6 border border-white/5">
        <div className="flex items-center gap-6">
           <div className="bg-white w-10 h-10 rounded-lg shadow-[0_0_15px_white]"></div>
           <div className="flex items-center gap-3">
              <button
                disabled={status !== 'running'}
                onClick={() => setStatus('idle')}
                className="flex items-center gap-2 bg-[#ff1744] hover:bg-[#d50000] px-5 py-2.5 rounded-xl transition-all disabled:opacity-50"
              >
                <Square className="w-4 h-4 fill-white" />
                <span className="font-bold text-sm">توقف</span>
              </button>

              <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#ffab00]/30 bg-[#ffab00]/10 text-[#ffab00] ${status === 'running' ? 'animate-pulse' : ''}`}>
                <Loader2 className={`w-4 h-4 ${status === 'running' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-bold">در حال اجرا</span>
              </div>
           </div>

           <div className="flex items-center gap-3 bg-[#0a0e27]/50 p-1.5 rounded-xl border border-white/5">
              <span className="text-[#999] text-xs px-3">تعداد پست</span>
              <input
                type="number"
                value={postCount}
                onChange={(e) => setPostCount(parseInt(e.target.value))}
                className="w-16 bg-[#0a0e27] border border-white/10 rounded-lg p-2 text-xs focus:border-[#6200ea] outline-none text-center font-bold"
              />
           </div>

           <div className="flex items-center gap-3">
              <span className="text-[#999] text-xs">ذخیره خودکار</span>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`w-12 h-6 rounded-full relative transition-colors ${autoSave ? 'bg-[#ffab00]' : 'bg-gray-600'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoSave ? 'right-1' : 'right-7'}`}></div>
              </button>
           </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0a0e27]/80 px-6 py-4 rounded-2xl border border-white/10 flex-1 min-w-[300px]">
           <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full font-mono text-[#999]"
            />
        </div>

        <div className="flex items-center gap-4">
           {status !== 'running' && (
              <button
                onClick={runPipeline}
                className="bg-[#00c853] hover:bg-[#00a344] p-3 rounded-xl shadow-[0_0_20px_rgba(0,200,83,0.3)] transition-all"
              >
                <Play className="w-6 h-6 fill-white" />
              </button>
           )}
           <div className="text-left">
              <h1 className="text-xl font-bold text-[#00c853]">اتوماسیون محتوا با هوش مصنوعی</h1>
              <p className="text-[#999] text-[10px] text-right">جستجو ← تحلیل ← تولید ← ذخیره لوکال</p>
           </div>
        </div>
      </div>

      {/* Pipeline Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#999]">
          <Loader2 className="w-5 h-5" />
          <h2 className="font-bold">پایپ‌لاین هوش مصنوعی</h2>
          <span className="text-xs bg-white/5 px-2 py-1 rounded">ذخیره در: /storage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`p-6 rounded-[25px] border-2 transition-all duration-500 ${
                stage.status === 'processing' ? 'border-[#ffab00] bg-[#ffab00]/5 scale-105 shadow-[0_0_30px_rgba(255,171,0,0.1)]' :
                stage.status === 'completed' ? 'border-[#00c853]/20 bg-white/2' :
                'border-white/5 bg-white/2 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-2 h-2 rounded-full bg-current" style={{ color: stage.status === 'completed' ? '#00c853' : stage.status === 'processing' ? '#ffab00' : '#666' }}></div>
                <div className={`${stage.color} p-3 rounded-2xl`}>
                  <stage.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{stage.title}</h3>
                <p className="text-[#999] text-xs">{stage.subtitle}</p>
              </div>
              <div className="mt-6 flex items-center gap-2">
                {stage.status === 'processing' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#ffab00]" />
                ) : stage.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-[#00c853]" />
                ) : null}
                <span className={`text-xs font-medium ${
                  stage.status === 'processing' ? 'text-[#ffab00]' :
                  stage.status === 'completed' ? 'text-[#00c853]' : 'text-[#666]'
                }`}>
                  {stage.info}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File List Console */}
      {savedFiles.length > 0 && (
        <div className="bg-[#1a1f3a]/50 border border-[#00c853]/20 rounded-[30px] p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#00c853]">
              <CheckCircle className="w-6 h-6" />
              <h3 className="font-bold">فایل‌ها ذخیره شدند</h3>
              <span className="text-sm bg-[#00c853]/10 px-2 py-1 rounded">{savedFiles.length} فایل</span>
            </div>
            <div className="bg-[#00c853]/20 p-2 rounded-lg text-[#00c853]">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2 font-mono text-[10px] md:text-xs text-[#999] overflow-x-auto">
            {savedFiles.map((file, idx) => (
              <div key={idx} className="bg-black/20 p-2 rounded border border-white/5 hover:border-white/10 transition-colors">
                {file}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1f3a] p-8 rounded-[30px] flex flex-col items-center justify-center space-y-2">
          <div className="text-[#ffab00] text-5xl font-bold font-lalezar">{postCount}</div>
          <div className="text-[#999] text-sm">پست هدف</div>
        </div>
        <div className="bg-[#1a1f3a] p-8 rounded-[30px] flex flex-col items-center justify-center space-y-2">
          <div className="text-[#00c853] text-5xl font-bold font-lalezar">{newsCount}</div>
          <div className="text-[#999] text-sm">خبر</div>
        </div>
      </div>
    </div>
  );
}
