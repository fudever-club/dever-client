"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, Flex, Form, Input, message, Skeleton, Space, Tag, Typography } from "antd";
import { useParams } from "next/navigation";
import {
  CodeOutlined,
  CheckCircleFilled,
  ExportOutlined,
  EditOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { UserInfo } from "@/helpers/types/userTypes";
import { useTranslation } from "@/app/i18n/client";
import { useSubscribeLeaderboardMutation } from "@/store/queries/leetcode";
import { SocialBrandIcon } from "@/helpers/socialMediaIcons";
import * as S from "./styles";

interface IProps {
  isUserProfileLoading: boolean;
  userData: UserInfo;
  refetchUserData?: () => void;
}

interface IUpdateData {
  leetcodeUsername: string;
}

function LeetcodeSubcriber({ isUserProfileLoading, userData, refetchUserData }: IProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const [subscribeLeaderboard, { isLoading }] = useSubscribeLeaderboardMutation();

  const currentUsername = userData?.leetcodeUsername || "";
  const totalSubmissions = userData?.acSubmissionList?.length || 0;

  useEffect(() => {
    if (currentUsername) {
      form.setFieldsValue({ leetcodeUsername: currentUsername });
    }
  }, [currentUsername, form]);

  const onFinish = async (values: IUpdateData) => {
    try {
      const cleanUsername = values.leetcodeUsername?.trim();
      if (!cleanUsername) return;

      await subscribeLeaderboard({ leetcodeUsername: cleanUsername }).unwrap();
      message.success(t("leetcodeUpdateSuccess") || "Đã liên kết tài khoản LeetCode thành công!");
      setIsEditing(false);
      refetchUserData?.();
    } catch (error: any) {
      message.error(error?.data?.message || t("leetcodeUpdateError") || "Không thể đồng bộ tài khoản LeetCode");
    }
  };

  if (isUserProfileLoading) {
    return (
      <S.ContainerWrapper>
        <S.CustomCard>
          <Skeleton active paragraph={{ rows: 3 }} />
        </S.CustomCard>
      </S.ContainerWrapper>
    );
  }

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        <S.ContentWrapper>
          <Flex align="center" justify="space-between" wrap="wrap" gap={8}>
            <Flex align="center" gap={8}>
              <SocialBrandIcon platform="LEETCODE" size={24} />
              <Typography.Title level={3} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {t("leetcode") || "Đấu Trường LeetCode"}
              </Typography.Title>
            </Flex>
            {currentUsername && (
              <Tag
                color="success"
                icon={<CheckCircleFilled />}
                style={{ borderRadius: 20, padding: "2px 10px", fontWeight: 600, fontSize: 13 }}
              >
                Đã kết nối
              </Tag>
            )}
          </Flex>

          {currentUsername && !isEditing ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                padding: 16,
                borderRadius: 12,
                background: "linear-gradient(135deg, rgba(255, 161, 22, 0.05) 0%, rgba(255, 255, 255, 0.9) 100%)",
                border: "1px solid rgba(255, 161, 22, 0.25)",
              }}
            >
              <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
                <Flex align="center" gap={12}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#FFA116",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(255, 161, 22, 0.3)",
                    }}
                  >
                    <CodeOutlined style={{ color: "#FFFFFF", fontSize: 22 }} />
                  </div>
                  <div>
                    <Typography.Text strong style={{ fontSize: 16, color: "#0F172A", display: "block" }}>
                      @{currentUsername}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                      {totalSubmissions > 0
                        ? `${totalSubmissions} bài giải đã đồng bộ trên BXH`
                        : "Đã liên kết • Sẵn sàng tính điểm xếp hạng"}
                    </Typography.Text>
                  </div>
                </Flex>

                <Space wrap>
                  <Button
                    type="default"
                    icon={<ExportOutlined />}
                    href={`https://leetcode.com/u/${currentUsername}`}
                    target="_blank"
                    style={{ borderRadius: 8, height: 36, fontWeight: 500 }}
                  >
                    Xem profile
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    style={{ borderRadius: 8, height: 36, fontWeight: 500 }}
                  >
                    Đổi tài khoản
                  </Button>
                </Space>
              </Flex>
            </div>
          ) : (
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item<IUpdateData>
                label={
                  <span style={{ fontWeight: 600, color: "#334155" }}>
                    {t("leetcodeUsername") || "LeetCode Username"}
                  </span>
                }
                name="leetcodeUsername"
                extra={
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    Nhập đúng tên đăng nhập LeetCode của bạn để hệ thống tự động đồng bộ bài giải và tính điểm bảng xếp hạng.
                  </Typography.Text>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập LeetCode username!",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<SocialBrandIcon platform="LEETCODE" size={18} />}
                  placeholder="Ví dụ: quangnhat1504 hoặc john_doe"
                  disabled={isLoading}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                {isEditing && (
                  <Button
                    style={{ borderRadius: 8, height: 38 }}
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                )}
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={isLoading}
                  icon={<SyncOutlined spin={isLoading} />}
                  style={{
                    borderRadius: 8,
                    height: 38,
                    backgroundColor: "#FFA116",
                    borderColor: "#FFA116",
                    fontWeight: 600,
                    minWidth: 130,
                  }}
                >
                  {isLoading ? "Đang đồng bộ..." : "Lưu & Đồng bộ"}
                </Button>
              </div>
            </Form>
          )}
        </S.ContentWrapper>
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default LeetcodeSubcriber;
