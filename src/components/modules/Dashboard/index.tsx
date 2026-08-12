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

const { Title, Text, Paragraph } = Typography;

const profileFields = ["avatar", "description", "skills", "socials", "departments", "majorId", "positionId"];

const getDisplayName = (user: any) => [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Thành viên DEVER";

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
    <main className="mx-auto w-full max-w-7xl space-y-6 px-1 pb-4 sm:px-2">
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#004C99] to-[#0066CC] p-6 text-white shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold"><CheckCircleOutlined /> Không gian thành viên</span>
            <Title level={1} className="!mb-2 !text-3xl !text-white sm:!text-4xl">Chào {getDisplayName(profile)}</Title>
            <Paragraph className="!mb-0 !text-base !text-blue-100">Theo dõi hồ sơ, hoạt động học tập và những cập nhật mới nhất từ FU-DEVER ở một nơi.</Paragraph>
          </div>
          <Button size="large" icon={<EditOutlined />} onClick={() => router.push(`/${locale}/settings`)} className="!h-11 !border-white/40 !bg-white !font-semibold !text-[#0066CC]">Cập nhật hồ sơ</Button>
        </div>
      </section>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card className="h-full !rounded-2xl !border-slate-200" title={<span className="flex items-center gap-2"><CheckCircleOutlined className="text-[#0066CC]" />Hồ sơ của tôi</span>} extra={<Button type="link" onClick={() => router.push(`/${locale}/settings`)}>Chỉnh sửa</Button>}>
            {profileQuery.isFetching ? <Skeleton active paragraph={{ rows: 3 }} /> : <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><Text strong>Mức hoàn thiện hồ sơ</Text><Text className="!text-slate-500">{completeCount}/{profileFields.length} phần</Text></div>
              <Progress percent={completion} strokeColor="#0066CC" trailColor="#e0f2fe" />
              <Text type="secondary">Hoàn thiện giới thiệu, kỹ năng và kênh liên hệ để những thông tin bạn chọn công khai trở nên hữu ích hơn.</Text>
            </div>}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="h-full !rounded-2xl !border-slate-200" title={<span className="flex items-center gap-2"><TrophyOutlined className="text-[#0066CC]" />LeetCode của tôi</span>} extra={<Button type="link" onClick={() => router.push(`/${locale}/leetcode`)}>Xem BXH</Button>}>
            {leaderboardQuery.isLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : profileLeetcode ? <div className="space-y-2"><Text strong>@{profileLeetcode}</Text><div className="flex items-center gap-2"><Tag color="blue">{leetcodeEntry?.acSubmissionList?.length ?? 0} AC</Tag><Text type="secondary">Dữ liệu đồng bộ từ bảng xếp hạng</Text></div></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa kết nối LeetCode" ><Button type="primary" onClick={() => router.push(`/${locale}/settings`)}>Kết nối LeetCode</Button></Empty>}
          </Card>
        </Col>
      </Row>

      <section aria-labelledby="dever-updates" className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><Title id="dever-updates" level={2} className="!mb-1 !text-2xl">Mới từ DEVER</Title><Text type="secondary">Thông tin được lấy trực tiếp từ hệ thống quản trị.</Text></div><Button icon={<CompassOutlined />} onClick={() => router.push(`/${locale}/discover`)}>Khám phá tất cả</Button></div>
        {isLoading ? <Row gutter={[16, 16]}>{Array.from({ length: 3 }).map((_, index) => <Col xs={24} md={8} key={index}><Card><Skeleton active paragraph={{ rows: 3 }} /></Card></Col>)}</Row> : hasFeedError ? <Alert type="error" showIcon message="Không thể tải một phần cập nhật từ DEVER." action={<Button size="small" onClick={retryFeed}>Thử lại</Button>} /> : <Row gutter={[16, 16]}>
          <Col xs={24} md={8}><Card className="h-full !rounded-2xl" title={<span className="flex items-center gap-2"><CalendarOutlined className="text-[#0066CC]" />Sự kiện</span>}><Text strong>{eventsQuery.data?.data?.[0]?.title || "Chưa có sự kiện mới"}</Text><Paragraph className="!mb-0 !mt-2 !text-sm !text-slate-500">{eventsQuery.data?.data?.[0]?.date || "Ban quản trị sẽ cập nhật lịch hoạt động tại đây."}</Paragraph></Card></Col>
          <Col xs={24} md={8}><Card className="h-full !rounded-2xl" title={<span className="flex items-center gap-2"><BookOutlined className="text-[#0066CC]" />Tài liệu</span>}><Text strong>{resourcesQuery.data?.data?.[0]?.title || "Chưa có tài liệu mới"}</Text><Paragraph className="!mb-0 !mt-2 !text-sm !text-slate-500">{resourcesQuery.data?.data?.[0]?.type || "Tài liệu workshop và học tập sẽ xuất hiện tại đây."}</Paragraph></Card></Col>
          <Col xs={24} md={8}><Card className="h-full !rounded-2xl" title={<span className="flex items-center gap-2"><FileTextOutlined className="text-[#0066CC]" />Bài viết</span>}><Text strong>{blogsQuery.data?.data?.[0]?.title || "Chưa có bài viết mới"}</Text><Paragraph className="!mb-0 !mt-2 !text-sm !text-slate-500">{labsQuery.data?.data?.length ? `${labsQuery.data.data.length} dự án đang được cập nhật trong Project Lab.` : "Project Lab sẽ được hiển thị khi có dự án được quản trị viên đăng."}</Paragraph></Card></Col>
        </Row>}
      </section>

      {userInfo.isAdmin && (
        <Card className="!rounded-2xl !border-blue-100 !bg-blue-50/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0066CC]"><SafetyCertificateOutlined /></span><div><Text strong>Công cụ quản trị</Text><div className="text-sm text-slate-600">Xuất bản bài viết chia sẻ cho cộng đồng DEVER.</div></div></div>
            <Button type="primary" icon={<EditOutlined />} onClick={() => router.push(`/${locale}/create-blog`)}>Đăng bài chia sẻ</Button>
          </div>
        </Card>
      )}

      <Card className="!rounded-2xl !border-blue-100 !bg-blue-50/60"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0066CC]"><TeamOutlined /></span><div><Text strong>Khám phá cộng đồng</Text><div className="text-sm text-slate-600">Tìm thành viên theo ban, chuyên ngành và thế hệ.</div></div></div><Button type="primary" icon={<ArrowRightOutlined />} onClick={() => router.push(`/${locale}/members`)}>Mở danh bạ</Button></div></Card>
    </main>
  );
}

export default Dashboard;
