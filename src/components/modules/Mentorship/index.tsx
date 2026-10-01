"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Tabs,
  Tag,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  ReloadOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { apiClient } from "@/utils/apiClient";
import { endpointMentorship } from "@/helpers/enpoints";
import { useTranslation } from "@/app/i18n/client";
import MentorRequestModal from "./MentorRequestModal";
import {
  getMentorIdOf,
  getMentorNameOf,
  toArray,
  type Mentor,
  type MentorshipRequest,
  type MentorshipRequestStatus,
} from "./types";

const STATUS_META: Record<MentorshipRequestStatus, { color: string; icon: React.ReactNode }> = {
  pending: { color: "gold", icon: <ClockCircleOutlined /> },
  accepted: { color: "green", icon: <CheckCircleOutlined /> },
  declined: { color: "red", icon: <CloseCircleOutlined /> },
};

function statusLabel(status: MentorshipRequestStatus, t: (key: string, fallback: string) => string): string {
  if (status === "accepted") return t("statusAccepted", "Đã chấp nhận");
  if (status === "declined") return t("statusDeclined", "Đã từ chối");
  return t("statusPending", "Đang chờ");
}

function MentorAvatar({ mentor }: { mentor: Mentor }) {
  const [broken, setBroken] = useState<boolean>(false);
  return (
    <Avatar
      size={56}
      src={!broken && mentor.avatar ? mentor.avatar : undefined}
      icon={<UserOutlined />}
      alt={mentor.name}
      onError={() => {
        setBroken(true);
        return true;
      }}
    />
  );
}

