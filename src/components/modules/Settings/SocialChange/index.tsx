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
          <Skeleton />
        ) : (
          <S.ContentWrapper>
            <Flex align="center" justify="space-between" style={{ marginBottom: 16 }}>
              <Typography.Title level={3} style={{ margin: 0 }}>
                {t("socials")}
              </Typography.Title>
              <S.PlusButtonCustom
                type={isEdit ? "primary" : "default"}
                title="Thêm mạng xã hội"
                size="middle"
                onClick={() => setIsEdit(!isEdit)}
                style={{ borderRadius: 8 }}
              >
                <PlusOutlined /> {isEdit ? "Đóng form" : "Thêm liên kết"}
              </S.PlusButtonCustom>
            </Flex>

            <S.SocialListContainer>
              <List
                itemLayout="horizontal"
                dataSource={socialData}
                locale={{ emptyText: "Chưa có liên kết mạng xã hội nào được thêm" }}
                renderItem={(item, index) => (
                  <List.Item
                    key={index}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: "rgba(248, 250, 252, 0.6)",
                      border: "1px solid #E2E8F0",
                      marginBottom: 10,
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <SocialBrandIcon
                          platform={item.socialId?.constant || item.socialId?.name}
                          size={42}
                        />
                      }
                      title={
                        <Typography.Text strong style={{ fontSize: 15, color: "#0F172A" }}>
                          {item.socialId?.name || "Mạng xã hội"}
                        </Typography.Text>
                      }
                      description={
                        <Typography.Text style={{ maxWidth: 350 }} ellipsis={true}>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#0066CC", fontSize: 13 }}
                          >
                            <LinkOutlined style={{ marginRight: 4 }} />
                            {item.url}
                          </a>
                        </Typography.Text>
                      }
                    />
                    <Button
                      type="default"
                      danger
                      icon={<DisconnectOutlined />}
                      onClick={() => handleDisconnect(item._id)}
                      style={{ borderRadius: 8, fontWeight: 500 }}
                    >
                      {t("disconnect")}
                    </Button>
                  </List.Item>
                )}
              />

              {isEdit && (
                <div
                  style={{
                    marginTop: 16,
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
                        style={{ borderRadius: 8 }}
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
                    <S.FormItemNotMB>
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
                    </S.FormItemNotMB>
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
