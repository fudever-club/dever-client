"use client";

import React, { useState } from "react";
import { CrownOutlined, TrophyOutlined } from "@ant-design/icons";
import { LeetcodeLeaderboardEntry } from "@/helpers/types/leetcodeTypes";

function getInitials(entry: LeetcodeLeaderboardEntry) {
  const name = [entry.user?.firstname, entry.user?.lastname].filter(Boolean).join(" ").trim();
  return name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "D";
}

interface CardProps {
  data: LeetcodeLeaderboardEntry;
  top: number;
  isTop1?: boolean;
}

function Card({ data, top, isTop1 }: CardProps) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const avatar = data.user?.avatar?.trim();
  const showAvatar = Boolean(avatar && !hasAvatarError);
  const name = [data.user?.firstname, data.user?.lastname].filter(Boolean).join(" ").trim() || "Thành viên DEVER";

  const isGold = top === 1;
  const isSilver = top === 2;
  const isBronze = top === 3;

  const avatarSize = isGold ? 72 : 60;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "360px",
        backgroundColor: isGold ? "#FFFBEB" : "#FFFFFF",
        borderRadius: "24px",
        padding: isGold ? "24px 18px 20px" : "20px 16px 18px",
        border: isGold
          ? "2px solid #FCD34D"
          : isSilver
          ? "1.5px solid #E2E8F0"
          : "1.5px solid #FED7AA",
        boxShadow: isGold
          ? "0 12px 28px -4px rgba(245, 158, 11, 0.18)"
          : "0 4px 16px -2px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "12px",
        position: "relative",
        boxSizing: "border-box",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Top Rank Badge */}
      <div style={{ minHeight: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isGold ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              backgroundColor: "#FEF3C7",
              color: "#92400E",
              padding: "3px 12px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 900,
              border: "1px solid #FDE68A",
              letterSpacing: "0.02em",
            }}
          >
            <CrownOutlined style={{ color: "#D97706" }} /> QUÁN QUÂN
          </span>
        ) : isSilver ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#F1F5F9",
              color: "#475569",
              padding: "2px 10px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 800,
              border: "1px solid #E2E8F0",
            }}
          >
            Á QUÂN
          </span>
        ) : (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "#FFEDD5",
              color: "#C2410C",
              padding: "2px 10px",
              borderRadius: "9999px",
              fontSize: "10px",
              fontWeight: 800,
              border: "1px solid #FED7AA",
            }}
          >
            QUÝ QUÂN
          </span>
        )}
      </div>

      {/* Avatar Container with Rank Number Badge */}
      <div
        style={{
          position: "relative",
          width: `${avatarSize}px`,
          height: `${avatarSize}px`,
          minWidth: `${avatarSize}px`,
          minHeight: `${avatarSize}px`,
          flexShrink: 0,
        }}
      >
        {showAvatar ? (
          <img
            src={avatar!}
            alt={name}
            onError={() => setHasAvatarError(true)}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
              border: isGold
                ? "3.5px solid #F59E0B"
                : isSilver
                ? "3px solid #CBD5E1"
                : "3px solid #FB923C",
              boxShadow: isGold ? "0 4px 14px rgba(245, 158, 11, 0.25)" : "none",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: isGold ? "#FEF3C7" : isSilver ? "#F1F5F9" : "#FFEDD5",
              color: isGold ? "#92400E" : isSilver ? "#475569" : "#C2410C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: isGold ? "22px" : "18px",
              border: isGold
                ? "3.5px solid #F59E0B"
                : isSilver
                ? "3px solid #CBD5E1"
                : "3px solid #FB923C",
            }}
          >
            {getInitials(data)}
          </div>
        )}

        <span
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: isGold ? "24px" : "22px",
            height: isGold ? "24px" : "22px",
            borderRadius: "50%",
            background: isGold
              ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
              : isSilver
              ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)"
              : "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
            color: "#FFFFFF",
            fontWeight: 900,
            fontSize: isGold ? "12px" : "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #FFFFFF",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
          }}
        >
          {top}
        </span>
      </div>

      {/* Name and Leetcode handle (clean, no overlap) */}
      <div style={{ width: "100%", minWidth: 0, padding: "0 4px", boxSizing: "border-box" }}>
        <h3
          style={{
            fontSize: isGold ? "15px" : "14px",
            fontWeight: 800,
            color: "#0F172A",
            margin: "0 0 3px 0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.4,
          }}
          title={name}
        >
          {name}
        </h3>
        <p
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#64748B",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.3,
          }}
          title={`@${data.leetcodeUsername}`}
        >
          @{data.leetcodeUsername}
        </p>
      </div>

      {/* Points & AC Stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "100%",
          paddingTop: "10px",
          borderTop: isGold ? "1px solid #FDE68A" : "1px solid #F1F5F9",
          flexWrap: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: isGold ? "#92400E" : "#0066CC",
            backgroundColor: isGold ? "#FEF3C7" : "#EFF6FF",
            padding: "3px 10px",
            borderRadius: "8px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap",
            border: isGold ? "1px solid #FDE68A" : "1px solid #BFDBFE",
          }}
        >
          <TrophyOutlined /> {data.acSubmissionList.length} Bài AC
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 800,
            color: "#475569",
            backgroundColor: "#F1F5F9",
            padding: "3px 8px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
          }}
        >
          {data.acSubmissionList.length * 10} Pts
        </span>
      </div>
    </div>
  );
}

export default Card;
