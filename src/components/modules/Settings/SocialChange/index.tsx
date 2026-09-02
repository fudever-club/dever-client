import React, { useEffect, useState } from "react";

import * as S from "./styles";
import { Social, UserEnum, UserInfo } from "@/helpers/types/userTypes";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  List,
  message,
  Select,
  Skeleton,
  Space,
} from "antd";
import { useParams } from "next/navigation";
import { PlusOutlined, DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import {
  useGetSocialEnumsQuery,
  useUpdateUserProfileMutation,
} from "@/store/queries/settings";
import { useTranslation } from "@/app/i18n/client";
import Typography from "@/components/core/common/Typography";
import { SocialBrandIcon } from "@/helpers/socialMediaIcons";

interface IProps {
  isUserProfileLoading: boolean;
  userData: UserInfo;
  refetchUserData: () => void;
}

interface IUpdateValues {
  socialId: string;
  url: string;
}

interface ISocial {
  url: string;
  socialId: {
    _id: string;
  };
}

function SocialChange({
  isUserProfileLoading,
  userData,
  refetchUserData,
}: IProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [socialData, setSocialData] = useState<Social[]>([]);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");

  useEffect(() => {
    setSocialData(userData?.socials || []);
  }, [userData]);

  const { result, isFetching } = useGetSocialEnumsQuery(undefined, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        result: data?.data ?? [],
        isFetching,
      };
    },
  });

  const handleSubmitChange: FormProps<IUpdateValues>["onFinish"] = async (
    values
  ) => {
    const dataArray: ISocial[] = [];
    const forUpdateValue = {
      url: values.url,
      socialId: {
        _id: values.socialId,
      },
    };
    
    (socialData || []).forEach((item) => {
      if (item?.socialId?._id) {
        dataArray.push({
          url: item.url,
          socialId: {
            _id: item.socialId._id,
          },
        });
      }
    });

    if (values.url !== "" && values.socialId !== "") {
      dataArray.push(forUpdateValue);
    }

    try {
      const res = await updateUserProfile({ socials: dataArray }).unwrap();
      setSocialData(res?.data?.socials ?? []);
      setIsEdit(false);
      refetchUserData();
      message.success(t("updateSuccess"));
    } catch (error) {
      message.error(t("updateError"));
    }
  };

  const handleDisconnect = async (fromId: string) => {
    const newFilteredList = (socialData || []).filter((item) => item._id !== fromId);
    const dataToUpdate: ISocial[] = newFilteredList.map((item) => {
      return {
        url: item.url,
        socialId: { _id: item.socialId._id },
      };
    });
    try {
      message.info(t("disconnecting"));
      const res = await updateUserProfile({ socials: dataToUpdate }).unwrap();
      setSocialData(res?.data?.socials ?? newFilteredList);
      refetchUserData();
      message.success(t("disconnected"));
    } catch (error) {
      message.error(t("updateError"));
    }
  };

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        {isUserProfileLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <S.ContentWrapper>
            <Flex align="center" justify="space-between" wrap="wrap" gap={12}>
              <Typography.Title level={3} style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                {t("socials")}
              </Typography.Title>
              <Button
                type={isEdit ? "primary" : "default"}
                icon={<PlusOutlined />}
                onClick={() => setIsEdit(!isEdit)}
                style={{
                  borderRadius: 8,
                  height: 36,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {isEdit ? "Đóng form" : "Thêm liên kết"}
              </Button>
            </Flex>

            <S.SocialListContainer>
              {socialData && socialData.length > 0 ? (
                socialData.map((item, index) => (
                  <div
                    key={item._id || index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      padding: "12px 18px",
                      borderRadius: 12,
                      background: "rgba(248, 250, 252, 0.8)",
                      border: "1px solid #E2E8F0",
                      width: "100%",
                      transition: "all 0.2s ease",
                    }}
                    className="hover:border-blue-300 hover:shadow-sm"
                  >
                    <Flex align="center" gap={14} style={{ minWidth: 0, flex: 1 }}>
                      <SocialBrandIcon
                        platform={item.socialId?.constant || item.socialId?.name}
                        size={42}
                      />
                      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                        <Typography.Text strong style={{ fontSize: 15, color: "#0F172A", lineHeight: 1.2 }}>
                          {item.socialId?.name || "Mạng xã hội"}
                        </Typography.Text>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0066CC",
                            fontSize: 13,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "100%",
                          }}
                        >
                          <LinkOutlined style={{ flexShrink: 0, fontSize: 12 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.url}
                          </span>
                        </a>
                      </div>
                    </Flex>

                    <Button
                      type="default"
                      danger
                      icon={<DisconnectOutlined />}
                      onClick={() => handleDisconnect(item._id)}
                      style={{
                        borderRadius: 8,
                        height: 36,
                        fontWeight: 500,
                        flexShrink: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {t("disconnect")}
                    </Button>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    padding: "24px 16px",
                    textAlign: "center",
                    borderRadius: 12,
                    background: "#F8FAFC",
                    border: "1px dashed #E2E8F0",
                    color: "#94A3B8",
                    fontSize: 14,
                  }}
                >
                  Chưa có liên kết mạng xã hội nào được thêm
                </div>
              )}

              {isEdit && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 20,
                    borderRadius: 12,
                    background: "#F1F5F9",
                    border: "1px dashed #CBD5E1",
                  }}
                >
                  <Form
                    name="social-form"
                    onFinish={handleSubmitChange}
                    layout="vertical"
                  >
                    <Form.Item
                      label={t("platform")}
                      name={"socialId"}
                      wrapperCol={{ span: 24 }}
                      rules={[{ required: true, message: t("cantBeEmpty") }]}
                    >
                      <S.SelectCustom
                        size="large"
                        placeholder={t("selectPlatfrorm")}
                        style={{ borderRadius: 8, width: "100%" }}
                      >
                        {result.map((item: UserEnum, index: number) => (
                          <Select.Option value={item._id} key={index}>
                            <Space align="center">
                              <SocialBrandIcon
                                platform={item.constant || item.name}
                                size={22}
                              />
                              <span style={{ fontWeight: 600 }}>{item.name}</span>
                            </Space>
                          </Select.Option>
                        ))}
                      </S.SelectCustom>
                    </Form.Item>
                    <Form.Item
                      label={t("accountLink")}
                      name={"url"}
                      wrapperCol={{ span: 24 }}
                      rules={[
                        { required: true, message: t("cantBeEmpty") },
                        { type: "url", message: "Vui lòng nhập đường dẫn hợp lệ (vd: https://...)" }
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="https://facebook.com/username hoặc https://linkedin.com/in/..."
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          borderRadius: 8,
                          backgroundColor: "#0066CC",
                          fontWeight: 600,
                          minWidth: 140,
                        }}
                        htmlType="submit"
                        loading={isLoading}
                      >
                        {t("update")}
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </S.SocialListContainer>
          </S.ContentWrapper>
        )}
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default SocialChange;
