"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

import { Cpu, Loader2, CheckCircle } from "lucide-react";

const tabs = [
  { id: "general", label: "عمومی" },
  { id: "bot", label: "تنظیمات بات" },
  { id: "models", label: "مدل‌های هوش مصنوعی" },
  { id: "zai", label: "Z.ai SDK" },
  { id: "stream", label: "استریم زنده" },
  { id: "security", label: "امنیت" },
  { id: "notifications", label: "اعلان‌ها" },
  { id: "api", label: "API" },
];

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState("general");
  const [ollamaModels, setOllamaModels] = useState<any[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelPrefs, setModelPrefs] = useState({
    explorer: "qwen3:4b",
    analyzer: "gemma3:latest",
    reporter: "llava:13b",
    scheduler: "ideaai/hooshafza:latest",
    provider: "ollama",
    zaiApiKey: "",
    zaiModel: "z-pro",
    botToken: "1234567890:ABCdefGHIjklMNOpqrsTUVwxyz",
    targetChannel: "کانال اصلی"
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('modelPrefs');
    if (saved) {
      const parsed = JSON.parse(saved);
      setModelPrefs(prev => ({ ...prev, ...parsed }));
    }

    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await fetch('/api/ollama/models');
        const data = await res.json();
        if (data.models) setOllamaModels(data.models);
      } catch (e) {
        console.error("Failed to fetch Ollama models", e);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  const saveModelPrefs = () => {
    localStorage.setItem('modelPrefs', JSON.stringify(modelPrefs));
    alert('تنظیمات مدل‌ها با موفقیت ذخیره شد');
  };

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

        {activeTab === "models" && (
          <div className="animate-fadeIn space-y-6">
            <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <div className="flex items-center justify-between mb-8 border-b-2 border-white/10 pb-5">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <Cpu className="text-[var(--primary-purple)]" />
                  تنظیمات مدل‌های هوش مصنوعی
                </h3>
                <div className="flex gap-2">
                   <button
                     onClick={() => setModelPrefs(prev => ({ ...prev, provider: 'ollama' }))}
                     className={twMerge("px-4 py-2 rounded-lg text-xs font-bold transition-all", modelPrefs.provider === 'ollama' ? 'bg-[var(--primary-purple)] text-white' : 'bg-white/5')}
                   >Ollama</button>
                   <button
                     onClick={() => setModelPrefs(prev => ({ ...prev, provider: 'zai' }))}
                     className={twMerge("px-4 py-2 rounded-lg text-xs font-bold transition-all", modelPrefs.provider === 'zai' ? 'bg-[var(--primary-blue)] text-white' : 'bg-white/5')}
                   >Z.ai SDK</button>
                </div>
                {loadingModels ? (
                  <Loader2 className="animate-spin text-[#999]" />
                ) : (
                  <div className="flex items-center gap-2 text-xs text-[#00c853]">
                    <CheckCircle className="w-4 h-4" />
                    <span>متصل به Ollama</span>
                  </div>
                )}
              </div>

              {modelPrefs.provider === 'ollama' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { key: 'explorer', label: 'مدل Explorer (جستجو)', current: modelPrefs.explorer },
                    { key: 'analyzer', label: 'مدل Analyzer (تحلیل)', current: modelPrefs.analyzer },
                    { key: 'reporter', label: 'مدل Reporter (تولید محتوا)', current: modelPrefs.reporter },
                    { key: 'scheduler', label: 'مدل Scheduler (زمان‌بندی)', current: modelPrefs.scheduler }
                  ].map((stage) => (
                    <div key={stage.key} className="space-y-3">
                      <label className="text-sm font-medium text-[#999]">{stage.label}</label>
                      <select
                        value={stage.current as string}
                        onChange={(e) => setModelPrefs(prev => ({ ...prev, [stage.key]: e.target.value }))}
                        className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-[var(--primary-purple)]"
                      >
                        {ollamaModels.length > 0 ? (
                          ollamaModels.map((m) => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                          ))
                        ) : (
                          <option value={stage.current as string}>{stage.current as string} (پیش‌فرض)</option>
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400">
                    تمامی مراحل پایپ‌لاین توسط مدل <b>{modelPrefs.zaiModel}</b> در سرویس Z.ai پردازش خواهد شد.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-[#999]">مدل انتخابی Z.ai</label>
                      <select
                        value={modelPrefs.zaiModel}
                        onChange={(e) => setModelPrefs(prev => ({ ...prev, zaiModel: e.target.value }))}
                        className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-[var(--primary-blue)]"
                      >
                        <option value="z-pro">z-pro (پیشنهادی)</option>
                        <option value="z-flash">z-flash (سریع)</option>
                        <option value="z-vision">z-vision (تصویر)</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-[#999]">API Key</label>
                      <input
                        type="password"
                        value={modelPrefs.zaiApiKey}
                        onChange={(e) => setModelPrefs(prev => ({ ...prev, zaiApiKey: e.target.value }))}
                        placeholder="sk-zai-..."
                        className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-4 text-sm outline-none focus:border-[var(--primary-blue)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <button
                  onClick={saveModelPrefs}
                  className="btn-primary-gradient w-full md:w-auto rounded-[15px] px-[50px] py-4 text-base font-bold shadow-lg"
                >
                  ذخیره پیکربندی مدل‌ها
                </button>
              </div>
            </div>

            <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] light-theme:bg-[var(--light-card)]">
               <h4 className="text-sm font-bold mb-4">مدل‌های موجود در سیستم</h4>
               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {ollamaModels.map(m => (
                    <div key={m.name} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center gap-2">
                       <div className="text-xs font-bold truncate w-full text-center">{m.name}</div>
                       <div className="text-[10px] text-[#999]">{(m.size / 1024 / 1024 / 1024).toFixed(1)} GB</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === "stream" && (
          <div className="animate-fadeIn">
            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">تنظیمات استریم RTMP</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">RTMP URL</label>
                  <input type="text" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none" defaultValue="rtmp://5.106.7.105/stream/" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Stream Key</label>
                  <input type="password" dir="ltr" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none" defaultValue="6992afa092c2803158862fcenfmthqsgscsiqfjdwbucppyprujllvpa?pt=bekuqmpyznnnxgwfxtuqlyedadkzvaoq" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">عرض (Width)</label>
                  <input type="number" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none text-center" defaultValue="720" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">ارتفاع (Height)</label>
                  <input type="number" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none text-center" defaultValue="1280" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">بیت‌ریت (Bitrate)</label>
                  <input type="text" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none text-center" defaultValue="1200k" />
                </div>
              </div>

              <button className="btn-primary-gradient w-auto rounded-[15px] px-[30px] py-3 text-sm font-semibold">
                <i className="fas fa-save ml-2"></i> ذخیره تنظیمات استریم
              </button>
            </div>
          </div>
        )}

        {activeTab === "zai" && (
          <div className="animate-fadeIn">
            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">پیکربندی Z.ai SDK</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">API Key</label>
                  <input
                    type="password"
                    value={modelPrefs.zaiApiKey}
                    onChange={(e) => setModelPrefs(prev => ({ ...prev, zaiApiKey: e.target.value }))}
                    className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none"
                    placeholder="sk-zai-..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Base URL (اختیاری)</label>
                  <input type="text" className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none" placeholder="https://api.z.ai/v1" />
                </div>
                <button
                  onClick={saveModelPrefs}
                  className="btn-primary-gradient w-auto rounded-[15px] px-[30px] py-3 text-sm font-semibold"
                >
                  <i className="fas fa-save ml-2"></i> ذخیره تنظیمات Z.ai
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "bot" && (
          <div className="animate-fadeIn">
            <div className="mb-[25px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
              <h3 className="mb-5 border-b-2 border-white/10 pb-[15px] text-lg font-semibold light-theme:border-black/10">اطلاعات بات</h3>
              <div className="mb-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">توکن بات</label>
                  <input
                    type="text"
                    value={modelPrefs.botToken}
                    onChange={(e) => setModelPrefs(prev => ({ ...prev, botToken: e.target.value }))}
                    className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none light-theme:border-black/10 light-theme:bg-black/2"
                    placeholder="Bot Token"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">آیدی کانال یا گروه (GUID/Username)</label>
                  <input
                    type="text"
                    value={modelPrefs.targetChannel}
                    onChange={(e) => setModelPrefs(prev => ({ ...prev, targetChannel: e.target.value }))}
                    className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-3 text-sm outline-none light-theme:border-black/10 light-theme:bg-black/2"
                    placeholder="@channel or GUID"
                  />
                </div>
              </div>
              <button
                onClick={saveModelPrefs}
                className="btn-primary-gradient w-auto rounded-[15px] px-[30px] py-3 text-sm font-semibold"
              >
                <i className="fas fa-save ml-2"></i> ذخیره تنظیمات بات
              </button>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly if needed, but this covers the structure */}
      </div>
    </div>
  );
}
