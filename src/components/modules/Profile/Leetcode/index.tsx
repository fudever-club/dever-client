"use client";

import React from "react";
import { Badge, Button, Empty, Flex, Skeleton, Tag, Typography } from "antd";
import {
  CodeOutlined,
  CheckCircleFilled,
  ExportOutlined,
  ThunderboltFilled,
  CalendarOutlined,
} from "@ant-design/icons";
import moment from "moment";

import { UserInfo } from "@/helpers/types/userTypes";
import { SocialBrandIcon } from "@/helpers/socialMediaIcons";
import * as S from "./styles";

interface IProps {
  userData: UserInfo;
  isUserDataFetching: boolean;
}

function LeetCode({ userData, isUserDataFetching }: IProps) {
  const leetcodeUsername = userData?.leetcodeUsername || "";
  const submissions = userData?.acSubmissionList || [];

  if (isUserDataFetching) {
    return (
      <S.ContainerWrapper>
        <S.CustomCard>
          <Skeleton active paragraph={{ rows: 4 }} />
        </S.CustomCard>
      </S.ContainerWrapper>
    );
  }

  if (!leetcodeUsername) {
    return (
      <S.ContainerWrapper>
        <S.CustomCard>
          <Flex align="center" justify="space-between" style={{ marginBottom: 14 }}>
            <Flex align="center" gap={8}>
              <SocialBrandIcon platform="LEETCODE" size={24} />
              <Typography.Title level={3} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Thành Tích LeetCode
              </Typography.Title>
            </Flex>
          </Flex>
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              borderRadius: 12,
              background: "#F8FAFC",
              border: "1px dashed #E2E8F0",
            }}
          >
            <Typography.Text type="secondary" style={{ fontSize: 14, display: "block", marginBottom: 10 }}>
              Thành viên chưa liên kết tài khoản LeetCode để hiển thị trên Bảng xếp hạng.
            </Typography.Text>
          </div>
        </S.CustomCard>
      </S.ContainerWrapper>
    );
  }

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        <Flex vertical gap={16}>
          {/* Header */}
          <Flex align="center" justify="space-between" wrap="wrap" gap={10}>
            <Flex align="center" gap={10}>
              <SocialBrandIcon platform="LEETCODE" size={28} />
              <div>
                <Typography.Title level={3} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  Thành Tích LeetCode
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Đấu trường thuật toán CLB DEVER
                </Typography.Text>
              </div>
            </Flex>

            <Flex align="center" gap={8}>
              <Tag
                color="gold"
                icon={<ThunderboltFilled />}
                style={{ borderRadius: 16, padding: "2px 10px", fontWeight: 700, fontSize: 13 }}
              >
                {submissions.length} AC
              </Tag>
              <Button
                type="default"
                size="small"
                icon={<ExportOutlined />}
                href={`https://leetcode.com/u/${leetcodeUsername}`}
                target="_blank"
                style={{ borderRadius: 8, fontWeight: 500 }}
              >
                @{leetcodeUsername}
              </Button>
            </Flex>
          </Flex>

          {/* Submissions List */}
          {submissions.length > 0 ? (
            <Flex vertical gap={10}>
              <Typography.Text strong style={{ fontSize: 13, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Bài giải gần đây ({submissions.length})
              </Typography.Text>
              {submissions.map((item, index) => {
                const problemUrl = item.titleSlug
                  ? `https://leetcode.com/problems/${item.titleSlug}/`
                  : `https://leetcode.com/u/${leetcodeUsername}`;
                const formattedDate = item.date
                  ? moment(item.date).format("DD/MM/YYYY")
                  : "";

                return (
                  <div
                    key={item.id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: "10px 14px",
                      borderRadius: 10,
                      background: "rgba(248, 250, 252, 0.8)",
                      border: "1px solid #E2E8F0",
                      transition: "all 0.2s ease",
                    }}
                    className="hover:border-amber-300 hover:bg-amber-50/30"
                  >
                    <Flex align="center" gap={10} style={{ minWidth: 0, flex: 1 }}>
                      <CheckCircleFilled style={{ color: "#10B981", fontSize: 16, flexShrink: 0 }} />
                      <a
                        href={problemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1E293B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title}
                      </a>
                    </Flex>

                    {formattedDate && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#94A3B8",
                          flexShrink: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <CalendarOutlined style={{ fontSize: 11 }} />
                        {formattedDate}
                      </span>
                    )}
                  </div>
                );
              })}
            </Flex>
          ) : (
            <div
              style={{
                padding: "20px 16px",
                textAlign: "center",
                borderRadius: 10,
                background: "#FFFBEB",
                border: "1px dashed #FDE68A",
              }}
            >
              <Typography.Text style={{ color: "#D97706", fontSize: 13, fontWeight: 500 }}>
                Đã kết nối tài khoản @{leetcodeUsername} • Đang đồng bộ dữ liệu bài giải...
              </Typography.Text>
            </div>
          )}
        </Flex>
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default LeetCode;
