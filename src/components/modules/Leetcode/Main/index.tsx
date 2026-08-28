"use client";

import React from "react";
import { Avatar, Button, Empty, Result, Skeleton } from "antd";
import { useParams } from "next/navigation";
import { TrophyOutlined, CodeOutlined, SyncOutlined } from "@ant-design/icons";

import LeetcodeHeatmap from "@/components/ui/LeetcodeHeatmap";
import { useTranslation } from "@/app/i18n/client";
import { LeetcodeLeaderboardEntry } from "@/helpers/types/leetcodeTypes";
import { useGetLeaderboardQuery } from "@/store/queries/leetcode";

import Card from "../Card";
import * as S from "./styles";

const getName = (entry: LeetcodeLeaderboardEntry) =>
  [entry.user?.firstname, entry.user?.lastname].filter(Boolean).join(" ").trim() || "Thành viên DEVER";

const getInitials = (entry: LeetcodeLeaderboardEntry) =>
  getName(entry).split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

function LeetcodeModule() {
  const params = useParams();
  const { t } = useTranslation(params.locale as string, "leetcode");
  const { data, isLoading, isError, refetch } = useGetLeaderboardQuery(undefined);
  const leaderboard: LeetcodeLeaderboardEntry[] = data?.data ?? [];
  const submissions = leaderboard.flatMap((entry) => entry.acSubmissionList ?? []);

  // Top 3 entries
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <S.Container>
      {/* Header Banner */}
      <S.HeaderBanner>
        <S.HeaderContent>
          <div>
            <S.TitleBadge>
              <CodeOutlined style={{ color: "#FDE047" }} /> ĐẤU TRƯỜNG THUẬT TOÁN LEETCODE
            </S.TitleBadge>

            <S.MainTitle>{t("heading")}</S.MainTitle>

            <S.Description>{t("liveDescription")}</S.Description>
          </div>

          <div>
            <S.RefreshButton onClick={() => refetch()}>
              <SyncOutlined /> Làm mới BXH
            </S.RefreshButton>
          </div>
        </S.HeaderContent>
      </S.HeaderBanner>

      {isLoading && (
        <S.CardWrapper>
          <Skeleton active paragraph={{ rows: 6 }} />
        </S.CardWrapper>
      )}

      {isError && (
        <S.CardWrapper>
          <Result
            status="error"
            title={t("loadErrorTitle")}
            subTitle={t("loadErrorDescription")}
            extra={<Button type="primary" onClick={() => refetch()}>{t("retry")}</Button>}
          />
        </S.CardWrapper>
      )}

      {!isLoading && !isError && leaderboard.length === 0 && (
        <S.CardWrapper style={{ textAlign: "center", padding: "48px 16px" }}>
          <Empty description={t("emptyDescription")} />
        </S.CardWrapper>
      )}

      {!isLoading && !isError && leaderboard.length > 0 && (
        <>
          {/* Heatmap Section */}
          <LeetcodeHeatmap submissions={submissions} />

          {/* Top 3 Podium with dynamic responsive order */}
          {leaderboard.length >= 3 && (
            <S.PodiumGrid>
              {/* Top 2 (Silver) - Mobile: 2nd, Desktop: 1st (Left) */}
              <S.PodiumItem $orderMobile={2} $orderDesktop={1}>
                <Card data={top2} top={2} />
              </S.PodiumItem>

              {/* Top 1 (Gold) - Mobile: 1st (Top), Desktop: 2nd (Center) */}
              <S.PodiumItem $orderMobile={1} $orderDesktop={2}>
                <Card data={top1} top={1} isTop1={true} />
              </S.PodiumItem>

              {/* Top 3 (Bronze) - Mobile: 3rd, Desktop: 3rd (Right) */}
              <S.PodiumItem $orderMobile={3} $orderDesktop={3}>
                <Card data={top3} top={3} />
              </S.PodiumItem>
            </S.PodiumGrid>
          )}

          {leaderboard.length < 3 && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", margin: "16px 0" }}>
              {leaderboard.map((entry, index) => (
                <div key={entry.leetcodeUsername} style={{ width: "100%", maxWidth: "340px", display: "flex", justifyContent: "center" }}>
                  <Card data={entry} top={index + 1} isTop1={index === 0} />
                </div>
              ))}
            </div>
          )}

          {/* Full Leaderboard List */}
          <S.CardWrapper>
            <S.ListHeader>
              <TrophyOutlined style={{ fontSize: "18px", color: "#0066CC" }} />
              <h2>Toàn Bộ Bảng Xếp Hạng ({leaderboard.length} Lập Trình Viên)</h2>
            </S.ListHeader>

            <S.LeaderboardList>
              {leaderboard.map((entry, index) => (
                <S.LeaderboardRow key={`${entry.leetcodeUsername}-${index}`} $rank={index}>
                  {/* Left: Rank + Avatar + Name + Handle */}
                  <S.ProfileInfo>
                    <S.RankBadge $rank={index}>{index + 1}</S.RankBadge>

                    <Avatar
                      size={38}
                      src={entry.user?.avatar || undefined}
                      style={{
                        flexShrink: 0,
                        border: "2px solid #FFFFFF",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "#0066CC",
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(entry)}
                    </Avatar>

                    <S.UserText>
                      <h4 title={getName(entry)}>{getName(entry)}</h4>
                      <p title={`@${entry.leetcodeUsername}`}>@{entry.leetcodeUsername}</p>
                    </S.UserText>
                  </S.ProfileInfo>

                  {/* Right: AC Submissions & Points Stats */}
                  <S.StatsContainer>
                    <S.ACPill>
                      <TrophyOutlined style={{ fontSize: "11px" }} />
                      {entry.acSubmissionList?.length ?? 0} Bài AC
                    </S.ACPill>
                    <S.PtsPill>{(entry.acSubmissionList?.length ?? 0) * 10} Pts</S.PtsPill>
                  </S.StatsContainer>
                </S.LeaderboardRow>
              ))}
            </S.LeaderboardList>
          </S.CardWrapper>
        </>
      )}
    </S.Container>
  );
}

export default LeetcodeModule;
