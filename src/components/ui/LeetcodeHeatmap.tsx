"use client";

import React, { useMemo } from "react";
import { CodeOutlined, FireOutlined } from "@ant-design/icons";

import { LeetcodeSubmission } from "@/helpers/types/leetcodeTypes";

interface LeetcodeHeatmapProps {
  submissions: LeetcodeSubmission[];
}

const DAYS_TO_SHOW = 364;

const toDateKey = (value: Date) => value.toISOString().slice(0, 10);

const toActivityLevel = (count: number) => {
  if (count >= 4) return 4;
  if (count === 3) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
};

const levelClassNames = [
  "bg-slate-100 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700",
  "bg-blue-200 border-blue-300 dark:bg-blue-900/50 dark:border-blue-800",
  "bg-blue-400 border-blue-500 dark:bg-blue-700 dark:border-blue-600",
  "bg-[#0066CC] border-blue-700 shadow-sm shadow-[#0066CC]/30",
  "bg-[#004C99] border-blue-300 shadow-md shadow-[#0066CC]/50",
];

export default function LeetcodeHeatmap({ submissions }: LeetcodeHeatmapProps) {
  const { weeks, totalAC, streakDays } = useMemo(() => {
    const activityByDay = new Map<string, number>();

    submissions.forEach((submission) => {
      const rawTimestamp = Number(submission.timestamp);
      const date = Number.isFinite(rawTimestamp) && rawTimestamp > 0
        ? new Date(rawTimestamp * 1000)
        : submission.date
          ? new Date(submission.date)
          : null;

      if (!date || Number.isNaN(date.getTime())) return;
      const key = toDateKey(date);
      activityByDay.set(key, (activityByDay.get(key) ?? 0) + 1);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - index));
      const count = activityByDay.get(toDateKey(date)) ?? 0;
      return { date, count };
    });

    let streak = 0;
    for (let offset = 0; offset < DAYS_TO_SHOW; offset += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - offset);
      if ((activityByDay.get(toDateKey(date)) ?? 0) === 0) break;
      streak += 1;
    }

    return {
      weeks: Array.from({ length: 52 }, (_, index) => days.slice(index * 7, index * 7 + 7)),
      totalAC: submissions.length,
      streakDays: streak,
    };
  }, [submissions]);

  return (
    <section className="w-full space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#0066CC]/20 bg-[#0066CC]/10 p-2.5 text-[#0066CC]" aria-hidden="true">
            <CodeOutlined className="text-lg" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Hoạt động LeetCode của CLB</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Tổng hợp bài AC thực tế trong 52 tuần gần đây.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-amber-700 dark:text-amber-300"><FireOutlined aria-hidden="true" /> {streakDays} ngày liên tiếp</span>
          <span className="rounded-lg bg-[#0066CC] px-3.5 py-1.5 font-bold text-white shadow-md shadow-[#0066CC]/20">Tổng AC: {totalAC}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[720px] items-center gap-1.5" aria-label="Biểu đồ hoạt động LeetCode 52 tuần">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5">
                {week.map(({ date, count }) => (
                  <div
                    key={toDateKey(date)}
                    title={`${date.toLocaleDateString("vi-VN")}: ${count} bài AC`}
                    className={`h-3.5 w-3.5 rounded-[3px] border transition-transform duration-200 hover:scale-125 ${levelClassNames[toActivityLevel(count)]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800/60">
          <span>52 tuần gần đây</span>
          <div className="flex items-center gap-2">
            <span>Ít hoạt động</span>
            <div className="flex items-center gap-1" aria-hidden="true">
              {levelClassNames.map((className, index) => <div key={index} className={`h-3 w-3 rounded-[2px] border ${className}`} />)}
            </div>
            <span>Nhiều hoạt động</span>
          </div>
        </div>
      </div>
    </section>
  );
}
