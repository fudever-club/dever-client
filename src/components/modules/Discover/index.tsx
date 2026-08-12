"use client";

import type { ReactNode } from "react";
import { BookOutlined, CalendarOutlined, CompassOutlined, ExportOutlined, FileTextOutlined, RocketOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Empty, Row, Skeleton, Tag, Typography } from "antd";

import { useGetBlogsQuery, useGetEventsQuery, useGetProjectLabsQuery, useGetResourcesQuery } from "@/store/queries/ecosystem";

const { Title, Paragraph, Text } = Typography;

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

function FeedSection({ title, icon, loading, error, items, empty, renderItem, retry }: FeedSectionProps) {
  return <section aria-label={title} className="space-y-3">
    <div className="flex items-center gap-2"><span className="text-[#0066CC]">{icon}</span><Title level={2} className="!mb-0 !text-xl">{title}</Title></div>
    {loading ? <Row gutter={[16, 16]}>{Array.from({ length: 3 }).map((_, index) => <Col xs={24} md={8} key={index}><Card className="!rounded-2xl"><Skeleton active paragraph={{ rows: 3 }} /></Card></Col>)}</Row> : error ? <Alert type="error" showIcon message={`Không thể tải ${title.toLowerCase()}.`} action={<Button size="small" onClick={retry}>Thử lại</Button>} /> : items.length === 0 ? <Card className="!rounded-2xl"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={empty} /></Card> : <Row gutter={[16, 16]}>{items.slice(0, 3).map(renderItem)}</Row>}
  </section>;
}

function Discover() {
  const events = useGetEventsQuery();
  const resources = useGetResourcesQuery();
  const blogs = useGetBlogsQuery();
  const labs = useGetProjectLabsQuery();

  return <main className="mx-auto w-full max-w-7xl space-y-8 px-1 pb-4 sm:px-2">
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8">
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-[#0066CC]"><CompassOutlined /> Hệ sinh thái FU-DEVER</span>
      <Title level={1} className="!mb-2 !text-3xl !text-slate-950 sm:!text-4xl">Khám phá DEVER</Title>
      <Paragraph className="!mb-0 !max-w-2xl !text-slate-600">Sự kiện, tài liệu, bài viết và cơ hội Project Lab được quản trị viên cập nhật. Mọi vùng trống đều phản ánh dữ liệu hiện có, không dùng nội dung minh hoạ.</Paragraph>
    </section>

    <FeedSection title="Sự kiện" icon={<CalendarOutlined />} loading={events.isLoading} error={events.isError} items={events.data?.data ?? []} empty="Chưa có sự kiện được công bố." retry={events.refetch} renderItem={(item, index) => <Col xs={24} md={8} key={item._id || index}><Card className="h-full !rounded-2xl" title={<Tag color="blue">{item.status || "Sự kiện"}</Tag>}><Title level={4} className="!mt-0 !text-base">{item.title}</Title><Text type="secondary">{item.date || "Thời gian sẽ được cập nhật"}{item.time ? ` · ${item.time}` : ""}</Text><Paragraph className="!mb-4 !mt-3 !line-clamp-3 !text-sm !text-slate-600">{item.description || "Thông tin chi tiết sẽ được Ban tổ chức cập nhật."}</Paragraph>{item.registerUrl ? <a href={item.registerUrl} target="_blank" rel="noreferrer"><Button type="primary" icon={<ExportOutlined />}>Mở Google Form</Button></a> : <Text type="secondary">Chưa mở đăng ký</Text>}</Card></Col>} />

    <FeedSection title="Tài liệu và học tập" icon={<BookOutlined />} loading={resources.isLoading} error={resources.isError} items={resources.data?.data ?? []} empty="Chưa có tài liệu được xuất bản." retry={resources.refetch} renderItem={(item, index) => <Col xs={24} md={8} key={item._id || index}><Card className="h-full !rounded-2xl" title={<Tag color="cyan">{item.type || "Tài liệu"}</Tag>}><Title level={4} className="!mt-0 !text-base">{item.title}</Title><Paragraph className="!mb-4 !mt-3 !text-sm !text-slate-600">{item.size || "Dung lượng chưa được cập nhật"}</Paragraph>{item.fileUrl ? <a href={item.fileUrl} target="_blank" rel="noreferrer"><Button icon={<ExportOutlined />}>Mở tài liệu</Button></a> : <Text type="secondary">Chưa có đường dẫn tải</Text>}</Card></Col>} />

    <FeedSection title="Bài viết kỹ thuật" icon={<FileTextOutlined />} loading={blogs.isLoading} error={blogs.isError} items={blogs.data?.data ?? []} empty="Chưa có bài viết được xuất bản." retry={blogs.refetch} renderItem={(item, index) => <Col xs={24} md={8} key={item._id || index}><Card className="h-full !rounded-2xl" title={<Tag color="geekblue">{item.category || "DEVER Blog"}</Tag>}><Title level={4} className="!mt-0 !text-base">{item.title}</Title><Paragraph className="!mb-0 !mt-3 !line-clamp-3 !text-sm !text-slate-600">{item.excerpt || "Bài viết được xuất bản bởi Ban quản trị FU-DEVER."}</Paragraph></Card></Col>} />

    <FeedSection title="Project Lab" icon={<RocketOutlined />} loading={labs.isLoading} error={labs.isError} items={labs.data?.data ?? []} empty="Chưa có dự án đang tuyển thành viên." retry={labs.refetch} renderItem={(item, index) => <Col xs={24} md={8} key={item._id || index}><Card className="h-full !rounded-2xl" title={<Tag color={item.status === "open" ? "green" : "default"}>{item.status === "open" ? "Đang tuyển" : item.status || "Project Lab"}</Tag>}><Title level={4} className="!mt-0 !text-base">{item.title}</Title><Paragraph className="!mb-4 !mt-3 !line-clamp-3 !text-sm !text-slate-600">{item.summary || "Thông tin dự án sẽ được quản trị viên cập nhật."}</Paragraph>{item.contactUrl ? <a href={item.contactUrl} target="_blank" rel="noreferrer"><Button type="primary" icon={<ExportOutlined />}>Liên hệ tham gia</Button></a> : <Text type="secondary">Chưa có kênh liên hệ</Text>}</Card></Col>} />
  </main>;
}

export default Discover;
