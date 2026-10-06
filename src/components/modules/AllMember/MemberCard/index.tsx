"use client";

import React, { useState } from "react";
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
  const [imgError, setImgError] = useState(false);

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

  const avatarSrc = imgError || !dataSource.avatar
    ? "/images/avatar/avatar.jpg"
    : dataSource.avatar;

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
        : {})}
    >
      <S.ItemWrapper>
        <div style={{ position: "relative", width: "100%", height: "220px", borderRadius: "14px", overflow: "hidden", backgroundColor: "#F1F5F9" }}>
          {/* Served via Next optimizer so browsers behind storage-origin
              blocks still see avatars; local fallback on true failure. */}
          <Image
            src={avatarSrc}
            alt={memberName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            onError={() => setImgError(true)}
            style={{
              objectFit: imgError || !dataSource.avatar ? "contain" : "cover",
              padding: imgError || !dataSource.avatar ? "20px" : "0",
            }}
          />
          {dataSource.gen && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                backgroundColor: "rgba(0, 102, 204, 0.85)",
                color: "#FFFFFF",
                padding: "2px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
                backdropFilter: "blur(4px)",
              }}
            >
              Gen {dataSource.gen}
            </span>
          )}
        </div>
        <S.TextWrapper>
          <Typography.Title level={5} $fontWeight={700} $align="center" style={{ margin: "4px 0 2px 0" }}>
            {memberName}
          </Typography.Title>
          <Typography.Text $align="center" style={{ color: "#64748B", fontSize: "13px" }}>
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