function MentorsTab({
  mentors,
  loading,
  error,
  pendingMentorIds,
  onRetry,
  onConnect,
}: {
  mentors: Mentor[];
  loading: boolean;
  error: boolean;
  pendingMentorIds: Set<string>;
  onRetry: () => void;
  onConnect: (mentor: Mentor) => void;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "mentorship");
  if (loading) {
    return (
      <Row gutter={[16, 16]} aria-busy="true" aria-label={t("loadingMentors", "Đang tải danh sách mentor")}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card bordered={false} style={{ borderRadius: 16 }}>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message={t("mentorsErrorTitle", "Không thể tải danh sách mentor.")}
        description={t("mentorsErrorDesc", "Kiểm tra kết nối mạng rồi thử lại.")}
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
            {t("retry", "Thử lại")}
          </Button>
        }
      />
    );
  }

  if (mentors.length === 0) {
    return (
      <Card bordered={false} style={{ borderRadius: 16, textAlign: "center", padding: "32px 16px" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("emptyMentors", "Chưa có mentor nào trong mạng lưới. Hãy quay lại sau.")}
        />
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {mentors.map((mentor) => {
        const hasPending = pendingMentorIds.has(mentor._id);
        return (
          <Col xs={24} sm={12} lg={8} key={mentor._id}>
            <Card
              bordered={false}
              hoverable
              style={{ borderRadius: 16, height: "100%", border: "1px solid #E2E8F0" }}
              styles={{ body: { display: "flex", flexDirection: "column", gap: 12, height: "100%" } }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <MentorAvatar mentor={mentor} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    {mentor.name}
                  </h3>
                  <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                    {mentor.headline || t("fallbackHeadline", "Mentor DEVER")}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0 0" }}>
                    {[mentor.workplace, mentor.graduationGen].filter(Boolean).join(" · ") || t("fallbackNetwork", "Mạng lưới cựu thành viên")}
                  </p>
                </div>
              </div>

              {mentor.quote && (
                <p style={{ fontSize: 13, color: "#334155", fontStyle: "italic", margin: 0 }}>
                  “{mentor.quote}”
                </p>
              )}

              {(mentor.mentoringTopics ?? []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(mentor.mentoringTopics ?? []).map((topic) => (
                    <Tag key={topic} color="blue" style={{ borderRadius: 6, marginRight: 0 }}>
                      {topic}
                    </Tag>
                  ))}
                </div>
              )}

              <div style={{ marginTop: "auto", paddingTop: 4 }}>
                <Button
                  type="primary"
                  block
                  icon={<SendOutlined />}
                  disabled={hasPending}
                  onClick={() => onConnect(mentor)}
                  style={{ borderRadius: 10, background: "#0066CC", fontWeight: 700 }}
                >
                  {hasPending ? t("pendingRequest", "Đã có yêu cầu đang chờ") : t("connect", "Xin kết nối")}
                </Button>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

function MyRequestsTab({
  requests,
  loading,
  error,
  onRetry,
}: {
  requests: MentorshipRequest[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "mentorship");
  if (loading) {
    return (
      <Card bordered={false} style={{ borderRadius: 16 }} aria-busy="true" aria-label={t("loadingRequests", "Đang tải yêu cầu của tôi")}>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message={t("requestsErrorTitle", "Không thể tải yêu cầu của bạn.")}
        description={t("requestsErrorDesc", "Vui lòng đăng nhập rồi thử lại.")}
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
            {t("retry", "Thử lại")}
          </Button>
        }
      />
    );
  }

  if (requests.length === 0) {
    return (
      <Card bordered={false} style={{ borderRadius: 16, textAlign: "center", padding: "32px 16px" }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t("emptyRequests", "Bạn chưa gửi yêu cầu kết nối nào. Chọn một mentor ở tab bên cạnh để bắt đầu.")}
        />
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {requests.map((request) => {
        const meta = STATUS_META[request.status] ?? STATUS_META.pending;
        return (
          <Card key={request._id} bordered={false} style={{ borderRadius: 16, border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                  {getMentorNameOf(request)}
                </div>
                {request.topic && (
                  <div style={{ marginTop: 4 }}>
                    <Tag color="blue" style={{ borderRadius: 6, marginRight: 0 }}>{request.topic}</Tag>
                  </div>
                )}
                {request.message && (
                  <p style={{ fontSize: 13, color: "#475569", margin: "8px 0 0 0" }}>{request.message}</p>
                )}
              </div>
              <Tag color={meta.color} icon={meta.icon} style={{ borderRadius: 6, flexShrink: 0 }}>
                {statusLabel(request.status, t)}
              </Tag>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function MentorshipSection() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "mentorship");
  const [activeTab, setActiveTab] = useState<string>("mentors");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorsLoading, setMentorsLoading] = useState<boolean>(true);
  const [mentorsError, setMentorsError] = useState<boolean>(false);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState<boolean>(false);
  const [requestsError, setRequestsError] = useState<boolean>(false);
  const [requestsLoaded, setRequestsLoaded] = useState<boolean>(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const fetchMentors = useCallback(async () => {
    setMentorsLoading(true);
    setMentorsError(false);
    try {
      const res = await apiClient.get(endpointMentorship.MENTORS, { skipAuth: true });
      if (res.ok) {
        setMentors(toArray<Mentor>(res.data));
      } else {
        setMentorsError(true);
      }
    } catch {
      setMentorsError(true);
    } finally {
      setMentorsLoading(false);
    }
  }, []);

  const fetchMyRequests = useCallback(async () => {
    setRequestsLoading(true);
    setRequestsError(false);
    try {
      const res = await apiClient.get(endpointMentorship.MY_REQUESTS);
      if (res.ok) {
        const payload = (res.data as { requests?: unknown; data?: unknown } | null) || null;
        setRequests(toArray<MentorshipRequest>(payload?.requests ?? res.data));
        setRequestsLoaded(true);
      } else {
        setRequestsError(true);
      }
    } catch {
      setRequestsError(true);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    if (activeTab === "requests" && !requestsLoaded && !requestsLoading) {
      fetchMyRequests();
    }
  }, [activeTab, requestsLoaded, requestsLoading, fetchMyRequests]);

  const pendingMentorIds = useMemo(
    () => new Set(requests.filter((r) => r.status === "pending").map(getMentorIdOf).filter(Boolean)),
    [requests],
  );

  const handleRequestSuccess = useCallback(() => {
    // Refresh "Yêu cầu của tôi" so the new pending request appears there.
    setRequestsLoaded(false);
    if (activeTab === "requests") fetchMyRequests();
    else {
      // Preload in background so the connect button flips to disabled state.
      fetchMyRequests();
    }
  }, [activeTab, fetchMyRequests]);

  return (
    <section aria-label={t("sectionLabel", "Mentor và cố vấn")}>
      <Card
        bordered={false}
        style={{ borderRadius: 20, border: "1px solid #E2E8F0" }}
        styles={{ body: { padding: 24 } }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22, color: "#0066CC" }}>
            <CrownOutlined />
          </span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            {t("heading", "Mentor & Cố vấn")}
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px 0" }}>
          {t("description", "Kết nối 1-1 với các anh/chị cựu thành viên để được định hướng sự nghiệp và kỹ năng thực chiến.")}
        </p>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "mentors",
              label: t("tabMentors", "Mentor & Cố vấn"),
              children: (
                <MentorsTab
                  mentors={mentors}
                  loading={mentorsLoading}
                  error={mentorsError}
                  pendingMentorIds={pendingMentorIds}
                  onRetry={fetchMentors}
                  onConnect={setSelectedMentor}
                />
              ),
            },
            {
              key: "requests",
              label: t("tabRequests", "Yêu cầu của tôi"),
              children: (
                <MyRequestsTab
                  requests={requests}
                  loading={requestsLoading}
                  error={requestsError}
                  onRetry={fetchMyRequests}
                />
              ),
            },
          ]}
        />
      </Card>

      <MentorRequestModal
        open={selectedMentor !== null}
        mentor={selectedMentor}
        onClose={() => setSelectedMentor(null)}
        onSuccess={handleRequestSuccess}
      />
    </section>
  );
}
