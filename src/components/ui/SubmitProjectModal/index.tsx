"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, message } from "antd";
import { Code2, Globe, Send, Sparkles } from "lucide-react";
import { GithubOutlined } from "@ant-design/icons";
import { useSubmitOpenSourceProjectMutation } from "@/store/queries/ecosystem";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SubmitProjectModal({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const [submitProject, { isLoading }] = useSubmitOpenSourceProjectMutation();

  const handleFinish = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        githubUrl: values.githubUrl,
        demoUrl: values.demoUrl || "",
        category: values.category || "Web App",
        tags: values.tags ? values.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      };

      const res = await submitProject(payload).unwrap();
      message.success(res?.message || "Đã gửi dự án thành công! Nhận +150 EXP khi được duyệt.");
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err?.data?.message || "Lỗi khi gửi dự án");
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
          <Code2 className="h-5 w-5 text-[#0066CC]" /> Đóng Góp Dự Án Mã Nguồn Mở
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      centered
      className="rounded-3xl"
    >
      <div className="mb-4 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="font-semibold text-[#0066CC] flex items-center gap-1 mb-0.5">
          <Sparkles className="h-3.5 w-3.5" /> Phần thưởng đóng góp:
        </span>
        Nhận ngay <strong>+150 EXP</strong> và mở khóa huy hiệu <strong>Core Contributor</strong> khi dự án được Ban Quản Trị duyệt xuất bản lên hệ sinh thái FU-DEVER.
      </div>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={<span className="text-xs font-bold text-slate-700">Tên Dự Án</span>}
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
        >
          <Input placeholder="Ví dụ: fptu-timetable-extension" className="rounded-xl py-2 text-xs" />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold text-slate-700">Mô Tả Ngắn</span>}
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả dự án" }]}
        >
          <TextArea
            rows={3}
            placeholder="Mô tả mục đích dự án, công nghệ sử dụng và tính năng nổi bật..."
            className="rounded-xl text-xs"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold text-slate-700">Đường Dẫn GitHub Repository</span>}
          name="githubUrl"
          rules={[
            { required: true, message: "Vui lòng nhập link GitHub repo" },
            { type: "url", message: "Đường dẫn không hợp lệ" },
          ]}
        >
          <Input
            prefix={<GithubOutlined className="text-slate-400 mr-1" />}
            placeholder="https://github.com/your-username/repo-name"
            className="rounded-xl py-2 text-xs"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-xs font-bold text-slate-700">Demo Link (Nếu có)</span>}
          name="demoUrl"
        >
          <Input
            prefix={<Globe className="h-3.5 w-3.5 text-slate-400 mr-1" />}
            placeholder="https://your-demo-website.vercel.app"
            className="rounded-xl py-2 text-xs"
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Form.Item
            label={<span className="text-xs font-bold text-slate-700">Chuyên Mục</span>}
            name="category"
            initialValue="Web App"
          >
            <Select className="rounded-xl text-xs">
              <Option value="Web App">Web App</Option>
              <Option value="Mobile App">Mobile App</Option>
              <Option value="CLI Tool">CLI Tool</Option>
              <Option value="Browser Extension">Browser Extension</Option>
              <Option value="AI & Machine Learning">AI & Machine Learning</Option>
              <Option value="DevOps & Tooling">DevOps & Tooling</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-xs font-bold text-slate-700">Tags (Ngăn cách bằng dấu phẩy)</span>}
            name="tags"
            initialValue="React, TypeScript, OpenSource"
          >
            <Input placeholder="React, TypeScript, Node.js" className="rounded-xl py-2 text-xs" />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button onClick={onClose} className="rounded-xl text-xs">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            icon={<Send className="h-3.5 w-3.5" />}
            className="rounded-xl bg-[#0066CC] hover:!bg-[#004C99] text-xs font-bold"
          >
            Gửi Duyệt Dự Án
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
