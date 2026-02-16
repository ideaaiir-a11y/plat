"use client";

import React from "react";

import { Video, Radio, Power, Settings as SettingsIcon, Loader2, Sparkles, Send, Eye, Clock as ClockIcon } from "lucide-react";

export default function ContentContent() {
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);

  // Form state
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("پست متنی");
  const [content, setContent] = React.useState("");
  const [schedule, setSchedule] = React.useState("");
  const [channel, setChannel] = React.useState("کانال اصلی");

  const [recentPosts, setRecentPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) setRecentPosts(data.posts.slice(0, 5));
    } catch (e) {
      console.error("Failed to fetch posts", e);
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
      {/* Live Stream Section */}
      <div className="rounded-[20px] bg-[var(--dark-card)] p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-2 border-[#ff1744]/20 overflow-hidden relative">
        {isStreaming && (
          <div className="absolute top-0 right-0 left-0 h-1 bg-red-600 animate-pulse shadow-[0_0_10px_red]"></div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${isStreaming ? 'bg-red-600 animate-pulse' : 'bg-white/5'}`}>
              <Radio className={`w-8 h-8 ${isStreaming ? 'text-white' : 'text-[#999]'}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                استریم زنده RTMP
                {isStreaming && <span className="text-xs bg-red-600 px-2 py-0.5 rounded text-white animate-pulse">LIVE</span>}
              </h3>
              <p className="text-sm text-[#999]">ارسال مستقیم محتوا به سرور روبیکا</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left hidden md:block">
              <div className="text-xs text-[#999]">کیفیت فعلی</div>
              <div className="text-sm font-bold">720x1280 @ 1200kbps</div>
            </div>
            <button
              onClick={toggleStream}
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 ${
                isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]'
                : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
              {isStreaming ? 'توقف استریم' : 'شروع استریم'}
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
                    <td className="p-[18px_15px] font-medium max-w-[200px] truncate">{post.topic || "بدون عنوان"}</td>
                    <td className="p-[18px_15px]">
                      <span className="inline-block rounded-lg bg-[#2196f333] px-3 py-1.25 text-xs font-semibold text-[var(--primary-blue)]">
                        {post.posts ? "مجموعه" : "تکی"}
                      </span>
                    </td>
                    <td className="p-[18px_15px] dir-ltr text-right">{post.date}</td>
                    <td className="p-[18px_15px] text-[#999]">{post.source === 'runs' ? 'دستی' : 'خودکار'}</td>
                    <td className="p-[18px_15px]">
                      <span className="inline-block rounded-lg bg-[#00c85333] px-3 py-1.25 text-xs font-semibold text-[#00c853]">ذخیره شده</span>
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
