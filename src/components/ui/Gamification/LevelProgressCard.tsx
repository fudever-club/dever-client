"use client";

import React from "react";
import { message, Tooltip } from "antd";
import { Sparkles, Flame, CheckCircle2, Trophy, Zap, Shield } from "lucide-react";
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
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #004C99 100%)",
        borderRadius: "24px",
        padding: "24px 28px",
        color: "#FFFFFF",
        boxShadow: "0 12px 32px -4px rgba(0, 76, 153, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Decorative Glow */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 128, 255, 0.35) 0%, rgba(0,0,0,0) 70%)",
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
              background: "linear-gradient(135deg, #0066CC 0%, #00E5FF 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              boxShadow: "0 6px 16px rgba(0, 102, 204, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em", opacity: 0.9 }}>LV</span>
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
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(0, 229, 255, 0.15)",
                  color: "#38BDF8",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                }}
              >
                Cấp {stats.level}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#94A3B8", margin: 0 }}>
              Tổng tích lũy: <strong style={{ color: "#F8FAFC" }}>{stats.exp.toLocaleString()} EXP</strong> · Mở khóa: <strong style={{ color: "#38BDF8" }}>{stats.unlockedCount}/{stats.totalBadgesCount} Huy hiệu</strong>
            </p>
          </div>
        </div>

        {/* Right: Streak & Check-in Action */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Streak Badge */}
          <Tooltip title={`Bạn đã duy trì hoạt động liên tiếp ${stats.streakDays} ngày!`}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "14px",
                background: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                color: "#FBBF24",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              <Flame size={16} color="#F59E0B" className="animate-pulse" />
              <span>{stats.streakDays} Ngày Chuỗi</span>
            </div>
          </Tooltip>

          {/* Daily Check-in Button */}
          <button
            type="button"
            onClick={handleDailyCheckin}
            disabled={stats.isCheckedInToday || isCheckingIn}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "14px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: stats.isCheckedInToday ? "default" : "pointer",
              border: "none",
              background: stats.isCheckedInToday
                ? "rgba(16, 185, 129, 0.2)"
                : "linear-gradient(135deg, #0066CC 0%, #0080FF 100%)",
              color: stats.isCheckedInToday ? "#34D399" : "#FFFFFF",
              boxShadow: stats.isCheckedInToday ? "none" : "0 4px 14px rgba(0, 102, 204, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            {stats.isCheckedInToday ? (
              <>
                <CheckCircle2 size={16} /> Đã Điểm Danh (+25 EXP)
              </>
            ) : (
              <>
                <Zap size={16} /> {isCheckingIn ? "Đang nhận..." : "Điểm Danh Hàng Ngày (+25 EXP)"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 700, marginBottom: "8px" }}>
          <span style={{ color: "#CBD5E1" }}>
            Tiến độ lên Cấp {stats.level + 1}
          </span>
          <span style={{ color: "#38BDF8" }}>
            {stats.currentLevelExp} / {stats.expNeededForNextLevel} EXP ({stats.progressPercent}%)
          </span>
        </div>

        {/* Custom Glowing Progress Bar */}
        <div
          style={{
            height: "10px",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, Math.max(0, stats.progressPercent))}%`,
              background: "linear-gradient(90deg, #0066CC 0%, #0080FF 50%, #00E5FF 100%)",
              borderRadius: "9999px",
              boxShadow: "0 0 12px rgba(0, 229, 255, 0.6)",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
