"use client";

import React from "react";
import { Tooltip } from "antd";
import {
  Lock,
  Award,
  Check,
  Trophy,
  PenTool,
  Zap,
  Code2,
  ShieldCheck,
} from "lucide-react";
import { useGetMyGamificationStatsQuery } from "@/store/queries/gamification";

function getBadgeIcon(id: string, color: string) {
  switch (id) {
    case "algorithmic_prodigy":
      return <Trophy size={24} color={color} strokeWidth={2.2} />;
    case "pro_tech_author":
      return <PenTool size={24} color={color} strokeWidth={2.2} />;
    case "speed_coder":
      return <Zap size={24} color={color} strokeWidth={2.2} />;
    case "core_contributor":
      return <Code2 size={24} color={color} strokeWidth={2.2} />;
    case "security_sentinel":
    default:
      return <ShieldCheck size={24} color={color} strokeWidth={2.2} />;
  }
}

const DEFAULT_BADGES = [
  {
    id: "algorithmic_prodigy",
    title: "Algorithmic Prodigy",
    description: "Vinh danh thành viên đạt thành tích xuất sắc trên Bảng xếp hạng LeetCode CLB.",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    requirement: "Liên kết tài khoản LeetCode & giải thuật toán",
    isUnlocked: true,
  },
  {
    id: "pro_tech_author",
    title: "Pro Tech Author",
    description: "Tác giả kỹ thuật tiêu biểu chia sẻ kiến thức chuyên môn cho cộng đồng DEVER.",
    color: "#8B5CF6",
    bgColor: "#EDE9FE",
    requirement: "Soạn thảo và xuất bản bài viết công nghệ",
    isUnlocked: true,
  },
  {
    id: "speed_coder",
    title: "Speed Coder",
    description: "Chiến binh chăm chỉ duy trì chuỗi hoạt động điểm danh liên tục 7 ngày.",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    requirement: "Duy trì chuỗi hoạt động liên tục từ 7 ngày",
    isUnlocked: false,
  },
  {
    id: "core_contributor",
    title: "Core Contributor",
    description: "Đóng góp dự án mã nguồn mở và sáng kiến kỹ thuật trong hệ sinh thái FU-DEVER.",
    color: "#0066CC",
    bgColor: "#EFF6FF",
    requirement: "Đóng góp dự án Open Source hoặc Project Lab",
    isUnlocked: true,
  },
  {
    id: "security_sentinel",
    title: "Security Sentinel",
    description: "Thành viên gương mẫu hoàn thiện 100% hồ sơ bảo mật và thông tin cá nhân.",
    color: "#10B981",
    bgColor: "#D1FAE5",
    requirement: "Hoàn thiện đầy đủ thông tin hồ sơ thành viên",
    isUnlocked: true,
  },
];

export default function BadgeShowcaseGrid() {
  const { data } = useGetMyGamificationStatsQuery();
  const badges = data?.data?.badges || DEFAULT_BADGES;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px 28px",
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <Award size={18} color="#0066CC" /> Bộ Sưu Tập Huy Hiệu Kỹ Thuật (3D Badges)
          </h3>
          <p style={{ fontSize: "12px", color: "#64748B", margin: "2px 0 0 0" }}>
            Mở khóa các danh hiệu cao quý qua hoạt động giải LeetCode, viết Blog và đóng góp Open Source.
          </p>
        </div>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#0066CC", backgroundColor: "#EFF6FF", padding: "4px 12px", borderRadius: "9999px", border: "1px solid #BFDBFE" }}>
          Đã đạt: {badges.filter((b: any) => b.isUnlocked).length} / {badges.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px" }}>
        {badges.map((badge: any) => (
          <Tooltip
            key={badge.id}
            title={
              <div style={{ padding: "4px" }}>
                <div style={{ fontWeight: 800, marginBottom: "4px" }}>{badge.title}</div>
                <div style={{ fontSize: "12px", color: "#E2E8F0", marginBottom: "4px" }}>{badge.description}</div>
                <div style={{ fontSize: "11px", color: "#93C5FD", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "4px" }}>
                  Điều kiện: {badge.requirement}
                </div>
              </div>
            }
          >
            <div
              style={{
                borderRadius: "18px",
                padding: "16px 14px",
                border: badge.isUnlocked ? `1.5px solid ${badge.color}` : "1.5px dashed #CBD5E1",
                backgroundColor: badge.isUnlocked ? "#FFFFFF" : "#F8FAFC",
                boxShadow: badge.isUnlocked ? `0 6px 18px -2px ${badge.color}25` : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
                opacity: badge.isUnlocked ? 1 : 0.65,
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
            >
              {/* Badge Icon Frame with vector lucide-react */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: badge.isUnlocked ? badge.bgColor : "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: badge.isUnlocked ? `0 4px 12px ${badge.color}35` : "none",
                  border: badge.isUnlocked ? `1px solid ${badge.color}50` : "1px solid #E2E8F0",
                }}
              >
                {getBadgeIcon(badge.id, badge.isUnlocked ? badge.color : "#94A3B8")}
              </div>

              {/* Title & Info */}
              <div>
                <h4 style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", margin: "0 0 3px 0", lineHeight: "1.3" }}>
                  {badge.title}
                </h4>
                <p style={{ fontSize: "11px", color: "#64748B", margin: 0, lineHeight: "1.4", minHeight: "30px" }}>
                  {badge.requirement}
                </p>
              </div>

              {/* Status Tag */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 800,
                  backgroundColor: badge.isUnlocked ? `${badge.color}15` : "#E2E8F0",
                  color: badge.isUnlocked ? badge.color : "#64748B",
                  border: badge.isUnlocked ? `1px solid ${badge.color}40` : "none",
                }}
              >
                {badge.isUnlocked ? (
                  <>
                    <Check size={12} strokeWidth={3} /> ĐÃ ĐẠT
                  </>
                ) : (
                  <>
                    <Lock size={12} /> CHƯA MỞ
                  </>
                )}
              </span>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
