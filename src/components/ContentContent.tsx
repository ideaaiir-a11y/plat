"use client";

import React from "react";

import { Video, Radio, Power, Settings as SettingsIcon, Loader2, Sparkles, Send, Eye, Clock as ClockIcon, FileJson, Upload, Trash2, Play, Link as LinkIcon, Layers } from "lucide-react";

export default function ContentContent() {
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = React.useState(false);

  // Form state
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("پست متنی");
  const [content, setContent] = React.useState("");
  const [schedule, setSchedule] = React.useState("");
  const [channel, setChannel] = React.useState("کانال اصلی");

  // Batch JSON state
  const [jsonInput, setJsonInput] = React.useState("");
  const [batchItems, setBatchItems] = React.useState<any[]>([]);
  const [showJsonImport, setShowJsonImport] = React.useState(false);

  const [recentPosts, setRecentPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) setRecentPosts(data.posts.slice(0, 10)); // Show more posts to see links
    } catch (e) {
      console.error("Failed to fetch posts", e);
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const items = Array.isArray(json) ? json : [json];
        setBatchItems(items);
        setJsonInput(JSON.stringify(json, null, 2));
      } catch (err) {
        alert("فرمت فایل جی‌سون نامعتبر است");
      }
    };
    reader.readAsText(file);
  };

  const parseJsonInput = () => {
    try {
      const json = JSON.parse(jsonInput);
      const items = Array.isArray(json) ? json : [json];
      setBatchItems(items);
    } catch (err) {
      alert("متن وارد شده فرمت جی‌سون معتبری ندارد");
    }
  };

  const processBatch = async () => {
    if (batchItems.length === 0) return;

    setIsBatchProcessing(true);
    setGenerating(true);

    try {
      const savedModels = localStorage.getItem('modelPrefs');
      const models = savedModels ? JSON.parse(savedModels) : null;

      // Send the entire batch for linked processing
      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch: batchItems,
          linked: true,
          models: models
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(`تعداد ${data.data.posts.length} پست مرتبط با موفقیت تولید شد`);
        fetchRecentPosts();
        setBatchItems([]);
        setJsonInput("");
        setShowJsonImport(false);
      }
    } catch (error) {
      console.error('Batch processing failed', error);
    } finally {
      setIsBatchProcessing(false);
      setGenerating(false);
    }
  };

  const generateWithAI = async () => {
    if (!title) {
      alert("لطفا ابتدا یک عنوان یا موضوع وارد کنید");
      return;
    }
    setGenerating(true);
    try {
      const savedModels = localStorage.getItem('modelPrefs');
      const models = savedModels ? JSON.parse(savedModels) : null;

      const response = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: title,
          count: 1,
          models: models
        })
      });
      const data = await response.json();
      if (data.success && data.data.posts.length > 0) {
        setContent(data.data.posts[0].content);
        // Optionally update schedule based on AI suggestion
        // setSchedule(data.data.posts[0].schedule);
      }
    } catch (error) {
      console.error('Failed to generate content', error);
    } finally {
      setGenerating(false);
    }
  };

  const toggleStream = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isStreaming ? 'stop' : 'start' })
      });
      const data = await response.json();
      if (data.success) {
        setIsStreaming(!isStreaming);
      }
    } catch (error) {
      console.error('Failed to toggle stream', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Batch Import Section */}
      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--primary-purple)]/10 text-[var(--primary-purple)]">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">ورودی دسته‌ای محتوا (JSON)</h3>
              <p className="text-sm text-[#999]">وارد کردن لیست موضوعات برای تولید محتوای مرتبط</p>
            </div>
          </div>
          <button
            onClick={() => setShowJsonImport(!showJsonImport)}
            className="text-sm text-[var(--primary-purple)] hover:underline font-medium"
          >
            {showJsonImport ? 'بستن پنل' : 'افزودن دیتا'}
          </button>
        </div>

        {showJsonImport && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-sm font-medium block">متن JSON یا بارگذاری فایل</label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='[{"topic": "هوش مصنوعی در ۲۰۲۶"}, {"topic": "روبوتیک در ایران"}]'
                  className="w-full h-[200px] rounded-xl border-2 border-white/10 bg-white/5 p-4 font-mono text-sm outline-none focus:border-[var(--primary-purple)]"
                ></textarea>
                <div className="flex gap-4">
                  <button
                    onClick={parseJsonInput}
                    className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    بررسی دیتا
                  </button>
                  <label className="flex-1 bg-[var(--primary-purple)]/20 hover:bg-[var(--primary-purple)]/30 text-[var(--primary-purple)] py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    انتخاب فایل
                    <input type="file" className="hidden" accept=".json" onChange={handleJsonUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium block">آیتم‌های شناسایی شده ({batchItems.length})</label>
                <div className="w-full h-[200px] rounded-xl border-2 border-white/10 bg-white/5 p-4 overflow-y-auto space-y-2">
                  {batchItems.length > 0 ? batchItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-sm truncate max-w-[80%]">{item.topic || item.title || `آیتم شماره ${idx + 1}`}</span>
                      <button onClick={() => setBatchItems(batchItems.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )) : (
                    <div className="h-full flex items-center justify-center text-[#999] text-sm">دیتا وارد نشده است</div>
                  )}
                </div>
                <button
                  disabled={batchItems.length === 0 || generating}
                  onClick={processBatch}
                  className="w-full bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isBatchProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                  شروع تولید محتوای مرتبط
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Queue Manager Section (Formerly Stream) */}
      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-2 border-[var(--primary-blue)]/20 overflow-hidden relative">
        {isStreaming && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-[var(--primary-blue)] animate-pulse shadow-[0_0_10px_blue]"></div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isStreaming ? 'bg-[var(--primary-blue)] animate-pulse' : 'bg-white/5'}`}>
              <Layers className={`w-8 h-8 ${isStreaming ? 'text-white' : 'text-[#999]'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                مدیریت صف انتشار محتوا
                {isStreaming && <span className="text-xs bg-[var(--primary-blue)] px-2 py-0.5 rounded text-white animate-pulse">PROCESSING</span>}
              </h3>
              <p className="text-sm text-[#999]">هماهنگ‌سازی پست‌های مرتبط برای مدل‌های محلی</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left hidden md:block">
              <div className="text-xs text-[#999]">وضعیت صف</div>
              <div className="text-sm font-bold">آماده برای پردازش زنجیره‌ای</div>
            </div>
            <button
              onClick={toggleStream}
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 ${
                isStreaming
                ? 'bg-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/80 text-white shadow-[0_0_30px_rgba(33,150,243,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {isStreaming ? 'توقف صف' : 'شروع صف'}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-[30px] rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] light-theme:bg-[var(--light-card)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[22px] font-semibold">ایجاد محتوای جدید</h3>
          <button
            type="button"
            onClick={generateWithAI}
            disabled={generating}
            className="flex items-center gap-2 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            تولید هوشمند با AI
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">عنوان محتوا یا موضوع</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان محتوا را وارد کنید"
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">نوع محتوا</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="متن محتوا را بنویسید یا از هوش مصنوعی کمک بگیرید..."
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
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">کانال هدف</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full rounded-[15px] border-2 border-white/10 bg-white/5 p-[15px] text-[15px] outline-none transition-all focus:border-[var(--primary-purple)] light-theme:border-black/10 light-theme:bg-black/2 light-theme:text-[var(--text-light)]">
                <option>کانال اصلی</option>
                <option>کانال آزمایشی</option>
                <option>گروه پشتیبانی</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-5">
            <button
              type="submit"
              className="btn-primary-gradient flex w-auto items-center gap-2.5 rounded-[15px] px-10 py-[15px] text-base font-semibold shadow-lg hover:shadow-[var(--primary-pink)]/20 transition-all"
            >
              <Send className="w-5 h-5" /> انتشار فوری
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
        <div className="mb-[25px] flex items-center justify-between">
          <h3 className="text-xl font-semibold">محتواهای اخیر</h3>
          <button onClick={fetchRecentPosts} className="text-[#999] hover:text-white transition-all">
             بروزرسانی <i className="fas fa-sync-alt mr-1"></i>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-white/5 light-theme:bg-black/2">
              <tr>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عنوان/موضوع</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">نوع</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">تاریخ ایجاد</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">منبع</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">وضعیت</th>
                <th className="p-[15px] text-right text-[13px] font-semibold text-[#999]">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {recentPosts.length > 0 ? (
                recentPosts.map((post, idx) => (
                  <tr key={idx} className="border-t border-white/5 hover:bg-white/2 transition-all">
                    <td className="p-[18px_15px] font-medium max-w-[200px] truncate">
                      <div className="flex items-center gap-2">
                        {post.topic === "Batch Processing" && <LinkIcon className="w-4 h-4 text-[var(--primary-purple)]" />}
                        {post.topic || "بدون عنوان"}
                      </div>
                    </td>
                    <td className="p-[18px_15px]">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.25 text-xs font-semibold ${
                        post.posts ? 'bg-[var(--primary-purple)]/20 text-[var(--primary-purple)]' : 'bg-[#2196f333] text-[var(--primary-blue)]'
                      }`}>
                        {post.posts ? <Layers className="w-3 h-3" /> : null}
                        {post.posts ? "زنجیره محتوا" : "پست تکی"}
                      </span>
                    </td>
                    <td className="p-[18px_15px] dir-ltr text-right">{post.date}</td>
                    <td className="p-[18px_15px] text-[#999]">{post.source === 'runs' ? 'دستی' : 'خودکار'}</td>
                    <td className="p-[18px_15px]">
                      <span className="inline-block rounded-lg bg-[#00c85333] px-3 py-1.25 text-xs font-semibold text-[#00c853]">آماده انتشار</span>
                    </td>
                    <td className="p-[18px_15px]">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (post.posts && post.posts.length > 0) {
                              setTitle(post.topic);
                              setContent(post.posts[0].content);
                            }
                          }}
                          className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-[#2196f333] text-[var(--primary-blue)] transition-all hover:scale-110"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-[30px] text-center text-[#999]">محتوایی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
