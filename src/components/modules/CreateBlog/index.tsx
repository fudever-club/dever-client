"use client";

import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  message,
  Divider,
  Tag,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  SendOutlined,
  PictureOutlined,
  CodeOutlined,
  LinkOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnorderedListOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useRouter } from "next-nprogress-bar";
import { useLocale } from "next-intl";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = [
  "Web & Frontend",
  "Backend & System",
  "Lập Trình Giải Thuật",
  "AI / Machine Learning",
  "Kinh Nghiệm CLB",
];

export function formatImageUrl(url: string): string {
  if (!url || url.includes("dever_blog_hero") || url.includes("dever_roadmap_banner") || url.includes("dever_project_lab")) {
    return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%2306101E'/><rect width='100%' height='100%' fill='url(%23g)'/><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%230066CC' stop-opacity='0.4'/><stop offset='100%' stop-color='%23004C99' stop-opacity='0.8'/></linearGradient></defs><circle cx='400' cy='225' r='120' fill='%230066CC' opacity='0.2'/><text x='50%' y='48%' font-family='sans-serif' font-weight='bold' font-size='28' fill='%23FFFFFF' text-anchor='middle'>FU-DEVER Member Blog</text><text x='50%' y='58%' font-family='sans-serif' font-size='16' fill='%2338BDF8' text-anchor='middle'>Official Member Article 2026</text></svg>";
  }
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  return url;
}

export default function CreateBlogModule() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const handleInsertTag = (tag: string) => {
    const updated = (content ? content + "\n" : "") + tag;
    setContent(updated);
    form.setFieldsValue({ content: updated });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";

    try {
      const res = await fetch(`${API_SERVER}/api/v1/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          category: values.category,
          excerpt: values.excerpt,
          content: values.content,
          coverImage: formatImageUrl(values.coverImage || coverUrl || "/images/dever_blog_hero.png"),
          author: {
            name: "Lê Đức Anh Phương",
            role: "Lead Developer",
            avatar: "https://i.ibb.co/TgXZgwv/445356269-973328174802658-3860307921523704298-n.jpg",
          },
        }),
      });

      const json = await res.json();
      if (json.status === "success") {
        message.success("🎉 Đăng bài viết Tech Blog thành công! Bài viết đã được lưu vào Database MongoDB.");
        router.push(`/${locale}/members`);
      } else {
        message.error("Có lỗi xảy ra khi xuất bản bài viết!");
      }
    } catch (err) {
      message.error("Không thể kết nối đến Express Backend API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <Card
        style={{
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(0,102,204,0.08)",
          border: "1px solid #e6f4ff",
        }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <Tag color="processing" style={{ borderRadius: 12, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
            ✍️ SÁNG TẠO NỘI DUNG FU-DEVER (MONGODB LIVE)
          </Tag>
          <Title level={2} style={{ margin: "12px 0 4px", color: "#0066CC" }}>
            Tạo Bài Viết Tech Blog Mới
          </Title>
          <Text type="secondary">
            Chia sẻ kiến thức lập trình, kinh nghiệm thi đấu và dự án thực tế cùng các thành viên CLB.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ category: "Web & Frontend" }}
        >
          <Row gutter={16}>
            <Col span={24} md={16}>
              <Form.Item
                label={<Text strong>Tiêu đề bài viết</Text>}
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề bài viết!" }]}
              >
                <Input
                  size="large"
                  placeholder="Ví dụ: Hướng dẫn làm chủ React Three Fiber trong 15 phút..."
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>
            </Col>

            <Col span={24} md={8}>
              <Form.Item
                label={<Text strong>Danh mục chủ đề</Text>}
                name="category"
                rules={[{ required: true }]}
              >
                <Select size="large" style={{ borderRadius: 10 }}>
                  {CATEGORIES.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<Text strong>Ảnh bìa bài viết (Cover Image URL)</Text>}
            name="coverImage"
            extra="Nhập URL ảnh bìa minh họa (Google Drive, Cloudinary, ImgBB, Unsplash...)"
          >
            <Input
              size="large"
              prefix={<PictureOutlined style={{ color: "#0066CC" }} />}
              placeholder="Dán link ảnh tại đây..."
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          {coverUrl && (
            <div
              style={{
                marginBottom: 24,
                borderRadius: 12,
                overflow: "hidden",
                maxHeight: 200,
                border: "1px solid #d9d9d9",
              }}
            >
              <img
                src={formatImageUrl(coverUrl)}
                alt="Cover Preview"
                style={{ width: "100%", objectFit: "cover" }}
                onError={() => setCoverUrl("")}
              />
            </div>
          )}

          <Form.Item
            label={<Text strong>Tóm tắt ngắn (Excerpt)</Text>}
            name="excerpt"
            rules={[{ required: true, message: "Vui lòng nhập tóm tắt ngắn!" }]}
          >
            <TextArea
              rows={2}
              placeholder="Nhập 2-3 câu tóm tắt gây ấn tượng cho người đọc..."
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          {/* Formatting Toolbar Header */}
          <div
            style={{
              background: "#F8FCFF",
              padding: "10px 14px",
              borderRadius: "10px 10px 0 0",
              border: "1px solid #d9d9d9",
              borderBottom: "none",
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Text type="secondary" style={{ fontSize: 12, marginRight: 8 }}>
              Công cụ định dạng:
            </Text>
            <Button
              size="small"
              icon={<BoldOutlined />}
              onClick={() => handleInsertTag("**Văn bản in đậm**")}
            >
              In đậm
            </Button>
            <Button
              size="small"
              icon={<ItalicOutlined />}
              onClick={() => handleInsertTag("*Văn bản in nghiêng*")}
            >
              Nghiêng
            </Button>
            <Button
              size="small"
              icon={<CodeOutlined />}
              onClick={() => handleInsertTag("```js\nconsole.log('Hello FU-DEVER!');\n```")}
            >
              Khối Code
            </Button>
            <Button
              size="small"
              icon={<LinkOutlined />}
              onClick={() => handleInsertTag("[Tên đường dẫn](https://fu-dever.com)")}
            >
              Chèn Link
            </Button>
            <Button
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => handleInsertTag("- Mục 1\n- Mục 2\n- Mục 3")}
            >
              Danh sách
            </Button>
          </div>

          <Form.Item
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết!" }]}
            style={{ marginBottom: 24 }}
          >
            <TextArea
              rows={12}
              placeholder="Viết nội dung bài viết kỹ thuật của bạn ở đây..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ borderRadius: "0 0 10px 10px", fontSize: 15, lineHeight: 1.6 }}
            />
          </Form.Item>

          <Divider style={{ margin: "24px 0" }} />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button size="large" onClick={() => router.back()} style={{ borderRadius: 10 }}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SendOutlined />}
              style={{
                borderRadius: 10,
                background: "linear-gradient(135deg, #0066CC 0%, #004C99 100%)",
                border: "none",
                fontWeight: 700,
                paddingLeft: 28,
                paddingRight: 28,
              }}
            >
              Đăng Bài Ngay 🚀
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
