"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Compass,
  Edit3,
  ExternalLink,
  FileText,
  Flame,
  Layers,
  Lock,
  Plus,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Wallet,
} from "lucide-react";
import { Progress, Skeleton, Empty, Alert, Button } from "antd";
import { useLocale } from "next-intl";
import { useRouter } from "next-nprogress-bar";

import { useAppSelector } from "@/hooks/redux-toolkit";
import { useGetMyProfileQuery } from "@/store/queries/settings";
import {
  useGetBlogsQuery,
  useGetEventsQuery,
  useGetProjectLabsQuery,
  useGetResourcesQuery,
} from "@/store/queries/ecosystem";
import { useGetLeaderboardQuery } from "@/store/queries/leetcode";
import { constants } from "@/settings";
import webStorageClient from "@/utils/webStorageClient";
import LevelProgressCard from "@/components/ui/Gamification/LevelProgressCard";
import BadgeShowcaseGrid from "@/components/ui/Gamification/BadgeShowcaseGrid";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import AlumniAdvisoryModal from "@/components/modules/AlumniAdvisory/AlumniAdvisoryModal";
import SubmitProjectModal from "@/components/ui/SubmitProjectModal";

const profileFields = [
  { key: "avatar", label: "Ảnh đại diện", check: (p: any) => Boolean(p?.avatar) },
  { key: "description", label: "Giới thiệu bản thân", check: (p: any) => Boolean(p?.description && p.description.trim().length > 0) },
  { key: "skills", label: "Kỹ năng chuyên môn", check: (p: any) => Array.isArray(p?.skills) && p.skills.length > 0 },
  { key: "socials", label: "Mạng xã hội", check: (p: any) => Array.isArray(p?.socials) && p.socials.length > 0 },
  { key: "leetcodeUsername", label: "Đấu trường LeetCode", check: (p: any) => Boolean(p?.leetcodeUsername) },
  { key: "favoriteTrack", label: "Nhạc nền hồ sơ", check: (p: any) => Boolean(p?.favoriteTrack?.title || p?.favoriteTrack?.url) },
  { key: "departments", label: "Ban chuyên môn", check: (p: any) => Array.isArray(p?.departments) && p.departments.length > 0 },
  { key: "contact", label: "Thông tin liên hệ", check: (p: any) => Boolean(p?.phone || p?.email || p?.nickname) },
];

