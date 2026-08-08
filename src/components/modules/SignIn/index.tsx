"use client";

import Image from "next/image";
import { Checkbox, Col, Flex, Form, FormProps, Input, message } from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/MainLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import { useSignInMutation } from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";

import * as S from "./styles";

type FieldType = {
  email: string;
  password: string;
  remember?: boolean;
};

function SignInModule() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();

  const { t } = useTranslation(params?.locale as string, "signIn");

  const [signIn, { isLoading }] = useSignInMutation();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const res: any = await signIn(values).unwrap();
      const token = res?.data?.token;

      if (token) {
        webStorageClient.setToken(token);
        webStorageClient.set("_access_token", token);
      }

      message.success(t("signInSuccess"));
      router?.push(`/${locale}/members`);
    } catch (error) {
      message.error(t("invalidCredentials"));
    }
  };

  const showRecoveryGuidance = () => {
    message.info(t("passwordRecoveryUnavailable"), 6);
  };

  return (
    <S.Wrapper>
      <Flex justify="space-between">
        <Image
          alt="FU-DEVER"
          src={"/icons/layout/fu-dever-logo.png"}
          width={40}
          height={40}
        />
        <SelectLanguage />
      </Flex>
      <Typography.Title
        level={2}
        $color={themeColors?.primary}
        $align="center"
        $margin="32px 0px 16px 0"
      >
        {t("welcome")}
      </Typography.Title>
      <Typography.Text $align="center" $margin="0px 0px 32px 0">
        {t("description")}
      </Typography.Text>
      <S.AccessNotice role="note">
        <strong>{t("accessNoticeTitle")}</strong>
        <span>{t("accessNoticeDescription")}</span>
      </S.AccessNotice>
      <Form
        name="sign-in"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        validateTrigger={["onBlur", "onChange"]}
      >
        <Form.Item<FieldType>
          label={t("email")}
          name="email"
          wrapperCol={{ span: 24 }}
          hasFeedback
          rules={[
            { required: true, message: t("emailError") },
            { type: "email", message: t("emailInvalid") },
          ]}
        >
          <Input
            placeholder={t("enterEmail")}
            autoComplete="email"
            inputMode="email"
            aria-label={t("email")}
            disabled={isLoading}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label={t("password")}
          name="password"
          wrapperCol={{ span: 24 }}
          hasFeedback
          rules={[
            { required: true, message: t("passwordError") },
            { min: 6, message: t("passwordMinLength") },
          ]}
        >
          <Input.Password
            placeholder={t("enterPassword")}
            autoComplete="current-password"
            aria-label={t("password")}
            disabled={isLoading}
          />
        </Form.Item>

        <Col span={24}>
          <Flex align="flex-start" justify="space-between">
            <Form.Item<FieldType>
              wrapperCol={{ span: 24 }}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox disabled={isLoading}>{t("rememberMe")}</Checkbox>
            </Form.Item>
            <Button
              type="link"
              htmlType="button"
              onClick={showRecoveryGuidance}
              disabled={isLoading}
              aria-describedby="password-recovery-help"
            >
              {t("forgotPassword")}
            </Button>
          </Flex>
        </Col>

        <S.ScreenReaderText id="password-recovery-help">
          {t("passwordRecoveryUnavailable")}
        </S.ScreenReaderText>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            $width="100%"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </Button>
        </Form.Item>
      </Form>
      <S.SignUpPrompt justify="center" gap={4} role="note">
        <span>{t("accountProvisioning")}</span>
      </S.SignUpPrompt>
    </S.Wrapper>
  );
}

export default SignInModule;
