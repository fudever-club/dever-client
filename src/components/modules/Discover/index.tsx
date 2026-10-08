"use client";

import React, { ReactNode } from "react";
import {
  BookOutlined,
  CalendarOutlined,
  CompassOutlined,
  ExportOutlined,
  FileTextOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Alert, Button, Col, Empty, Row, Skeleton, Tag } from "antd";

import {
  useGetBlogsQuery,
  useGetEventsQuery,
  useGetProjectLabsQuery,
  useGetResourcesQuery,
} from "@/store/queries/ecosystem";
import MentorshipSection from "@/components/modules/Mentorship";
import PageHero from "@/components/ui/PageHero";
import themeColors from "@/style/themes/default/colors";
import { useLocale } from "next-intl";

function Discover() {
  const locale = useLocale();
  const events = useGetEventsQuery();
  const resources = useGetResourcesQuery();
  const blogs = useGetBlogsQuery();
  const labs = useGetProjectLabsQuery();

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "48px", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner (light tone: page already carries many colors) */}
      <PageHero
        tone="light"
        icon={<CompassOutlined />}
        eyebrow="KHÁM PHÁ HỆ SINH THÁI DEVER"
        title="Tài nguyên, sự kiện và nhóm học tập theo lịch Ban tổ chức"
        subtitle="Lịch workshop kèm link đăng ký, tài liệu có nút mở file, bài blog kỹ thuật của thành viên và Project Lab đang tuyển — mỗi nhóm hiển thị tối đa 3 mục lấy trực tiếp từ API hệ sinh thái."
      />

      {/* Mentor & Cố vấn: mentor grid + my requests tabs */}
      <MentorshipSection />

      {/* Events Section */}
      <FeedSection
        title="Sự kiện & Workshop"
        icon={<CalendarOutlined />}
        loading={events.isLoading}
        error={events.isError}
        items={events.data?.data ?? []}
        empty="Chưa có sự kiện mới được công bố."
        emptyHint="Workshop và lịch sinh hoạt CLB được cập nhật theo tuần. Quay lại sau hoặc về bảng điều khiển để xem hoạt động khác."
        emptyCtaLabel="Về bảng điều khiển"
        emptyCtaHref={`/${locale}/dashboard`}
        retry={events.refetch}
        renderItem={(item, index) => (
          <Col xs={24} md={8} key={item._id || index}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #E2E8F0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 4px 16px -2px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <Tag color="blue" style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}>
                  {item.status || "Sự kiện"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginBottom: "8px" }}>
                  {item.date || "Thời gian sắp công bố"} {item.time ? `· ${item.time}` : ""}
                </span>
                <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                  {item.description || "Thông tin chi tiết sẽ được Ban tổ chức cập nhật."}
                </p>
              </div>

              <div>
                {item.registerUrl ? (
                  <a href={item.registerUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="primary" icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Mở Google Form
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Chưa mở đăng ký</span>
                )}
              </div>
            </div>
          </Col>
        )}
      />

      {/* Resources Section */}
      <FeedSection
        title="Tài liệu & Học tập"
        icon={<BookOutlined />}
        loading={resources.isLoading}
        error={resources.isError}
        items={resources.data?.data ?? []}
        empty="Chưa có tài liệu được xuất bản."
        emptyHint="Slide workshop, cẩm nang ôn thi và source code mẫu sẽ xuất hiện tại đây khi ban chuyên môn đăng tải."
        emptyCtaLabel="Cập nhật hồ sơ"
        emptyCtaHref={`/${locale}/settings`}
        retry={resources.refetch}
        renderItem={(item, index) => (
          <Col xs={24} md={8} key={item._id || index}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #E2E8F0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 4px 16px -2px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <Tag color="blue" style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}>
                  {item.type || "Tài liệu"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
                  {item.size || "Dung lượng chưa cập nhật"}
                </p>
              </div>

              <div>
                {item.fileUrl ? (
                  <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Mở tài liệu
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Chưa có đường dẫn tải</span>
                )}
              </div>
            </div>
          </Col>
        )}
      />

      {/* Blogs Section */}
      <FeedSection
        title="Bài viết kỹ thuật"
        icon={<FileTextOutlined />}
        loading={blogs.isLoading}
        error={blogs.isError}
        items={blogs.data?.data ?? []}
        empty="Chưa có bài viết được xuất bản."
        emptyHint="Bạn có thể là người đầu tiên chia sẻ kiến thức với CLB. Bài viết mới sẽ xuất hiện tại đây sau khi được duyệt."
        emptyCtaLabel="Soạn bài viết"
        emptyCtaHref={`/${locale}/create-blog`}
        retry={blogs.refetch}
        renderItem={(item, index) => (
          <Col xs={24} md={8} key={item._id || index}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #E2E8F0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 4px 16px -2px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <Tag color="blue" style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}>
                  {item.category || "DEVER Blog"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
                  {item.excerpt || "Bài viết chia sẻ kiến thức công nghệ từ thành viên DEVER."}
                </p>
              </div>
            </div>
          </Col>
        )}
      />

      {/* Project Lab Section */}
      <FeedSection
        title="Cơ hội Project Lab"
        icon={<RocketOutlined />}
        loading={labs.isLoading}
        error={labs.isError}
        items={labs.data?.data ?? []}
        empty="Chưa có dự án đang tuyển thành viên."
        emptyHint="Dự án mở tuyển thành viên sẽ xuất hiện tại đây. Theo dõi bảng vàng để xem các đóng góp nổi bật."
        emptyCtaLabel="Xem bảng vàng"
        emptyCtaHref={`/${locale}/hall-of-fame`}
        retry={labs.refetch}
        renderItem={(item, index) => (
          <Col xs={24} md={8} key={item._id || index}>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid #E2E8F0",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "16px",
                boxShadow: "0 4px 16px -2px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <Tag
                  color={item.status === "open" ? "blue" : "default"}
                  style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}
                >
                  {item.status === "open" ? "Đang tuyển" : item.status || "Project Lab"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
                  {item.summary || "Thông tin tuyển dụng dự án do ban quản trị phụ trách."}
                </p>
              </div>

              <div>
                {item.contactUrl ? (
                  <a href={item.contactUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="primary" icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Liên hệ tham gia
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Chưa có kênh liên hệ</span>
                )}
              </div>
            </div>
          </Col>
        )}
      />
    </main>
  );
}

type FeedSectionProps = {
  title: string;
  icon: ReactNode;
  loading: boolean;
  error: boolean;
  items: any[];
  empty: string;
  emptyHint?: string;
  emptyCtaLabel?: string;
  emptyCtaHref?: string;
  renderItem: (item: any, index: number) => ReactNode;
  retry: () => void;
};

function FeedSection({
  title,
  icon,
  loading,
  error,
  items,
  empty,
  emptyHint,
  emptyCtaLabel,
  emptyCtaHref,
  renderItem,
  retry,
}: FeedSectionProps) {
  return (
    <section aria-label={title} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px", color: themeColors.primary }}>{icon}</span>
        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#1E293B", margin: 0 }}>
          {title}
        </h2>
      </div>

      {loading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col xs={24} md={8} key={index}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "24px", border: "1px solid #E2E8F0" }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : error ? (
        <Alert
          type="error"
          showIcon
          message={`Không thể tải ${title.toLowerCase()}.`}
          action={<Button size="small" onClick={retry} style={{ minHeight: 44 }}>Thử lại</Button>}
        />
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyHint ? `${empty} ${emptyHint}` : empty}
          >
            {emptyCtaLabel && emptyCtaHref ? (
              <a href={emptyCtaHref}>
                <Button type="primary" style={{ borderRadius: "10px", fontWeight: 700, minHeight: 44 }}>
                  {emptyCtaLabel}
                </Button>
              </a>
            ) : null}
          </Empty>
        </div>
      ) : (
        <Row gutter={[16, 16]}>{items.slice(0, 3).map(renderItem)}</Row>
      )}
    </section>
  );
}

export default Discover;
