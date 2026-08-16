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

type FeedSectionProps = {
  title: string;
  icon: ReactNode;
  loading: boolean;
  error: boolean;
  items: any[];
  empty: string;
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
  renderItem,
  retry,
}: FeedSectionProps) {
  return (
    <section aria-label={title} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "20px", color: "#0066CC" }}>{icon}</span>
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
          action={<Button size="small" onClick={retry}>Thử lại</Button>}
        />
      ) : items.length === 0 ? (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", textAlign: "center", border: "1px solid #E2E8F0" }}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={empty} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>{items.slice(0, 3).map(renderItem)}</Row>
      )}
    </section>
  );
}

function Discover() {
  const events = useGetEventsQuery();
  const resources = useGetResourcesQuery();
  const blogs = useGetBlogsQuery();
  const labs = useGetProjectLabsQuery();

  return (
    <main style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "48px", display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #004C99 0%, #0066CC 55%, #0080FF 100%)",
          borderRadius: "24px",
          padding: "32px",
          color: "#FFFFFF",
          boxShadow: "0 12px 32px -4px rgba(0, 102, 204, 0.25)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "700px", position: "relative", zIndex: 1 }}>
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                padding: "4px 14px",
                fontSize: "11px",
                fontWeight: 800,
                border: "1px solid rgba(255, 255, 255, 0.35)",
                backdropFilter: "blur(4px)",
              }}
            >
              <CompassOutlined style={{ color: "#FFD700" }} /> KHÁM PHÁ HỆ SINH THÁI DEVER
            </span>
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", margin: 0, lineHeight: 1.2 }}>
            Tài Nguyên, Sự Kiện & Cơ Hội Học Tập
          </h1>

          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.9)", margin: 0, lineHeight: 1.6 }}>
            Cập nhật liên tục các buổi Workshop, tài liệu chuyên môn, bài viết kỹ thuật và dự án nghiên cứu phát triển mở cho toàn bộ thành viên.
          </p>
        </div>
      </div>

      {/* Events Section */}
      <FeedSection
        title="Sự kiện & Workshop"
        icon={<CalendarOutlined />}
        loading={events.isLoading}
        error={events.isError}
        items={events.data?.data ?? []}
        empty="Chưa có sự kiện mới được công bố."
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
                <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.5 }}>
                  {item.description || "Thông tin chi tiết sẽ được Ban tổ chức cập nhật."}
                </p>
              </div>

              <div>
                {item.registerUrl ? (
                  <a href={item.registerUrl} target="_blank" rel="noreferrer">
                    <Button type="primary" icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Mở Google Form
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>Chưa mở đăng ký</span>
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
                <Tag color="cyan" style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}>
                  {item.type || "Tài liệu"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
                  {item.size || "Dung lượng chưa cập nhật"}
                </p>
              </div>

              <div>
                {item.fileUrl ? (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    <Button icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Mở tài liệu
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>Chưa có đường dẫn tải</span>
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
                <Tag color="geekblue" style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}>
                  {item.category || "DEVER Blog"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
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
                  color={item.status === "open" ? "green" : "default"}
                  style={{ borderRadius: "6px", fontWeight: 700, fontSize: "11px", marginBottom: "8px" }}
                >
                  {item.status === "open" ? "Đang tuyển" : item.status || "Project Lab"}
                </Tag>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#1E293B", margin: "4px 0" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#475569", margin: "8px 0 0 0", lineHeight: 1.5 }}>
                  {item.summary || "Thông tin tuyển dụng dự án do ban quản trị phụ trách."}
                </p>
              </div>

              <div>
                {item.contactUrl ? (
                  <a href={item.contactUrl} target="_blank" rel="noreferrer">
                    <Button type="primary" icon={<ExportOutlined />} style={{ borderRadius: "10px", fontWeight: 700, width: "100%" }}>
                      Liên hệ tham gia
                    </Button>
                  </a>
                ) : (
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>Chưa có kênh liên hệ</span>
                )}
              </div>
            </div>
          </Col>
        )}
      />
    </main>
  );
}

export default Discover;
