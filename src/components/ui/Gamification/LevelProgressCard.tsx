"use client";

import React from "react";
import { message, Tooltip } from "antd";
import { Sparkles, Flame, CheckCircle2, Zap, Shield, Trophy } from "lucide-react";
import {
  useGetMyGamificationStatsQuery,
  useDailyCheckinMutation,
} from "@/store/queries/gamification";

export default function LevelProgressCard() {
  const { data, isLoading, refetch } = useGetMyGamificationStatsQuery();
  const [checkin, { isLoading: isCheckingIn }] = useDailyCheckinMutation();

  const stats = data?.data || {
    exp: 150,
    level: 2,
    title: "Junior Explorer",
    streakDays: 1,
    currentLevelExp: 50,
    expNeededForNextLevel: 300,
    progressPercent: 50,
    isCheckedInToday: false,
    unlockedCount: 2,
    totalBadgesCount: 5,
  };

  const handleDailyCheckin = async () => {
    try {
      const res = await checkin().unwrap();
      message.success(res.message || "Điểm danh thành công! Nhận ngay EXP");
      refetch();
    } catch (err: any) {
      message.info(err?.data?.message || "Hôm nay bạn đã điểm danh rồi!");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50/90 to-blue-50/40 p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Subtle Ambient Decorative Glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-52 w-52 rounded-full bg-gradient-to-tr from-amber-300/10 to-orange-400/10 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Level Icon, Title & EXP Stats */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Glowing Level Badge */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0066CC] via-[#0080FF] to-cyan-500 p-0.5 shadow-lg shadow-blue-500/25">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[14px] bg-white text-slate-900">
              <span className="text-[10px] font-black tracking-widest text-[#0066CC] uppercase">
                LV
              </span>
              <span className="text-2xl font-black leading-none text-slate-900">
                {stats.level}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
                {stats.title}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 text-xs font-black text-[#0066CC]">
                <Shield className="w-3 h-3 text-[#0066CC]" /> Cấp {stats.level}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>{stats.exp}</span> <span className="text-slate-400">EXP</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">
                Huy hiệu: <strong className="text-slate-800">{stats.unlockedCount}/{stats.totalBadgesCount}</strong> đã đạt
              </span>
            </div>
          </div>
        </div>

        {/* Right: Daily Streak & Daily Check-in CTA Button */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          {/* Streak Flame Pill */}
          <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
              <Flame className="w-4 h-4 fill-white animate-pulse" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Chuỗi học tập
              </span>
              <span className="text-sm font-black text-amber-900 leading-tight">
                {stats.streakDays} ngày
              </span>
            </div>
          </div>

          {/* Daily Check-in Action Button */}
          <button
            type="button"
            onClick={handleDailyCheckin}
            disabled={stats.isCheckedInToday || isCheckingIn}
            className={`group relative inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-black transition-all ${
              stats.isCheckedInToday
                ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-default"
                : "bg-gradient-to-r from-[#0066CC] to-[#0080FF] text-white shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {stats.isCheckedInToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Đã Điểm Danh</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>Điểm Danh +EXP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern EXP Progress Bar */}
      <div className="mt-6 pt-5 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Trophy className="w-3.5 h-3.5 text-[#0066CC]" />
            Tiến trình thăng cấp Level {stats.level + 1}
          </span>
          <span className="font-mono text-[#0066CC] bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
            {stats.currentLevelExp} / {stats.expNeededForNextLevel} EXP ({stats.progressPercent}%)
          </span>
        </div>

        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0066CC] via-[#0080FF] to-cyan-400 shadow-sm transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, stats.progressPercent))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
