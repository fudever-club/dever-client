import React from "react";

import * as S from "./styles";

import Image from "next/image";
import { useParams } from "next/navigation";

import { PublicMemberInfo } from "@/helpers/types/userTypes";
import { useTranslation } from "@/app/i18n/client";
import Typography from "@/components/core/common/Typography";
import { useRouter } from "next-nprogress-bar";
import { useLocale } from "next-intl";

interface IProps {
  dataSource: PublicMemberInfo;
}

function MemberCard({ dataSource }: IProps) {
  const params = useParams();
  const locale = useLocale();
  const { t } = useTranslation(params?.locale as string, "allMember");

  const router = useRouter();
  const publicProfileIdentifier = dataSource?.profileKey?.trim();
  const canOpenProfile = Boolean(publicProfileIdentifier);
  const memberName =
    [dataSource?.firstname, dataSource?.lastname].filter(Boolean).join(" ") ||
    t("anonymousMember");
  const positionLabel = dataSource?.positionId?.constant
    ? t(dataSource.positionId.constant)
    : "";

  const openProfile = () => {
    if (!publicProfileIdentifier) return;
    router.push(`/${locale}/profile/${encodeURIComponent(publicProfileIdentifier)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!canOpenProfile || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openProfile();
  };

  return (
    <S.ComponentsWrapper
      $interactive={canOpenProfile}
      {...(canOpenProfile
        ? {
            role: "link",
            tabIndex: 0,
            onClick: openProfile,
            onKeyDown: handleKeyDown,
            "aria-label": t("openPublicProfile", { name: memberName }),
          }
        : {
            "aria-disabled": true,
            "aria-label": t("profileNotPublic", { name: memberName }),
          })}
    >
      <S.ItemWrapper>
        <div
          style={{
            position: "relative",
          }}
        >
          <S.CustomImage>
            <Image
              src={dataSource.avatar == null ? "" : dataSource.avatar}
              width={400}
              height={500}
              alt={memberName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            ></Image>
            {dataSource.gen && <S.Gen>Gen {dataSource.gen}</S.Gen>}
          </S.CustomImage>
        </div>
        <S.TextWrapper>
          <Typography.Title level={5} $fontWeight={700} $align="center">
            {memberName}
          </Typography.Title>
          <Typography.Text $align="center">
            {positionLabel}
          </Typography.Text>
          {!canOpenProfile && (
            <S.ProfileUnavailable>{t("profileNotPublic")}</S.ProfileUnavailable>
          )}
        </S.TextWrapper>
      </S.ItemWrapper>
    </S.ComponentsWrapper>
  );
}

export default MemberCard;
