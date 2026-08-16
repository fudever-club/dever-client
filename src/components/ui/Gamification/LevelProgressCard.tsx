"use client";

import React from "react";
import { message, Tooltip } from "antd";
import { Sparkles, Flame, CheckCircle2, Trophy, Zap, Shield, Crown } from "lucide-react";
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
    <div
      style={{
        background: "linear-gradient(135deg, #004C99 0%, #0066CC 55%, #0080FF 100%)",
        borderRadius: "24px",
        padding: "24px 28px",
        color: "#FFFFFF",
        boxShadow: "0 12px 32px -4px rgba(0, 102, 204, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle Ambient Decorative Circles */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255,255,255,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "20%",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 229, 255, 0.2) 0%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "20px", position: "relative", zIndex: 1 }}>
        {/* Left: Level & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              color: "#1E293B",
              boxShadow: "0 6px 16px rgba(255, 165, 0, 0.4)",
              border: "2px solid #FFFFFF",
            }}
          >
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 800 }}>LV</span>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{stats.level}</span>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0, color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                {stats.title}
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(4px)",
                }}
              >
                Cấp {stats.level}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.85)", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
              <Zap size={14} color="#FFD700" fill="#FFD700" />
              Tổng điểm danh vọng: <strong style={{ color: "#FFFFFF" }}>{stats.exp} EXP</strong>
            </p>
          </div>
        </div>

        {/* Right: Daily Check-in & Streak Flame */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "8px 14px",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Flame size={18} color="#FF7A00" fill="#FF7A00" />
            <div>
              <span style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.8)", display: "block", lineHeight: 1 }}>Chuỗi học tập</span>
              <strong style={{ fontSize: "14px", color: "#FFFFFF", lineHeight: 1.2 }}>{stats.streakDays} ngày</strong>
            </div>
          </div>

          <button
            onClick={handleDailyCheckin}
            disabled={stats.isCheckedInToday || isCheckingIn}
            style={{
              background: stats.isCheckedInToday
                ? "rgba(255, 255, 255, 0.25)"
                : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#FFFFFF",
              border: stats.isCheckedInToday ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
              padding: "10px 18px",
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: stats.isCheckedInToday ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: stats.isCheckedInToday ? "none" : "0 4px 14px rgba(245, 158, 11, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            {stats.isCheckedInToday ? (
              <>
                <CheckCircle2 size={16} color="#FFFFFF" /> Đã điểm danh hôm nay
              </>
            ) : (
              <>
                <Sparkles size={16} color="#FFFFFF" /> Điểm danh nhận EXP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar towards Next Level */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)", marginBottom: "6px", fontWeight: 600 }}>
          <span>Tiến trình thăng cấp Level {stats.level + 1}</span>
          <span>
            {stats.currentLevelExp} / {stats.expNeededForNextLevel} EXP ({stats.progressPercent}%)
          </span>
        </div>

        <div
          style={{
            height: "10px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "9999px",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, stats.progressPercent))}%`,
              height: "100%",
              background: "linear-gradient(90deg, #FFD700 0%, #00E5FF 100%)",
              borderRadius: "9999px",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 0 10px rgba(0, 229, 255, 0.6)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
