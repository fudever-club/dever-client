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
      <S.SignUpPrompt justify="center" gap={4}>
        <span>{t("alreadyHaveAccount")}</span>
        <Link href={`/${locale}/sign-in`}>{t("signIn")}</Link>
      </S.SignUpPrompt>
    </S.Wrapper>
  );
}

export default SignUpModule;
