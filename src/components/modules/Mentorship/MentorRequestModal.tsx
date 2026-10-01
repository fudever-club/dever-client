"use client";

import React, { useEffect, useState } from "react";
import { Avatar, Button, Form, Input, Modal, Select, Typography, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { apiClient } from "@/utils/apiClient";
import { endpointMentorship } from "@/helpers/enpoints";
import type { Mentor } from "./types";

const { TextArea } = Input;
const { Text } = Typography;

// TODO(i18n): share this list from a single source instead of copying AlumniAdvisoryModal.
// Copied values from AlumniAdvisoryModal (MENTOR_TOPIC_OPTIONS) so the request
// topic matches one of the 6 backend-accepted mentoring topics.
export const MENTOR_TOPIC_OPTIONS = [
  { label: "Thuật toán & Luyện phỏng vấn Big Tech", value: "Thuật toán & Phỏng vấn" },
  { label: "Phát triển Web / Mobile Fullstack", value: "Web & Mobile" },
  { label: "Trí tuệ nhân tạo (AI) & Data Science", value: "AI & Machine Learning" },
  { label: "Cloud Computing, DevOps & CI/CD", value: "DevOps & Cloud" },
  { label: "Định hướng OJT, Viết CV & Phỏng vấn", value: "Định hướng OJT & CV" },
  { label: "Kỹ năng mềm, Quản lý dự án Agile", value: "Quản lý Dự án & Kỹ năng" },
];

const MESSAGE_MAX_LENGTH = 500;

interface MentorRequestModalProps {
  open: boolean;
  mentor: Mentor | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MentorRequestModal({ open, mentor, onClose, onSuccess }: MentorRequestModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [avatarBroken, setAvatarBroken] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setAvatarBroken(false);
    }
  }, [open, mentor?._id, form]);

  if (!mentor && !open) return null;

  const handleSubmit = async (values: { topic: string; message: string }) => {
    if (!mentor) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post(endpointMentorship.MENTOR_REQUEST(mentor._id), {
        topic: values.topic,
        message: values.message?.trim(),
      });
      if (res.ok) {
        // TODO(i18n): localize success toast.
        message.success("Đã gửi yêu cầu kết nối tới mentor. Mentor sẽ phản hồi sớm nhất có thể.");
        if (onSuccess) onSuccess();
        onClose();
      } else if (res.status === 409) {
        // TODO(i18n): localize duplicate-request notice.
        message.warning("Bạn đã có yêu cầu đang chờ với mentor này.");
      } else {
        const err = (res.data as { message?: string } | null) || {};
        message.error(err.message || "Gửi yêu cầu thất bại. Vui lòng thử lại.");
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
      onCancel={submitting ? undefined : onClose}
      footer={null}
      width="min(560px, 95vw)"
      centered
      title="Xin kết nối Mentor"
      destroyOnClose
    >
      {mentor && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Avatar
            size={48}
            src={!avatarBroken && mentor.avatar ? mentor.avatar : undefined}
            icon={<UserOutlined />}
            alt={mentor.name}
            onError={() => {
              setAvatarBroken(true);
              return true;
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#0F172A" }}>{mentor.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {[mentor.headline, mentor.workplace].filter(Boolean).join(" · ") || "Mentor DEVER"}
            </Text>
          </div>
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit} preserve={false}>
        <Form.Item
          name="topic"
          label="Chủ đề muốn được cố vấn"
          rules={[{ required: true, message: "Vui lòng chọn 1 chủ đề cố vấn" }]}
        >
          <Select
            placeholder="Chọn 1 trong 6 chủ đề mentoring"
            options={MENTOR_TOPIC_OPTIONS}
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label="Lời nhắn tới mentor"
          rules={[
            { required: true, message: "Vui lòng nhập lời nhắn giới thiệu bản thân" },
            { max: MESSAGE_MAX_LENGTH, message: `Lời nhắn tối đa ${MESSAGE_MAX_LENGTH} ký tự` },
          ]}
        >
          <TextArea
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            showCount
            placeholder="Giới thiệu ngắn gọn về bạn và điều bạn muốn được mentor hỗ trợ (tối đa 500 ký tự)..."
            disabled={submitting}
          />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue, getFieldsError }) => {
            const topic = getFieldValue("topic");
            const msg = (getFieldValue("message") || "").trim();
            const hasError = getFieldsError().some((f) => f.errors.length > 0);
            const disabled = submitting || !topic || msg.length === 0 || msg.length > MESSAGE_MAX_LENGTH || hasError;
            return (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
                <Button onClick={onClose} disabled={submitting}>
                  Để sau
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={disabled}
                  style={{ background: "#0066CC" }}
                >
                  Gửi yêu cầu kết nối
                </Button>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
}
