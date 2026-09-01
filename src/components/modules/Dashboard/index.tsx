"use client";

import React from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
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
  Crown,
} from "lucide-react";
import { Progress, Skeleton, Empty, Alert } from "antd";
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
import LevelProgressCard from "@/components/ui/Gamification/LevelProgressCard";
import BadgeShowcaseGrid from "@/components/ui/Gamification/BadgeShowcaseGrid";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import AlumniAdvisoryModal from "@/components/modules/AlumniAdvisory/AlumniAdvisoryModal";

const profileFields = [
  { key: "avatar", label: "Ảnh đại diện" },
  { key: "description", label: "Giới thiệu" },
  { key: "skills", label: "Kỹ năng" },
  { key: "socials", label: "Liên hệ" },
  { key: "departments", label: "Ban chuyên môn" },
  { key: "majorId", label: "Chuyên ngành" },
  { key: "positionId", label: "Chức vụ" },
];

function Dashboard() {
  const locale = useLocale();
  const router = useRouter();
  const [advisoryOpen, setAdvisoryOpen] = React.useState<boolean>(false);
  const { userInfo } = useAppSelector((state) => state.auth);
  const profileQuery = useGetMyProfileQuery(userInfo.id || "", { skip: !userInfo.id });
  const eventsQuery = useGetEventsQuery();
  const resourcesQuery = useGetResourcesQuery();
  const blogsQuery = useGetBlogsQuery();
  const labsQuery = useGetProjectLabsQuery();
  const leaderboardQuery = useGetLeaderboardQuery(undefined);

  const profile = profileQuery.data?.data ?? userInfo;
  const filledFields = profileFields.filter((field) => {
    const val = profile?.[field.key];
    return Array.isArray(val) ? val.length > 0 : Boolean(val);
  });
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
      {/* 1. Command Center Hero Gamification Banner */}
      <LevelProgressCard />

      {/* Alumni Advisory Board Invitation Callout Banner */}
      <div className="rounded-3xl border border-blue-200/80 bg-gradient-to-r from-[#003B73] via-[#004C99] to-[#0066CC] p-5 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 tracking-wider uppercase mb-0.5">
              <span>Thư Mời Danh Dự Từ Ban Chủ Nhiệm</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white">Tham Gia Hội Đồng Cố Vấn &amp; Bảng Vàng Cựu Thành Viên</h3>
            <p className="text-xs text-blue-100 max-w-2xl">
              Dành cho các thế hệ Cựu thành viên DEVER (Gen 1 – Gen 6) đồng hành định hướng, mentoring và tiếp lửa cho tân sinh viên.
            </p>
          </div>
        </div>
        <button
          onClick={() => setAdvisoryOpen(true)}
          className="shrink-0 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs px-5 py-2.5 shadow-md active:scale-[0.98] transition-all"
        >
          Nhận Thư Mời &amp; Xuất Bản
        </button>
      </div>

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
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/10 via-blue-400/10 to-transparent blur-2xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
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
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-400/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
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
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-tr from-blue-500/15 to-indigo-400/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
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
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-tr from-emerald-400/15 to-teal-400/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
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
              <div className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
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
              <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-gradient-to-br from-amber-400/15 to-orange-400/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
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
            <h2 className="text-lg sm:text-xl font-black text-slate-900 m-0 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0066CC]" /> Mới từ Hệ Sinh Thái DEVER
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 m-0">
              Sự kiện sắp diễn ra, tài liệu học tập và bài viết công nghệ mới nhất.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/discover`)}
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:border-[#0066CC] hover:text-[#0066CC] transition-all shadow-xs cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#0066CC]" /> Khám phá tất cả
          </button>
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
              <button
                type="button"
                onClick={retryFeed}
                className="text-xs font-bold text-red-700 underline cursor-pointer"
              >
                Thử lại
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Event Card */}
            <div
              onClick={() => router.push(`/${locale}/discover`)}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#0066CC] text-[11px] font-black border border-blue-100">
                    <Calendar className="w-3.5 h-3.5" /> Sự kiện sắp tới
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066CC] group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-[#0066CC] transition-colors">
                  {eventsQuery.data?.data?.[0]?.title || "Workshop Thuật Toán & CSD201"}
                </h4>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {eventsQuery.data?.data?.[0]?.date || "Lịch hoạt động và workshop chuyên môn được cập nhật liên tục."}
                </p>
              </div>
            </div>

            {/* Resource Card */}
            <div
              onClick={() => router.push(`/${locale}/discover`)}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black border border-amber-100">
                    <BookOpen className="w-3.5 h-3.5" /> Kho tài liệu
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-[#0066CC] transition-colors">
                  {resourcesQuery.data?.data?.[0]?.title || "Slide Ôn Thi PE SWE201c & CSD201"}
                </h4>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {resourcesQuery.data?.data?.[0]?.type || "Tổng hợp slide bài giảng, cẩm nang và mã nguồn mẫu FPTU."}
                </p>
              </div>
            </div>

            {/* Tech Blog Card */}
            <div
              onClick={() => router.push(`/${locale}/discover`)}
              className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-black border border-purple-100">
                    <FileText className="w-3.5 h-3.5" /> Bài viết công nghệ
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5 line-clamp-1 group-hover:text-[#0066CC] transition-colors">
                  {blogsQuery.data?.data?.[0]?.title || "Kiến Trúc Next.js 14 & Tối Ưu Caching"}
                </h4>
                <p className="text-xs text-slate-500 mb-0 line-clamp-2">
                  {labsQuery.data?.data?.length
                    ? `${labsQuery.data.data.length} dự án đang mở nhận thành viên.`
                    : "Chia sẻ kinh nghiệm thực chiến từ Ban Chuyên Môn FU-DEVER."}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Admin Action Bar */}
      {userInfo.isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-white border border-blue-200/70 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0066CC] shadow-xs border border-blue-100">
              <Shield className="w-5 h-5 text-[#0066CC]" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 m-0">Công cụ quản trị viên</h4>
              <p className="text-xs text-slate-500 m-0">
                Xuất bản bài viết kỹ thuật hoặc quản lý sự kiện cho CLB.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/create-blog`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066CC] text-white text-xs font-black shadow-md shadow-blue-500/20 hover:bg-[#0052A3] transition-all self-start sm:self-center cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Đăng bài chia sẻ
          </button>
        </div>
      )}
      {/* Alumni Advisory Board Invitation Modal */}
      <AlumniAdvisoryModal
        open={advisoryOpen}
        onClose={() => setAdvisoryOpen(false)}
      />
    </main>
  );
}

export default Dashboard;
