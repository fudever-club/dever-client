"use client";

import React, { ReactNode } from "react";

import themeColors from "@/style/themes/default/colors";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  /** "brand" (default): solid primary + white text. "light": white card, slate text. */
  tone?: "brand" | "light";
}

/**
 * PageHero — banner đầu trang dùng chung cho Discover / Hall of Fame / CreateBlog.
 * tone="brand": nền đặc token primary (không gradient, không blur), icon trắng.
 * tone="light": thẻ trắng chữ slate cho trang đã nhiều màu (Discover).
 */
export default function PageHero({ title, subtitle, icon, eyebrow, action, tone = "brand" }: PageHeroProps) {
  const light = tone === "light";
  return (
    <div
      style={{
        backgroundColor: light ? "#FFFFFF" : themeColors.primary,
        borderRadius: "24px",
        padding: "32px",
        color: light ? "#0F172A" : "#FFFFFF",
        border: light ? "1px solid #E2E8F0" : "none",
        boxShadow: light ? "0 4px 16px -2px rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: action ? "space-between" : "flex-start",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "700px" }}>
          {eyebrow && (
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "9999px",
                  backgroundColor: light ? "#EFF6FF" : "rgba(255, 255, 255, 0.16)",
                  padding: "4px 14px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  border: light ? "1px solid #BFDBFE" : "1px solid rgba(255, 255, 255, 0.35)",
                  color: light ? themeColors.primaryDark : "#FFFFFF",
                }}
              >
                {icon && (
                  <span style={{ color: light ? themeColors.primary : "#FFFFFF", display: "inline-flex", alignItems: "center" }}>
                    {icon}
                  </span>
                )}
                {eyebrow}
              </span>
            </div>
          )}

          <h1
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: light ? "#0F172A" : "#FFFFFF",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p style={{ fontSize: "14px", color: light ? "#475569" : "rgba(255, 255, 255, 0.92)", margin: 0, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </div>

        {action && <div style={{ display: "flex", alignItems: "center" }}>{action}</div>}
      </div>
    </div>
  );
}
