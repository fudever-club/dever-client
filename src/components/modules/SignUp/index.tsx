"use client";

import Image from "next/image";
import Link from "next/link";
import { Flex } from "antd";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import { useTranslation } from "@/app/i18n/client";
import Typography from "@/components/core/common/Typography";
import SelectLanguage from "@/components/core/layouts/MainLayout/SelectLanguage";
import themeColors from "@/style/themes/default/colors";

import * as S from "../SignIn/styles";

function SignUpModule() {
  const params = useParams();
  const locale = useLocale();
  const { t } = useTranslation(params?.locale as string, "signUp");

  return (
    <S.Wrapper>
      <Flex justify="space-between">
        <Image
          alt="FU-DEVER"
          src="/icons/layout/fu-dever-logo.png"
          width={40}
          height={40}
        />
        <SelectLanguage />
      </Flex>
      <Typography.Title
        level={2}
        $color={themeColors.primary}
        $align="center"
        $margin="32px 0px 16px 0"
      >
        {t("welcome")}
      </Typography.Title>
      <Typography.Text $align="center" $margin="0px 0px 32px 0">
        {t("description")}
      </Typography.Text>
      <S.AccessNotice role="status" aria-live="polite">
        <strong>{t("accessNoticeTitle")}</strong>
        <span>{t("accessNoticeDescription")}</span>
      </S.AccessNotice>
      <S.AccessNotice role="note">
        <strong>{t("whatToDoTitle")}</strong>
        <span>{t("whatToDoDescription")}</span>
      </S.AccessNotice>
      <a
        href="https://forms.gle/hJxSewnuiVFwR1rH8"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "#0066CC",
          color: "#ffffff",
          fontWeight: 600,
          fontSize: "14px",
          padding: "12px 20px",
          borderRadius: "10px",
          textAlign: "center",
          textDecoration: "none",
          marginTop: "12px",
          marginBottom: "16px",
          boxShadow: "0 2px 8px rgba(0, 102, 204, 0.25)",
          transition: "all 0.2s",
        }}
      >
        <span>Đăng ký tham gia FU-DEVER (Google Form)</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
      <S.SignUpPrompt justify="center" gap={4}>
        <span>{t("alreadyHaveAccount")}</span>
        <Link href={`/${locale}/sign-in`}>{t("signIn")}</Link>
      </S.SignUpPrompt>
    </S.Wrapper>
  );
}

export default SignUpModule;
