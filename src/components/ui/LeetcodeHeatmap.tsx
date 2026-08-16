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

const levelColors = [
  { bg: "#F1F5F9", border: "#E2E8F0" }, // 0
  { bg: "#BFDBFE", border: "#93C5FD" }, // 1
  { bg: "#60A5FA", border: "#3B82F6" }, // 2
  { bg: "#0066CC", border: "#0052A3" }, // 3
  { bg: "#004C99", border: "#003366" }, // 4
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
    <section
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        border: "1px solid #E2E8F0",
        padding: "20px 18px",
        boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxSizing: "border-box",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          borderBottom: "1px solid #F1F5F9",
          paddingBottom: "14px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              borderRadius: "12px",
              backgroundColor: "rgba(0, 102, 204, 0.1)",
              border: "1px solid rgba(0, 102, 204, 0.2)",
              padding: "8px",
              color: "#0066CC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CodeOutlined style={{ fontSize: "18px" }} />
          </div>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.3 }}>
              Hoạt động LeetCode của CLB
            </h3>
            <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
              Tổng hợp bài AC thực tế trong 52 tuần gần đây.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              borderRadius: "8px",
              backgroundColor: "#FEF3C7",
              border: "1px solid #FDE68A",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 800,
              color: "#B45309",
            }}
          >
            <FireOutlined /> {streakDays} ngày liên tiếp
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "8px",
              backgroundColor: "#0066CC",
              padding: "4px 14px",
              fontSize: "12px",
              fontWeight: 900,
              color: "#FFFFFF",
              boxShadow: "0 2px 6px rgba(0, 102, 204, 0.25)",
            }}
          >
            Tổng AC: {totalAC}
          </span>
        </div>
      </div>

      {/* Heatmap Grid & Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              minWidth: "900px",
              padding: "4px 2px",
            }}
            aria-label="Biểu đồ hoạt động LeetCode 52 tuần"
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flexShrink: 0,
                }}
              >
                {week.map(({ date, count }) => {
                  const level = toActivityLevel(count);
                  const colors = levelColors[level];
                  return (
                    <div
                      key={toDateKey(date)}
                      title={`${date.toLocaleDateString("vi-VN")}: ${count} bài AC`}
                      style={{
                        width: "13px",
                        height: "13px",
                        minWidth: "13px",
                        minHeight: "13px",
                        borderRadius: "3px",
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        flexShrink: 0,
                        boxSizing: "border-box",
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            borderTop: "1px solid #F1F5F9",
            paddingTop: "8px",
            fontSize: "11px",
            color: "#94A3B8",
            fontWeight: 600,
          }}
        >
          <span>52 tuần gần đây (Vuốt ngang để xem chi tiết)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Ít</span>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {levelColors.map((colors, index) => (
                <div
                  key={index}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "2px",
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                />
              ))}
            </div>
            <span>Nhiều</span>
          </div>
        </div>
      </div>
    </section>
  );
}
