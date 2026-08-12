"use client";

import * as S from "./styles";

import React, { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Skeleton,
} from "antd";
import { useParams } from "next/navigation";

import { UserInfo } from "@/helpers/types/userTypes";
import Typography from "@/components/core/common/Typography";
import { useTranslation } from "@/app/i18n/client";
import { useSubscribeLeaderboardMutation } from "@/store/queries/leetcode";

interface IProps {
  isUserProfileLoading: boolean;
  userData: UserInfo;
}

interface IUpdateData {
  leetcodeUsername: string;
}

function LeetcodeSubcriber({ isUserProfileLoading, userData }: IProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");

  const [form] = Form.useForm();

  const [subscribeLeaderboard, { isLoading }] = useSubscribeLeaderboardMutation();

  const onFishish = async (values: any) => {
    try {
      await subscribeLeaderboard(values).unwrap();
      message.success(t("leetcodeUpdateSuccess"));
    } catch (error) {
      message.error(t("leetcodeUpdateError"));
    }
  };

  useEffect(() => {
    form?.setFieldsValue(userData);
  }, [userData, form]);

  if (isUserProfileLoading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        <S.ContentWrapper>
          <Typography.Title level={3}>{t("leetcode")}</Typography.Title>
          <Form form={form} layout="vertical" onFinish={onFishish}>
            <Form.Item<IUpdateData>
              label={t("leetcodeUsername")}
              name="leetcodeUsername"
              extra={t("leetcodeUpdateHint")}
              rules={[
                {
                  required: true,
                  message: "Please input your Leetcode username!",
                },
              ]}
            >
              <Input placeholder={t("leetcodeUsernamePlaceholder")} disabled={isLoading} />
            </Form.Item>
            <S.FormItemNotMB>
              <Button htmlType="submit" type="primary" loading={isLoading}>
                {isLoading ? t("leetcodeSaving") : t("update")}
              </Button>
            </S.FormItemNotMB>
          </Form>
        </S.ContentWrapper>
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default LeetcodeSubcriber;
