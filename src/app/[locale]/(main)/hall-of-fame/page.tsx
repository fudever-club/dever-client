"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Avatar,
  Skeleton,
  Button,
} from "antd";
import {
  TrophyOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Trophy as TrophyLucide } from "lucide-react";
import { useGetHallOfFameQuery } from "@/store/queries/gamification";
import SubmitProjectModal from "@/components/ui/SubmitProjectModal";
import PageHero from "@/components/ui/PageHero";
import themeColors from "@/style/themes/default/colors";
import { useAppSelector } from "@/hooks/redux-toolkit";

const { Title, Text, Paragraph } = Typography;

export default function HallOfFameClientPage() {
  const { data: hallData, isLoading, isError, refetch } = useGetHallOfFameQuery();
  const [submitProjectOpen, setSubmitProjectOpen] = useState(false);
  const { userInfo } = useAppSelector((state) => state.auth);

  const leaders = hallData?.data || [];
  const podium = hallData?.podium || {
    first: leaders[0] || null,
    second: leaders[1] || null,
    third: leaders[2] || null,
  };
  const badges = hallData?.badges || [];

  const columns = [
    {
      title: "Hạng",
      key: "rank",
      width: 70,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (
        <span
          style={{
            display: "inline-flex",
            width: "30px",
            height: "30px",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            fontWeight: 800,
            fontSize: "12px",
            background:
              index === 0
                ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                : index === 1
                ? "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)"
                : index === 2
                ? "linear-gradient(135deg, #D97706 0%, #B45309 100%)"
                : "#F1F5F9",
            color: index < 3 ? "#FFFFFF" : themeColors.muted,
            boxShadow: index === 0 ? "0 4px 10px rgba(245, 158, 11, 0.3)" : "none",
          }}
        >
          {index + 1}
        </span>
      ),
    },
    {
      title: "Thành viên",
      key: "member",
      render: (record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={42}
            src={record.avatar || "/images/avatar/avatar.jpg"}
            style={{ border: "2px solid #E0F2FE", flexShrink: 0 }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>
                {record.name}
              </span>
              {record._id === userInfo.id && (
                <Tag color="blue" style={{ borderRadius: "6px", fontSize: "12px", fontWeight: 700, margin: 0 }}>
                  Bạn
                </Tag>
              )}
            </div>
            <span style={{ fontSize: "12px", color: themeColors.muted, display: "block", marginTop: "2px" }}>
              {record.position} • {record.department}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Danh xưng",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: "#EFF6FF",
            color: themeColors.primary,
            border: "1px solid #BFDBFE",
          }}
        >
          {title}
        </span>
      ),
    },
    {
      title: "Level & EXP",
      key: "exp",
      render: (record: any) => (
        <div>
          <span style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>
            Level {record.level}
          </span>
          <p style={{ fontSize: "12px", color: themeColors.primary, fontWeight: 700, margin: 0 }}>
            {record.exp} EXP
          </p>
        </div>
      ),
    },
    {
      title: "Chuỗi điểm danh",
      dataIndex: "streakDays",
      key: "streakDays",
      render: (streak: number) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#EA580C",
            backgroundColor: "#FFF7ED",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid #FFEDD5",
          }}
        >
          <FireOutlined style={{ color: "#F97316" }} /> {streak || 1} ngày
        </span>
      ),
    },
    {
      title: "Huy hiệu",
      dataIndex: "badgeCount",
      key: "badgeCount",
      render: (count: number) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#7E22CE",
            backgroundColor: "#FAF5FF",
            padding: "4px 12px",
            borderRadius: "9999px",
            border: "1px solid #F3E8FF",
          }}
        >
          <SafetyCertificateOutlined style={{ color: "#9333EA" }} /> {count || 0} huy hiệu
        </span>
      ),
    },
  ];

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "48px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Banner */}
      <PageHero
        icon={<CrownOutlined />}
        eyebrow="ĐẤU TRƯỜNG & DANH VỌNG DEVER"
        title="Bảng vàng danh dự (Hall of Fame)"
        subtitle="Top 3 theo tổng EXP, bảng xếp hạng Level/EXP/chuỗi điểm danh/số huy hiệu và danh sách huy hiệu kèm điều kiện nhận. Nút “Đóng góp Dự án” gửi project cộng 150 EXP chờ Ban chuyên môn duyệt."
        action={
          <button
            onClick={() => setSubmitProjectOpen(true)}
            style={{
              background: "#FFFFFF",
              color: themeColors.primaryDark,
              border: "1px solid #BFDBFE",
              padding: "12px 24px",
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 8px rgba(0, 76, 153, 0.08)",
              transition: "transform 0.2s ease",
              minHeight: 44,
            }}
          >
            <PlusOutlined /> Đóng góp Dự án (+150 EXP)
          </button>
        }
      />

      {/* Top 3 Podium Cards — mobile order 1-2-3, desktop order 2-1-3 (same as Leetcode/Main $orderMobile/$orderDesktop) */}
      {podium.first && (
        <Row gutter={[20, 20]} align="bottom">
          {/* Rank 2 (Á Quân) — mobile 2nd, desktop 1st (left) */}
          {podium.second && (
            <Col xs={24} md={8} className="order-2 md:order-1">
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 16px -2px rgba(0,0,0,0.05)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ position: "relative", width: "72px", height: "72px" }}>
                  <Avatar size={72} src={podium.second.avatar || "/images/avatar/avatar.jpg"} style={{ border: "3px solid #CBD5E1" }} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #94A3B8 0%, #64748B 100%)",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    2
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "0 0 4px 0" }}>
                    {podium.second.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: themeColors.primary,
                      backgroundColor: "#EFF6FF",
                      padding: "2px 10px",
                      borderRadius: "9999px",
                      display: "inline-block",
                    }}
                  >
                    {podium.second.title}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", backgroundColor: "#F1F5F9", padding: "4px 12px", borderRadius: "10px" }}>
                    Level {podium.second.level}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: themeColors.primary, backgroundColor: "#EFF6FF", padding: "4px 12px", borderRadius: "10px", border: "1px solid #BFDBFE", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ThunderboltOutlined /> {podium.second.exp} EXP
                  </span>
                </div>
              </div>
            </Col>
          )}

          {/* Rank 1 (Quán Quân) — mobile 1st (top), desktop 2nd (center) */}
          <Col xs={24} md={8} className="order-1 md:order-2">
            <div
              style={{
                background: "linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)",
                borderRadius: "24px",
                padding: "28px 24px",
                border: "2px solid #FDE68A",
                boxShadow: "0 12px 28px -4px rgba(245, 158, 11, 0.2)",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: "#FEF3C7",
                  color: "#B45309",
                  padding: "4px 14px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 800,
                  border: "1px solid #FDE68A",
                }}
              >
                <CrownOutlined style={{ color: "#D97706" }} /> QUÁN QUÂN
              </div>

              <div style={{ position: "relative", width: "88px", height: "88px" }}>
                <Avatar size={88} src={podium.first.avatar || "/images/avatar/avatar.jpg"} style={{ border: "4px solid #F59E0B", boxShadow: "0 6px 16px rgba(245, 158, 11, 0.3)" }} />
                <span
                  style={{
                    position: "absolute",
                    bottom: "-4px",
                    right: "-4px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #FFFFFF",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  1
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1E293B", margin: "0 0 4px 0" }}>
                  {podium.first.name}
                </h3>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#B45309",
                    backgroundColor: "#FEF3C7",
                    padding: "3px 12px",
                    borderRadius: "9999px",
                    display: "inline-block",
                  }}
                >
                  {podium.first.title}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", paddingTop: "12px", borderTop: "1px solid #FDE68A" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#92400E", backgroundColor: "#FEF3C7", padding: "4px 12px", borderRadius: "10px" }}>
                  Level {podium.first.level}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#B45309", backgroundColor: "#FFFBEB", padding: "4px 12px", borderRadius: "10px", border: "1px solid #FDE68A", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <ThunderboltOutlined /> {podium.first.exp} EXP
                </span>
              </div>
            </div>
          </Col>

          {/* Rank 3 (Quý Quân) — mobile 3rd, desktop 3rd (right) */}
          {podium.third && (
            <Col xs={24} md={8} className="order-3 md:order-3">
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "24px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 16px -2px rgba(0,0,0,0.05)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ position: "relative", width: "72px", height: "72px" }}>
                  <Avatar size={72} src={podium.third.avatar || "/images/avatar/avatar.jpg"} style={{ border: "3px solid #FED7AA" }} />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      right: "-4px",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #FFFFFF",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    }}
                  >
                    3
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "0 0 4px 0" }}>
                    {podium.third.name}
                  </h3>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: themeColors.primary,
                      backgroundColor: "#EFF6FF",
                      padding: "2px 10px",
                      borderRadius: "9999px",
                      display: "inline-block",
                    }}
                  >
                    {podium.third.title}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", paddingTop: "12px", borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", backgroundColor: "#F1F5F9", padding: "4px 12px", borderRadius: "10px" }}>
                    Level {podium.third.level}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: themeColors.primary, backgroundColor: "#EFF6FF", padding: "4px 12px", borderRadius: "10px", border: "1px solid #BFDBFE", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ThunderboltOutlined /> {podium.third.exp} EXP
                  </span>
                </div>
              </div>
            </Col>
          )}
        </Row>
      )}

      {/* Leaderboard Table Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "24px 28px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TrophyOutlined style={{ fontSize: "20px", color: themeColors.primary }} />
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1E293B", margin: 0 }}>
            Bảng Xếp Hạng Điểm Danh Vọng
          </h3>
        </div>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : isError ? (
          <div style={{ padding: "32px 0", textAlign: "center" }}>
            <Text type="secondary">Không thể tải dữ liệu bảng vàng</Text>
            <div style={{ marginTop: "12px" }}>
              <Button size="middle" onClick={() => refetch()} style={{ minHeight: 44 }}>
                Thử lại
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={leaders}
            rowKey={(rec) => rec._id || Math.random().toString()}
            pagination={false}
            scroll={{ x: 640 }}
          />
        )}
      </div>

      {/* Achievement Badges Showcase */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "24px 28px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <SafetyCertificateOutlined style={{ fontSize: "20px", color: themeColors.primary }} />
          <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#1E293B", margin: 0 }}>
            Hệ Thống Huy Hiệu Kỹ Thuật (3D Badges)
          </h3>
        </div>

        <Row gutter={[16, 16]}>
          {badges.map((b: any) => (
            <Col xs={24} sm={12} lg={8} key={b.id}>
              <div
                style={{
                  backgroundColor: b.bgColor || "#F8FCFF",
                  borderRadius: "18px",
                  padding: "16px",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    flexShrink: 0,
                    borderRadius: "16px",
                    backgroundColor: "#EFF6FF",
                    border: "1px solid #BFDBFE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <TrophyLucide size={22} color={themeColors.primary} aria-hidden="true" />
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#1E293B", margin: "0 0 4px 0" }}>
                    {b.title}
                  </h4>
                  <p style={{ fontSize: "12px", color: themeColors.muted, margin: 0, lineHeight: 1.5 }}>
                    {b.description}
                  </p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Submit Project Modal */}
      <SubmitProjectModal
        open={submitProjectOpen}
        onClose={() => setSubmitProjectOpen(false)}
      />
    </main>
  );
}
