"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import * as S from "./style";

interface LoadingScreenProps {
  message?: string;
  fadeOut?: boolean;
}

function LoadingScreen({ message, fadeOut = false }: LoadingScreenProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "layout");

  const displayMessage =
    message || t("account-verifying") || "Đang tải dữ liệu...";

  return (
    <S.wrapper role="status" aria-live="polite" $fadeOut={fadeOut}>
      {/* Central Modern Micro Dual-Ring Spinner */}
      <S.SpinnerContainer>
        <S.OuterRing />
        <S.InnerRing />
        <S.CenterBadge>&lt;/&gt;</S.CenterBadge>
      </S.SpinnerContainer>

      {/* Brand & Status Text */}
      <S.BrandTitle>FU - DEVER</S.BrandTitle>
      <S.StatusText>{displayMessage}</S.StatusText>

      {/* Modern Shimmer Progress Indicator */}
      <S.ShimmerBarWrapper>
        <S.ShimmerBar />
      </S.ShimmerBarWrapper>
    </S.wrapper>
  );
}

export default LoadingScreen;
