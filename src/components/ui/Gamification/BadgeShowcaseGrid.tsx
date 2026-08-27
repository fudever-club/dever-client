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
  Sparkles,
} from "lucide-react";
import { useGetMyGamificationStatsQuery } from "@/store/queries/gamification";

function getBadgeIcon(id: string, color: string) {
  switch (id) {
    case "algorithmic_prodigy":
      return <Trophy className="w-6 h-6" style={{ color }} />;
    case "pro_tech_author":
      return <PenTool className="w-6 h-6" style={{ color }} />;
    case "speed_coder":
      return <Zap className="w-6 h-6" style={{ color }} />;
    case "core_contributor":
      return <Code2 className="w-6 h-6" style={{ color }} />;
    case "security_sentinel":
    default:
      return <ShieldCheck className="w-6 h-6" style={{ color }} />;
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
  const unlockedCount = badges.filter((b: any) => b.isUnlocked).length;

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#0066CC] border border-blue-100">
              <Award className="w-4 h-4 text-[#0066CC]" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 m-0">
              Bộ Sưu Tập Huy Hiệu Kỹ Thuật (3D Badges)
            </h3>
          </div>
          <p className="text-xs text-slate-500 m-0">
            Mở khóa các danh hiệu cao quý qua hoạt động giải LeetCode, viết Blog và đóng góp Open Source.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-xs font-black text-[#0066CC]">
          <Sparkles className="w-3.5 h-3.5 text-[#0066CC]" />
          <span>Đã đạt: {unlockedCount} / {badges.length}</span>
        </div>
      </div>

      {/* Grid of 5 Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {badges.map((badge: any) => (
          <Tooltip
            key={badge.id}
            title={
              <div className="p-1">
                <div className="font-bold text-sm text-white mb-1">{badge.title}</div>
                <div className="text-xs text-slate-300 mb-2 leading-relaxed">{badge.description}</div>
                <div className="text-[11px] text-sky-300 border-t border-slate-700/80 pt-1.5 font-medium">
                  Điều kiện: {badge.requirement}
                </div>
              </div>
            }
          >
            <div
              className={`group relative flex flex-col items-center justify-between p-5 rounded-2xl transition-all duration-300 cursor-pointer ${
                badge.isUnlocked
                  ? "bg-white border-2 hover:shadow-lg hover:-translate-y-1"
                  : "bg-slate-50/80 border border-slate-200 hover:border-slate-300"
              }`}
              style={{
                borderColor: badge.isUnlocked ? `${badge.color}60` : undefined,
                boxShadow: badge.isUnlocked ? `0 6px 20px -3px ${badge.color}25` : undefined,
              }}
            >
              {/* Top Icon Badge Frame */}
              <div className="w-full flex items-center justify-center mb-3">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 shadow-xs"
                  style={{
                    backgroundColor: badge.isUnlocked ? badge.bgColor : "#E2E8F0",
                    border: badge.isUnlocked ? `1.5px solid ${badge.color}60` : "1px solid #CBD5E1",
                  }}
                >
                  {getBadgeIcon(badge.id, badge.isUnlocked ? badge.color : "#64748B")}
                </div>
              </div>

              {/* Title & Info */}
              <div className="text-center mb-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-1 line-clamp-1">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 m-0 min-h-[30px] leading-snug">
                  {badge.requirement}
                </p>
              </div>

              {/* Status Pill */}
              <span
                className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase ${
                  badge.isUnlocked
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                    : "bg-slate-200/90 text-slate-600 border border-slate-300"
                }`}
              >
                {badge.isUnlocked ? (
                  <>
                    <Check className="w-3 h-3" /> ĐÃ ĐẠT
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> CHƯA MỞ
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