function Dashboard() {
  const locale = useLocale();
  const router = useRouter();
  const [advisoryOpen, setAdvisoryOpen] = React.useState<boolean>(false);
  const [submitProjectOpen, setSubmitProjectOpen] = React.useState<boolean>(false);
  const [promoVisible, setPromoVisible] = React.useState<boolean>(true);
  const { userInfo } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    try {
      if (webStorageClient.get("dever-dashboard-promo-dismissed-v1")) {
        setPromoVisible(false);
      }
    } catch {
      // localStorage unavailable — keep promo visible
    }
  }, []);

  const handlePromoClose = () => {
    setPromoVisible(false);
    try {
      webStorageClient.set("dever-dashboard-promo-dismissed-v1", "1");
    } catch {
      // ignore storage errors
    }
  };
  
  const storedUser = typeof window !== "undefined" ? webStorageClient.get(constants.USER_INFO) : null;
  const currentUserId =
    userInfo?.id ||
    storedUser?._id ||
    storedUser?.id ||
    (typeof storedUser === "string" ? storedUser : "");

  const profileQuery = useGetMyProfileQuery(currentUserId, { skip: !currentUserId });
  const eventsQuery = useGetEventsQuery();
  const resourcesQuery = useGetResourcesQuery();
  const blogsQuery = useGetBlogsQuery();
  const labsQuery = useGetProjectLabsQuery();
  const leaderboardQuery = useGetLeaderboardQuery(undefined);

  const profile = profileQuery.data?.data ?? storedUser ?? userInfo;
  const filledFields = profileFields.filter((field) => field.check(profile));
  const completeCount = filledFields.length;
  const completion = Math.round((completeCount / profileFields.length) * 100);
  const profileLeetcode = profile?.leetcodeUsername;
  const leetcodeEntry = (leaderboardQuery.data?.data ?? []).find(
    (entry: any) => entry.leetcodeUsername === profileLeetcode
  );

  const totalSolved = leetcodeEntry?.totalSolved ?? leetcodeEntry?.acSubmissionList?.length ?? 0;

  const isLoading =
    eventsQuery.isLoading ||
    resourcesQuery.isLoading ||
    blogsQuery.isLoading ||
    labsQuery.isLoading;
  const hasFeedError =
    eventsQuery.isError || resourcesQuery.isError || blogsQuery.isError || labsQuery.isError;

  const retryFeed = () => {
    eventsQuery.refetch();
    resourcesQuery.refetch();
    blogsQuery.refetch();
    labsQuery.refetch();
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 pb-12 font-sans">
      <h1 className="sr-only">Bảng điều khiển thành viên</h1>
      {/* 1. Command Center Hero Gamification Banner — sticky chỉ desktop, mobile giữ tĩnh gọn */}
      <div className="lg:sticky lg:top-16 lg:z-20">
        <LevelProgressCard />
      </div>

      {/* Combined community promo — single closable Alert, dismissal remembered */}
      {promoVisible && (
        <Alert
          type="info"
          showIcon
          closable
          onClose={handlePromoClose}
          className="!rounded-3xl !border-blue-200 !bg-white shadow-sm [&_.ant-alert-message]:!text-slate-900 [&_.ant-alert-description]:!text-slate-600 [&_.ant-alert-close-icon]:!text-slate-500"
          message={
            <span className="font-extrabold text-sm sm:text-base">
              Cộng đồng DEVER Open Source &amp; Hội đồng Cố vấn (+150 EXP)
            </span>
          }
          description={
            <div className="flex flex-col gap-3">
              <p className="m-0 text-xs text-slate-600 max-w-2xl">
                Trân trọng kính mời các thế hệ Cựu thành viên đồng hành định hướng, chia sẻ
                dự án cá nhân &amp; mã nguồn mở lên hệ sinh thái FU-DEVER để nhận điểm danh
                vọng và mở khóa huy hiệu Core Contributor.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="primary"
                  size="middle"
                  onClick={() => setAdvisoryOpen(true)}
                  className="!rounded-xl font-bold min-h-[44px]"
                >
                  Nhận Thư Mời &amp; Đồng Hành
                </Button>
                <button
                  type="button"
                  onClick={() => setSubmitProjectOpen(true)}
                  className="text-xs font-bold text-primary hover:underline min-h-[44px] px-2"
                >
                  Hoặc đóng góp dự án mã nguồn mở
                </button>
              </div>
            </div>
          }
        />
      )}

      {/* 2. Magic UI Bento Grid Feature Showcase */}
      <section aria-label="Bento Command Grid">
        <BentoGrid className="lg:grid-rows-2">
          {/* Card 1: LeetCode Arena (Span 2 cols on Large Screens) */}
          <BentoCard
            name="Đấu Trường LeetCode"
            className="lg:col-span-2"
            badge={profileLeetcode ? `@${profileLeetcode} • ${totalSolved} Bài AC` : "Chưa kết nối"}
            Icon={Trophy}
            description="Bảng xếp hạng giải thuật toán realtime. Rèn luyện tư duy lập trình, thi đua top điểm danh vọng và sẵn sàng cho các kỳ thi ICPC."
            href={`/${locale}/leetcode`}
            cta="Vào Đấu Trường LeetCode"
            background={
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/10 via-blue-400/10 to-transparent blur-2xl motion-safe:group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            }
          />

          {/* Card 2: DEVER Studio Blog Writer (Span 1 col) */}
          <BentoCard
            name="DEVER Studio Writer"
            className="lg:col-span-1"
            badge="+150 EXP / Bài"
            Icon={Edit3}
            description="Soạn thảo và xuất bản bài viết công nghệ Markdown với Live Code Preview, tối ưu SEO và nhận điểm danh vọng CLB."
            href={`/${locale}/create-blog`}
            cta="Soạn Bài Viết Mới"
            background={
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-400/10 blur-2xl motion-safe:group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            }
          />

          {/* Card 3: Đóng Quỹ CLB (Span 1 col) */}
          <BentoCard
            name="Quỹ Hoạt Động CLB"
            className="lg:col-span-1"
            badge="VietQR 1-Click"
            Icon={Wallet}
            description="Thực hiện nghĩa vụ đóng quỹ thành viên, theo dõi tiến độ giải ngân thiết bị Lab và tài trợ giải đấu."
            href={`/${locale}/fund`}
            cta="Đóng Quỹ CLB"
            background={
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-tr from-blue-500/15 to-indigo-400/10 blur-2xl motion-safe:group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            }
          />

          {/* Card 4: Hồ Sơ & Bảo Mật (Span 1 col) */}
          <BentoCard
            name="Hồ Sơ & Bảo Mật"
            className="lg:col-span-1"
            badge={`${completion}% Hoàn Thiện`}
            Icon={Shield}
            description="Hoàn thiện các kỹ năng chuyên môn, kênh liên hệ và thông tin cá nhân để mở khóa huy hiệu Security Sentinel."
            href={`/${locale}/settings`}
            cta="Cập Nhật Hồ Sơ"
            background={
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-400/15 to-teal-400/10 blur-2xl motion-safe:group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            }
          />

          {/* Card 4: Danh Bạ Thành Viên (Span 1 col) */}
          <BentoCard
            name="Danh Bạ Thành Viên"
            className="lg:col-span-1"
            badge="150+ Thành Viên"
            Icon={Users}
            description="Khám phá mạng lưới tài năng sinh viên CNTT các thế hệ Gen 1 đến Gen 6 thuộc các ban Frontend, Backend, AI và Game."
            href={`/${locale}/members`}
            cta="Mở Danh Bạ DEVER"
            background={
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/10 blur-2xl motion-safe:group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            }
          />

          {/* Card 5: Kho Tài Liệu & Slide (Span 1 col) */}
          <BentoCard
            name="Kho Tài Liệu & Slide"
            className="lg:col-span-1"
            badge="Tài Nguyên FPTU"
            Icon={BookOpen}
            description="Truy cập kho cẩm nang ôn thi PE môn SWE201c, CSD201, slide workshop chuyên đề và các bộ source code mẫu chuẩn hóa."
            href={`/${locale}/discover`}
            cta="Khám Phá Tài Liệu"
            background={
              <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-br from-amber-400/15 to-orange-400/10 blur-2xl motion-safe:group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            }
          />
        </BentoGrid>
      </section>

      {/* 3. 3D Badges Showcase Grid */}
      <BadgeShowcaseGrid />

      {/* 4. Ecosystem Updates: 3-Card Bento Feed */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 m-0 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Mới từ Hệ Sinh Thái DEVER
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 m-0">
              Sự kiện sắp diễn ra, tài liệu học tập và bài viết công nghệ mới nhất.
            </p>
          </div>
          <Button
            onClick={() => router.push(`/${locale}/discover`)}
            className="inline-flex items-center gap-1.5 self-start sm:self-center !rounded-xl !border-slate-200 text-xs font-bold !text-slate-700 hover:border-primary! hover:text-primary! shadow-xs min-h-[44px]"
          >
            <Compass className="w-3.5 h-3.5 text-primary" /> Khám phá tất cả
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-6 rounded-3xl bg-white border border-slate-200">
                <Skeleton active paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : hasFeedError ? (
          <Alert
            type="error"
            showIcon
            message="Không thể tải cập nhật từ máy chủ."
            action={
              <Button size="middle" danger onClick={retryFeed} className="min-h-[44px]">
                Thử lại
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event Card */}
            <Link
              href={`/${locale}/discover`}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-extrabold border border-blue-100">
                    <Calendar className="w-3.5 h-3.5" /> Sự kiện sắp tới
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary motion-safe:group-hover:translate-x-0.5 transition-[color,transform]" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {eventsQuery.data?.data?.[0]?.title || "Chưa có sự kiện nào"}
                </h3>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {eventsQuery.data?.data?.[0]?.date || "Workshop, buổi chia sẻ và lịch sinh hoạt CLB cập nhật theo tuần."}
                </p>
              </div>
            </Link>

            {/* Resource Card */}
            <Link
              href={`/${locale}/discover`}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-extrabold border border-blue-100">
                    <BookOpen className="w-3.5 h-3.5" /> Kho tài liệu
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary motion-safe:group-hover:translate-x-0.5 transition-[color,transform]" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {resourcesQuery.data?.data?.[0]?.title || "Chưa có tài liệu nào"}
                </h3>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {resourcesQuery.data?.data?.[0]?.type || "Slide workshop, cẩm nang ôn thi và source code mẫu từ các ban."}
                </p>
              </div>
            </Link>

            {/* Tech Blog Card */}
            <Link
              href={`/${locale}/discover`}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-primary text-xs font-extrabold border border-blue-100">
                    <FileText className="w-3.5 h-3.5" /> Bài viết công nghệ
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-primary motion-safe:group-hover:translate-x-0.5 transition-[color,transform]" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {blogsQuery.data?.data?.[0]?.title || "Chưa có bài viết nào"}
                </h3>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {labsQuery.data?.data?.length
                    ? `${labsQuery.data.data.length} dự án đang mở nhận thành viên.`
                    : "Bài viết kỹ thuật mới nhất từ thành viên và ban chuyên môn."}
                </p>
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* 5. Admin Action Bar */}
      {userInfo.isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-white border border-blue-200/70 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-primary shadow-xs border border-blue-100">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 m-0">Công cụ quản trị viên</h3>
              <p className="text-xs text-slate-500 m-0">
                Xuất bản bài viết kỹ thuật hoặc quản lý sự kiện cho CLB.
              </p>
            </div>
          </div>
          <Button
            type="primary"
            onClick={() => router.push(`/${locale}/create-blog`)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
            className="inline-flex items-center gap-2 !rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 self-start sm:self-center min-h-[44px]"
          >
            Đăng bài chia sẻ
          </Button>
        </div>
      )}
      {/* Alumni Advisory Board Invitation Modal */}
      <AlumniAdvisoryModal
        open={advisoryOpen}
        onClose={() => setAdvisoryOpen(false)}
      />
      {/* Open Source Project Submission Modal */}
      <SubmitProjectModal
        open={submitProjectOpen}
        onClose={() => setSubmitProjectOpen(false)}
      />
    </main>
  );
}

export default Dashboard;
