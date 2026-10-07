"use client";

import React, { ReactNode } from "react";

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
}

/**
 * PageHero — banner đầu trang dùng chung cho Discover / Hall of Fame / CreateBlog.
 * Nền đặc #0066CC (không gradient, không blur). Icon luôn trắng để đủ tương phản.
 */
export default function PageHero({ title, subtitle, icon, eyebrow, action }: PageHeroProps) {
  return (
    <div
      style={{
        backgroundColor: "#0066CC",
        borderRadius: "24px",
        padding: "32px",
        color: "#FFFFFF",
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
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                  padding: "4px 14px",
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  border: "1px solid rgba(255, 255, 255, 0.35)",
                  color: "#FFFFFF",
                }}
              >
                {icon && (
                  <span style={{ color: "#FFFFFF", display: "inline-flex", alignItems: "center" }}>
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
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>

          {subtitle && (
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.92)", margin: 0, lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
        </div>

        {action && <div style={{ display: "flex", alignItems: "center" }}>{action}</div>}
      </div>
    </div>
  );
}
