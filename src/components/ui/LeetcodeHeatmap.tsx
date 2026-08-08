"use client";

import React from "react";

const FlameIcon = () => (
  <svg className="w-5 h-5 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4m0 0h4m-4 0L9 3m4 14v4m0 0h4m-4 0l4-4M3 13h4m0 0v4m0-4L3 9m14 4h4m0 0v4m0-4l4-4" />
  </svg>
);

interface LeetcodeHeatmapProps {
  totalAC?: number;
  easyAC?: number;
  mediumAC?: number;
  hardAC?: number;
  streakDays?: number;
}

export default function LeetcodeHeatmap({
  totalAC = 142,
  easyAC = 65,
  mediumAC = 62,
  hardAC = 15,
  streakDays = 18
}: LeetcodeHeatmapProps) {
  const generateWeeks = () => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const level = Math.random() > 0.65 ? Math.floor(Math.random() * 4) + 1 : 0;
        days.push(level);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const weeks = generateWeeks();

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-blue-200 dark:bg-blue-900/40 border-blue-300 dark:border-blue-800";
      case 2:
        return "bg-blue-400 dark:bg-blue-700 border-blue-500";
      case 3:
        return "bg-[#0066CC] border-blue-600 shadow-sm shadow-[#0066CC]/30";
      case 4:
        return "bg-[#004C99] dark:bg-blue-400 border-blue-300 shadow-md shadow-[#0066CC]/50";
      default:
        return "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm space-y-6 font-sans">
      {/* Header & Stats summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0066CC]/10 text-[#0066CC] dark:text-blue-400 border border-[#0066CC]/20">
            <FlameIcon />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              LeetCode Active Streak &amp; Submissions
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                🔥 {streakDays} Ngày Streak
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ma trận thi đấu cày code giải thuật 2026 của thành viên DEVER
            </p>
          </div>
        </div>

        {/* Stats breakdown badges */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Easy: {easyAC}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Med: {mediumAC}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Hard: {hardAC}
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-[#0066CC] text-white shadow-md shadow-[#0066CC]/20 font-bold">
            Tổng AC: {totalAC}
          </span>
        </div>
      </div>

      {/* Heatmap Grid Matrix (52 Weeks x 7 Days) */}
      <div className="space-y-2">
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center gap-1.5 min-w-[720px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((level, dIdx) => (
                  <div
                    key={dIdx}
                    title={`Hoàn thành ${level > 0 ? level * 2 : 0} bài tập AC`}
                    className={`w-3.5 h-3.5 rounded-[3px] border transition-all duration-200 hover:scale-125 cursor-pointer ${getLevelColor(
                      level
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span>52 tuần thi đấu liên tục</span>
          <div className="flex items-center gap-2">
            <span>Ít bài</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((lvl) => (
                <div key={lvl} className={`w-3 h-3 rounded-[2px] border ${getLevelColor(lvl)}`} />
              ))}
            </div>
            <span>Nhiều bài AC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
