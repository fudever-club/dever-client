"use client";

import {
  ArrowRightOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CompassOutlined,
  EditOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Empty, Progress, Row, Skeleton, Tag, Typography } from "antd";
import { useLocale } from "next-intl";
import { useRouter } from "next-nprogress-bar";

import { useAppSelector } from "@/hooks/redux-toolkit";
import { useGetMyProfileQuery } from "@/store/queries/settings";
import { useGetBlogsQuery, useGetEventsQuery, useGetProjectLabsQuery, useGetResourcesQuery } from "@/store/queries/ecosystem";
import { useGetLeaderboardQuery } from "@/store/queries/leetcode";
import LevelProgressCard from "@/components/ui/Gamification/LevelProgressCard";
import BadgeShowcaseGrid from "@/components/ui/Gamification/BadgeShowcaseGrid";

const { Title, Text, Paragraph } = Typography;

const profileFields = ["avatar", "description", "skills", "socials", "departments", "majorId", "positionId"];

function Dashboard() {
  const locale = useLocale();
  const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);
  const profileQuery = useGetMyProfileQuery(userInfo.id || "", { skip: !userInfo.id });
  const eventsQuery = useGetEventsQuery();
  const resourcesQuery = useGetResourcesQuery();
  const blogsQuery = useGetBlogsQuery();
  const labsQuery = useGetProjectLabsQuery();
  const leaderboardQuery = useGetLeaderboardQuery(undefined);
  const profile = profileQuery.data?.data ?? userInfo;
  const completeCount = profileFields.filter((field) => Array.isArray(profile?.[field]) ? profile[field].length > 0 : Boolean(profile?.[field])).length;
  const completion = Math.round((completeCount / profileFields.length) * 100);
  const profileLeetcode = profile?.leetcodeUsername;
  const leetcodeEntry = (leaderboardQuery.data?.data ?? []).find((entry: any) => entry.leetcodeUsername === profileLeetcode);
  const isLoading = eventsQuery.isLoading || resourcesQuery.isLoading || blogsQuery.isLoading || labsQuery.isLoading;
  const hasFeedError = eventsQuery.isError || resourcesQuery.isError || blogsQuery.isError || labsQuery.isError;
  const retryFeed = () => {
    eventsQuery.refetch(); resourcesQuery.refetch(); blogsQuery.refetch(); labsQuery.refetch();
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 pb-12">
      {/* Top Level & Gamification EXP Banner */}
      <LevelProgressCard />

      {/* 3D SVG Badges Showcase Grid */}
      <BadgeShowcaseGrid />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            className="h-full !rounded-3xl !border-slate-200/80 shadow-sm hover:shadow-md transition-all"
            title={
              <span className="flex items-center gap-2 font-bold text-slate-800 text-base py-1">
                <CheckCircleOutlined className="text-[#0066CC]" /> Hồ sơ của tôi
              </span>
            }
            extra={
              <Button type="link" className="font-semibold text-[#0066CC]" onClick={() => router.push(`/${locale}/settings`)}>
                Chỉnh sửa
              </Button>
            }
          >
            {profileQuery.isFetching ? (
              <Skeleton active paragraph={{ rows: 3 }} />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <Text strong className="text-slate-800">Mức hoàn thiện hồ sơ</Text>
                  <span className="text-xs font-bold text-[#0066CC] bg-blue-50 px-3 py-0.5 rounded-full">
                    {completeCount}/{profileFields.length} mục đã điền
                  </span>
                </div>
                <Progress percent={completion} strokeColor="#0066CC" trailColor="#E0F2FE" />
                <p className="text-xs text-slate-500 leading-relaxed mb-0">
                  Hoàn thiện đầy đủ giới thiệu, kỹ năng chuyên môn và các kênh liên hệ để mở khóa huy hiệu <strong className="text-slate-700">Security Sentinel</strong>.
                </p>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            className="h-full !rounded-3xl !border-slate-200/80 shadow-sm hover:shadow-md transition-all"
            title={
              <span className="flex items-center gap-2 font-bold text-slate-800 text-base py-1">
                <TrophyOutlined className="text-[#0066CC]" /> LeetCode của tôi
              </span>
            }
            extra={
              <Button type="link" className="font-semibold text-[#0066CC]" onClick={() => router.push(`/${locale}/leetcode`)}>
                Xem BXH
              </Button>
            }
          >
            {leaderboardQuery.isLoading ? (
              <Skeleton active paragraph={{ rows: 2 }} />
            ) : profileLeetcode ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Text strong className="text-base text-slate-800">@{profileLeetcode}</Text>
                  <Tag color="blue" className="!rounded-md !font-bold !text-xs">
                    {leetcodeEntry?.acSubmissionList?.length ?? 0} Bài đã AC
                  </Tag>
                </div>
                <p className="text-xs text-slate-500 mb-0">
                  Dữ liệu thuật toán tự động đồng bộ hàng giờ từ hệ thống LeetCode API.
                </p>
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa kết nối tài khoản LeetCode">
                <Button type="primary" className="!bg-[#0066CC] !rounded-xl !font-bold" onClick={() => router.push(`/${locale}/settings`)}>
                  Kết nối LeetCode
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>

      {/* Updates Section */}
      <section aria-labelledby="dever-updates" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="dever-updates" className="text-xl font-bold text-slate-900 mb-0">
              Mới từ Hệ Sinh Thái DEVER
            </h2>
            <p className="text-xs text-slate-500 mt-1 mb-0">
              Sự kiện sắp diễn ra, tài liệu học tập và bài viết công nghệ mới nhất.
            </p>
          </div>
          <Button
            icon={<CompassOutlined />}
            className="!rounded-xl font-semibold hover:!border-[#0066CC] hover:!text-[#0066CC]"
            onClick={() => router.push(`/${locale}/discover`)}
          >
            Khám phá tất cả
          </Button>
        </div>

        {isLoading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className="!rounded-3xl"><Skeleton active paragraph={{ rows: 3 }} /></Card>
              </Col>
            ))}
          </Row>
        ) : hasFeedError ? (
          <Alert
            type="error"
            showIcon
            message="Không thể tải cập nhật từ máy chủ."
            action={<Button size="small" onClick={retryFeed}>Thử lại</Button>}
          />
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card
                className="h-full !rounded-3xl !border-slate-200/80 shadow-sm hover:shadow-md transition-all"
                title={
                  <span className="flex items-center gap-2 font-bold text-slate-800 text-sm py-1">
                    <CalendarOutlined className="text-[#0066CC]" /> Sự kiện
                  </span>
                }
              >
                <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                  {eventsQuery.data?.data?.[0]?.title || "Chưa có sự kiện mới"}
                </h4>
                <p className="text-xs text-slate-500 mb-0">
                  {eventsQuery.data?.data?.[0]?.date || "Ban quản trị sẽ cập nhật lịch hoạt động tại đây."}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full !rounded-3xl !border-slate-200/80 shadow-sm hover:shadow-md transition-all"
                title={
                  <span className="flex items-center gap-2 font-bold text-slate-800 text-sm py-1">
                    <BookOutlined className="text-[#0066CC]" /> Tài liệu & Học tập
                  </span>
                }
              >
                <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                  {resourcesQuery.data?.data?.[0]?.title || "Chưa có tài liệu mới"}
                </h4>
                <p className="text-xs text-slate-500 mb-0">
                  {resourcesQuery.data?.data?.[0]?.type || "Tài liệu workshop và công nghệ sẽ xuất hiện tại đây."}
                </p>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="h-full !rounded-3xl !border-slate-200/80 shadow-sm hover:shadow-md transition-all"
                title={
                  <span className="flex items-center gap-2 font-bold text-slate-800 text-sm py-1">
                    <FileTextOutlined className="text-[#0066CC]" /> Bài viết kỹ thuật
                  </span>
                }
              >
                <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                  {blogsQuery.data?.data?.[0]?.title || "Chưa có bài viết mới"}
                </h4>
                <p className="text-xs text-slate-500 mb-0">
                  {labsQuery.data?.data?.length ? `${labsQuery.data.data.length} dự án đang mở đăng ký tham gia.` : "Theo dõi các bài viết chia sẻ kinh nghiệm từ thành viên."}
                </p>
              </Card>
            </Col>
          </Row>
        )}
      </section>

      {/* Admin Action Bar */}
      {userInfo.isAdmin && (
        <Card className="!rounded-3xl !border-blue-100 !bg-gradient-to-r !from-blue-50/70 !to-white shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0066CC] text-lg shadow-sm border border-blue-100">
                <SafetyCertificateOutlined />
              </span>
              <div>
                <Text strong className="text-slate-900 text-sm">Công cụ quản trị viên</Text>
                <div className="text-xs text-slate-500 mt-0.5">Xuất bản bài viết kỹ thuật hoặc quản lý sự kiện cho CLB.</div>
              </div>
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/${locale}/create-blog`)}
              className="!bg-[#0066CC] !rounded-xl !font-bold"
            >
              Đăng bài chia sẻ
            </Button>
          </div>
        </Card>
      )}

      {/* Community Roster Bar */}
      <Card className="!rounded-3xl !border-blue-100 !bg-gradient-to-r !from-blue-50/70 !to-white shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0066CC] text-lg shadow-sm border border-blue-100">
              <TeamOutlined />
            </span>
            <div>
              <Text strong className="text-slate-900 text-sm">Khám phá cộng đồng thành viên</Text>
              <div className="text-xs text-slate-500 mt-0.5">Tìm kiếm thành viên theo ban chuyên môn, chuyên ngành và các thế hệ K.</div>
            </div>
          </div>
          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => router.push(`/${locale}/members`)}
            className="!bg-[#0066CC] !rounded-xl !font-bold"
          >
            Mở danh bạ
          </Button>
        </div>
      </Card>
    </main>
  );
}

export default Dashboard;
