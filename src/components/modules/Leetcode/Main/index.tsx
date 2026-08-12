"use client";

import { Alert, Avatar, Button, Col, Empty, Flex, Result, Row, Skeleton } from "antd";
import { useParams } from "next/navigation";

import Typography from "@/components/core/common/Typography";
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
  const podium = leaderboard.length >= 3
    ? [
        { entry: leaderboard[1], rank: 2 },
        { entry: leaderboard[0], rank: 1 },
        { entry: leaderboard[2], rank: 3 },
      ]
    : leaderboard.map((entry, index) => ({ entry, rank: index + 1 }));

  return (
    <S.PageWrapper>
      <S.Head>
        <S.HeadTitle>
          <div>
            <Typography.Title level={3} style={{ fontWeight: 700 }}>{t("heading")}</Typography.Title>
            <Typography.Text>{t("liveDescription")}</Typography.Text>
          </div>
        </S.HeadTitle>
      </S.Head>

      {isLoading && (
        <>
          <Skeleton active paragraph={{ rows: 6 }} />
          <Row gutter={[16, 16]}>{Array.from({ length: 4 }).map((_, index) => <Col span={24} key={index}><Skeleton active avatar paragraph={{ rows: 1 }} /></Col>)}</Row>
        </>
      )}

      {isError && (
        <Result
          status="error"
          title={t("loadErrorTitle")}
          subTitle={t("loadErrorDescription")}
          extra={<Button type="primary" onClick={() => refetch()}>{t("retry")}</Button>}
        />
      )}

      {!isLoading && !isError && leaderboard.length === 0 && (
        <Empty description={t("emptyDescription")} />
      )}

      {!isLoading && !isError && leaderboard.length > 0 && (
        <>
          <LeetcodeHeatmap submissions={submissions} />
          <Alert showIcon type="info" message={t("liveNotice")} />
          <S.TopWrapper>
            {podium.map(({ entry, rank }) => <Card key={entry.leetcodeUsername} data={entry} top={rank} isTop1={rank === 1} />)}
          </S.TopWrapper>
          <Row gutter={[16, 16]}>
            {leaderboard.map((entry, index) => (
              <Col span={24} key={`${entry.leetcodeUsername}-${index}`}>
                <S.RankCard>
                  <Flex align="center" justify="space-between" style={{ width: "100%" }} gap={16} wrap>
                    <Flex gap={16} align="center">
                      <Typography.Text>{index + 1}</Typography.Text>
                      <Avatar src={entry.user?.avatar || undefined}>{getInitials(entry)}</Avatar>
                      <div>
                        <Typography.Text>{getName(entry)}</Typography.Text>
                        <S.Username>{entry.leetcodeUsername}</S.Username>
                      </div>
                    </Flex>
                    <Typography.Text>{entry.acSubmissionList.length} AC · {entry.acSubmissionList.length * 10} Pts</Typography.Text>
                  </Flex>
                </S.RankCard>
              </Col>
            ))}
          </Row>
        </>
      )}
    </S.PageWrapper>
  );
}

export default LeetcodeModule;
