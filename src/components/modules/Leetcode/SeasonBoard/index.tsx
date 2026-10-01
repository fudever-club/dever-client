"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Button,
  Empty,
  Result,
  Select,
  Skeleton,
  Table,
  TableColumnsType,
  Tag,
} from "antd";

import { useTranslation } from "@/app/i18n/client";

import {
  SeasonDto,
  SeasonLeaderboardData,
  SeasonLeaderboardEntry,
} from "@/helpers/types/leetcodeTypes";
import {
  useGetSeasonLeaderboardQuery,
  useGetSeasonsQuery,
} from "@/store/queries/seasons";

import * as S from "./styles";

interface SeasonRow extends SeasonLeaderboardEntry {
  key: string;
  rank: number;
}

const getName = (entry: SeasonLeaderboardEntry, fallback: string) =>
  [entry.user?.firstname, entry.user?.lastname]
    .filter(Boolean)
    .join(" ")
    .trim() || fallback;

const getInitials = (entry: SeasonLeaderboardEntry, fallback: string) =>
  getName(entry, fallback)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const isNotFound = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "status" in error &&
  (error as { status: unknown }).status === 404;

function SeasonBoard() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "leetcode");
  const fallbackMember = t("seasonFallbackMember", "Thành viên DEVER");
  const {
    data: seasonsData,
    isLoading: seasonsLoading,
    isError: seasonsError,
    refetch: refetchSeasons,
  } = useGetSeasonsQuery();
  const seasons: SeasonDto[] = useMemo(
    () => seasonsData?.data ?? [],
    [seasonsData]
  );

  const [selectedSeasonId, setSelectedSeasonId] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (seasons.length === 0 || selectedSeasonId) return;
    const active = seasons.find((season) => season.status === "active");
    setSelectedSeasonId((active ?? seasons[0])._id);
  }, [seasons, selectedSeasonId]);

  const {
    data: boardData,
    isLoading: boardLoading,
    isError: boardError,
    error: boardHttpError,
    refetch: refetchBoard,
  } = useGetSeasonLeaderboardQuery(
    selectedSeasonId ? { seasonId: selectedSeasonId } : undefined
  );

  const payload: SeasonLeaderboardData | null = boardData?.data ?? null;
  const rows: SeasonRow[] = useMemo(
    () =>
      (payload?.entries ?? []).map((entry, index) => ({
        ...entry,
        key: `${entry.leetcodeUsername}-${index}`,
        rank: index + 1,
      })),
    [payload]
  );

  const handleRetry = () => {
    refetchSeasons();
    refetchBoard();
  };

  const columns: TableColumnsType<SeasonRow> = [
    { title: "#", dataIndex: "rank", width: 64, align: "center" },
    {
      title: t("seasonMember", "Thành viên"),
      key: "member",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.user?.avatar || undefined}>
            {getInitials(row, fallbackMember)}
          </Avatar>
          <div>
            <div className="font-medium text-slate-900">{getName(row, fallbackMember)}</div>
            <div className="text-xs text-slate-500">
              @{row.leetcodeUsername}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("seasonSolved", "Đã giải"),
      dataIndex: "solved",
      width: 110,
      align: "right",
      render: (solved: number) => `${solved} AC`,
    },
    {
      title: t("seasonScore", "Điểm"),
      key: "score",
      width: 120,
      align: "right",
      render: (_, row) => <Tag color="blue">{row.score} Pts</Tag>,
    },
    {
      title: t("seasonBreakdown", "Breakdown"),
      key: "breakdown",
      width: 220,
      render: (_, row) => (
        <div className="flex flex-wrap gap-1">
          <Tag color="green">E {row.breakdown?.easy ?? 0}</Tag>
          <Tag color="orange">M {row.breakdown?.medium ?? 0}</Tag>
          <Tag color="red">H {row.breakdown?.hard ?? 0}</Tag>
          {(row.breakdown?.unknown ?? 0) > 0 && (
            <Tag color="default">? {row.breakdown.unknown}</Tag>
          )}
        </div>
      ),
    },
  ];

  const isLoading = seasonsLoading || boardLoading;
  const boardNotFound = boardError && isNotFound(boardHttpError);
  const noSeasonAvailable =
    !seasonsLoading &&
    !seasonsError &&
    seasons.length === 0 &&
    (boardNotFound || (!boardLoading && !boardError && rows.length === 0));

  if (isLoading) {
    return (
      <S.CardWrapper>
        <Skeleton active paragraph={{ rows: 8 }} />
      </S.CardWrapper>
    );
  }

  if (seasonsError || (boardError && !boardNotFound)) {
    return (
      <S.CardWrapper>
        <Result
          status="error"
          title={t("seasonLoadErrorTitle", "Chưa thể tải bảng xếp hạng mùa giải")}
          subTitle={t("seasonLoadErrorDesc", "Kiểm tra kết nối rồi thử lại.")}
          extra={
            <Button type="primary" onClick={handleRetry}>
              {t("seasonRetry", "Thử lại")}
            </Button>
          }
        />
      </S.CardWrapper>
    );
  }

  if (boardNotFound || noSeasonAvailable) {
    return (
      <S.CardWrapper style={{ textAlign: "center", padding: "48px 16px" }}>
        <Empty description={t("seasonEmptyNoSeason", "Chưa có mùa giải đang diễn ra")} />
      </S.CardWrapper>
    );
  }

  if (!boardLoading && !boardError && rows.length === 0) {
    return (
      <S.CardWrapper>
        <S.Toolbar>
          <S.ToolbarTitle>{t("seasonTitle", "Bảng xếp hạng mùa giải")}</S.ToolbarTitle>
          <Select
            value={selectedSeasonId}
            onChange={(value) => setSelectedSeasonId(value)}
            options={seasons.map((season) => ({
              value: season._id,
              label: `${season.name}${
                season.status === "active" ? ` ${t("seasonActiveSuffix", "(đang diễn ra)")}` : ""
              }`,
            }))}
            style={{ width: "100%", maxWidth: 320 }}
          />
        </S.Toolbar>
        <div style={{ textAlign: "center", padding: "32px 16px" }}>
          <Empty description={t("seasonEmptyNoData", "Mùa giải này chưa có dữ liệu xếp hạng")} />
        </div>
      </S.CardWrapper>
    );
  }

  return (
    <S.CardWrapper>
      <S.Toolbar>
        <S.ToolbarTitle>
          {t("seasonTitle", "Bảng xếp hạng mùa giải")}
          {payload?.season?.name ? ` — ${payload.season.name}` : ""}
        </S.ToolbarTitle>
        <Select
          value={selectedSeasonId}
          onChange={(value) => setSelectedSeasonId(value)}
          options={seasons.map((season) => ({
            value: season._id,
            label: `${season.name}${
              season.status === "active" ? ` ${t("seasonActiveSuffix", "(đang diễn ra)")}` : ""
            }`,
          }))}
          style={{ width: "100%", maxWidth: 320 }}
        />
      </S.Toolbar>

      {payload && payload.scoringComplete === false && (
        <Alert
          type="warning"
          showIcon
          message={t("seasonScoringIncomplete", "Điểm mùa giải đang tạm tính — một số bài chưa được phân loại độ khó.")}
          style={{ marginBottom: 16 }}
        />
      )}

      <S.TableScroll>
        <Table<SeasonRow>
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          scroll={{ x: 720 }}
        />
      </S.TableScroll>
    </S.CardWrapper>
  );
}

export default SeasonBoard;
