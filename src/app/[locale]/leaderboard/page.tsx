"use client";

import { Avatar, Button, Empty, Result, Skeleton, Table, TableColumnsType, Tag, Typography } from "antd";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";
import { LeetcodeLeaderboardEntry } from "@/helpers/types/leetcodeTypes";
import { useGetLeaderboardQuery } from "@/store/queries/leetcode";

interface LeaderboardRow extends LeetcodeLeaderboardEntry {
  key: string;
  rank: number;
  solved: number;
}

const getName = (entry: LeetcodeLeaderboardEntry) =>
  [entry.user?.firstname, entry.user?.lastname].filter(Boolean).join(" ").trim() || "Thành viên DEVER";

const getInitials = (entry: LeetcodeLeaderboardEntry) =>
  getName(entry).split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

function PublicLeaderboardPage() {
  const params = useParams();
  const { t } = useTranslation(params.locale as string, "leetcode");
  const { data, isLoading, isError, refetch } = useGetLeaderboardQuery(undefined);
  const rows: LeaderboardRow[] = (data?.data ?? []).map((entry: LeetcodeLeaderboardEntry, index: number) => ({
    ...entry,
    key: `${entry.leetcodeUsername}-${index}`,
    rank: index + 1,
    solved: entry.acSubmissionList?.length ?? 0,
  }));

  const columns: TableColumnsType<LeaderboardRow> = [
    { title: "#", dataIndex: "rank", width: 64, align: "center" },
    {
      title: "Thành viên",
      key: "member",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.user?.avatar || undefined}>{getInitials(row)}</Avatar>
          <div>
            <div className="font-medium text-slate-900">{getName(row)}</div>
            <div className="text-xs text-slate-500">@{row.leetcodeUsername}</div>
          </div>
        </div>
      ),
    },
    { title: "Đã giải", dataIndex: "solved", width: 120, align: "right", render: (solved) => `${solved} AC` },
    { title: "Điểm", key: "score", width: 120, align: "right", render: (_, row) => <Tag color="blue">{row.solved * 10} Pts</Tag> },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <Typography.Title level={1} className="!mb-3 !text-[#0066CC]">{t("heading")}</Typography.Title>
        <Typography.Paragraph type="secondary">{t("liveDescription")}</Typography.Paragraph>
      </header>

      {isLoading && <Skeleton active paragraph={{ rows: 8 }} />}
      {isError && <Result status="error" title={t("loadErrorTitle")} subTitle={t("loadErrorDescription")} extra={<Button type="primary" onClick={() => refetch()}>{t("retry")}</Button>} />}
      {!isLoading && !isError && rows.length === 0 && <Empty description={t("emptyDescription")} />}
      {!isLoading && !isError && rows.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Table<LeaderboardRow> columns={columns} dataSource={rows} pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 640 }} />
        </section>
      )}
    </main>
  );
}

export default PublicLeaderboardPage;
