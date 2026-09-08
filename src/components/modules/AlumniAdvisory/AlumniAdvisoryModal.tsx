"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
} from "antd";
import {
  CrownOutlined,
  BankOutlined,
  IdcardOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";

const { TextArea } = Input;

const MENTOR_TOPIC_OPTIONS = [
  { label: "Thuật toán & Luyện phỏng vấn Big Tech", value: "Thuật toán & Phỏng vấn" },
  { label: "Phát triển Web / Mobile Fullstack", value: "Web & Mobile" },
  { label: "Trí tuệ nhân tạo (AI) & Data Science", value: "AI & Machine Learning" },
  { label: "Cloud Computing, DevOps & CI/CD", value: "DevOps & Cloud" },
  { label: "Định hướng OJT, Viết CV & Phỏng vấn", value: "Định hướng OJT & CV" },
  { label: "Kỹ năng mềm, Quản lý dự án Agile", value: "Quản lý Dự án & Kỹ năng" },
];

const GEN_OPTIONS = [
  { label: "Gen 1", value: "Gen 1" },
  { label: "Gen 2", value: "Gen 2" },
  { label: "Gen 3", value: "Gen 3" },
  { label: "Gen 4", value: "Gen 4" },
  { label: "Gen 5", value: "Gen 5" },
  { label: "Gen 6", value: "Gen 6" },
  { label: "Gen 7", value: "Gen 7" },
  { label: "Gen 8", value: "Gen 8" },
  { label: "Gen 9", value: "Gen 9" },
  { label: "Gen 10", value: "Gen 10" },
];

interface AlumniAdvisoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AlumniAdvisoryModal({ open, onClose, onSuccess }: AlumniAdvisoryModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [alumniData, setAlumniData] = useState<any>(null);

  const apiServer = constants.API_SERVER;

  // Check current status
  useEffect(() => {
    if (!open) return;
    const fetchStatus = async () => {
      try {
        const token = webStorageClient.getToken();
        const res = await fetch(`${apiServer}/api/v1/alumni/advisory-invitation-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.isJoined) {
            setIsJoined(true);
            setAlumniData(json.data?.alumni);
            form.setFieldsValue({
              graduationGen: json.data?.alumni?.graduationGen,
              headline: json.data?.alumni?.headline,
              workplace: json.data?.alumni?.workplace,
              mentoringTopics: json.data?.alumni?.mentoringTopics,
              quote: json.data?.alumni?.quote,
              profileUrl: json.data?.alumni?.profileUrl,
            });
          }
        }
      } catch {}
    };
    fetchStatus();
  }, [open, apiServer, form]);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const token = webStorageClient.getToken();
      const res = await fetch(`${apiServer}/api/v1/alumni/accept-advisory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success("Trân trọng cảm ơn Anh/Chị! Sự đồng hành của Anh/Chị là niềm vinh dự và nguồn cảm hứng to lớn cho các thế hệ đàn em DEVER.");
        setIsJoined(true);
        if (onSuccess) onSuccess();
        setTimeout(() => onClose(), 1500);
      } else {
        const err = await res.json();
        message.error(err.message || "Xử lý thất bại.");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      className="rounded-3xl overflow-hidden"
    >
      <div className="pt-2 pb-4 space-y-6">
        {/* Crown & Royal Invitation Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#003B73] via-[#004C99] to-[#0066CC] p-6 text-white text-center shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <CrownOutlined style={{ fontSize: "160px" }} />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 tracking-wider">
              <CrownOutlined className="text-amber-300" />
              <span>THƯ MỜI DANH DỰ TỪ BAN CHỦ NHIỆM</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
              Hội Đồng Cố Vấn &amp; Mạng Lưới Cựu Thành Viên
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed pt-1 font-normal">
              Thân gửi Anh/Chị Cựu Thành Viên FU-DEVER, Ban Chủ nhiệm trân trọng kính mời Anh/Chị cùng tham gia mạng lưới Cố vấn Danh dự — nơi kết nối các thế hệ lập trình viên DEVER, cùng chia sẻ kinh nghiệm thực chiến, tiếp lửa tri thức và định hướng tương lai cho các thế hệ đàn em tiếp nối.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="space-y-3"
          initialValues={{
            graduationGen: "Gen 5",
            headline: "Software Engineer",
            workplace: "Tech Enterprise",
            mentoringTopics: ["Định hướng OJT & CV", "Web & Mobile"],
            quote: "Tự hào đồng hành và tiếp lửa cho các thế hệ lập trình viên FU-DEVER!",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="graduationGen"
              label={<span className="text-xs font-bold text-slate-700">Thế hệ (Gen)</span>}
              rules={[{ required: true, message: "Vui lòng chọn thế hệ Gen của Anh/Chị" }]}
            >
              <Select options={GEN_OPTIONS} className="rounded-xl text-xs" />
            </Form.Item>

            <Form.Item
              name="workplace"
              label={<span className="text-xs font-bold text-slate-700">Nơi công tác / Doanh nghiệp hiện tại</span>}
              rules={[{ required: true, message: "Nhập nơi công tác hiện tại" }]}
            >
              <Input prefix={<BankOutlined className="text-slate-400" />} placeholder="Ví dụ: Google, VNG, FPT Software, Grab, Viettel..." className="rounded-xl text-xs" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="headline"
              label={<span className="text-xs font-bold text-slate-700">Chức danh / Vị trí chuyên môn</span>}
              rules={[{ required: true, message: "Nhập chức danh chuyên môn" }]}
            >
              <Input prefix={<IdcardOutlined className="text-slate-400" />} placeholder="Ví dụ: Senior Software Engineer, Tech Lead, AI Engineer..." className="rounded-xl text-xs" />
            </Form.Item>

            <Form.Item
              name="profileUrl"
              label={<span className="text-xs font-bold text-slate-700">Đường dẫn liên kết cá nhân</span>}
              tooltip="Bất kỳ đường link nào để kết nối cùng Anh/Chị (Website, Portfolio, LinkedIn, GitHub, Facebook...)"
            >
              <Input prefix={<LinkOutlined className="text-[#0066CC]" />} placeholder="https://... (Website, Portfolio, Mạng xã hội)" className="rounded-xl text-xs" />
            </Form.Item>
          </div>

          <Form.Item
            name="mentoringTopics"
            label={<span className="text-xs font-bold text-slate-700">Lĩnh vực sẵn sàng Cố vấn / Chia sẻ kinh nghiệm</span>}
            rules={[{ required: true, message: "Chọn ít nhất 1 chủ đề" }]}
          >
            <Select
              mode="multiple"
              options={MENTOR_TOPIC_OPTIONS}
              placeholder="Chọn các lĩnh vực thế mạnh Anh/Chị sẵn sàng chia sẻ..."
              className="rounded-xl text-xs"
            />
          </Form.Item>

          <Form.Item
            name="quote"
            label={<span className="text-xs font-bold text-slate-700">Lời nhắn nhủ gửi thế hệ tiếp nối</span>}
          >
            <TextArea
              rows={3}
              placeholder="Chia sẻ một lời khuyên chân thành, kinh nghiệm thực chiến hoặc lời chúc gửi tới thế hệ đàn em..."
              className="rounded-xl text-xs"
            />
          </Form.Item>

          {/* CTA Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button onClick={onClose} className="rounded-xl text-xs font-semibold px-4 cursor-pointer">
              Để Tôi Suy Nghĩ Thêm
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              className="bg-[#0066CC] hover:bg-[#004C99] rounded-xl font-bold text-xs shadow-md h-10 px-6 active:scale-[0.98] transition-all cursor-pointer"
            >
              {isJoined ? "Cập Nhật Hồ Sơ Cố Vấn" : "Trân Trọng Nhận Lời & Đồng Hành"}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
