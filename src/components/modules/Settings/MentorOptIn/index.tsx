"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SolutionOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Select, Skeleton, Switch, Typography, message } from "antd";

import { useTranslation } from "@/app/i18n/client";
import { endpointAlumni } from "@/helpers/enpoints";
import { apiClient } from "@/utils/apiClient";
import { MENTOR_TOPIC_OPTIONS } from "@/components/modules/Mentorship/MentorRequestModal";

import * as S from "./styles";

interface MentorProfile {
  name?: string;
  isMentor: boolean;
  isPublished: boolean;
  mentoringTopics: string[];
}

const ALLOWED_TOPICS = MENTOR_TOPIC_OPTIONS.map((option) => option.value);

function normalizeTopics(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).map((topic) => String(topic)).filter((topic) => ALLOWED_TOPICS.includes(topic));
}

function MentorOptIn() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");
  const [phase, setPhase] = useState<"loading" | "ready" | "error" | "hidden">("loading");
  const [profileName, setProfileName] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [isMentor, setIsMentor] = useState<boolean>(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);

  const fetchProfile = useCallback(async () => {
    setPhase("loading");
    try {
      const res = await apiClient.get<unknown>(endpointAlumni.MENTOR_PROFILE);
      if (res.status === 404) {
        setPhase("hidden");
        return;
      }
      if (!res.ok || res.data == null) {
        throw new Error(res.error || "Request failed");
      }
      const raw = ((res.data as { data?: unknown })?.data ?? res.data) as Partial<MentorProfile>;
      setProfileName(typeof raw.name === "string" ? raw.name : "");
      setIsPublished(raw.isPublished === true);
      setIsMentor(raw.isMentor === true);
      setTopics(normalizeTopics(raw.mentoringTopics));
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.get<unknown>(endpointAlumni.MENTOR_PROFILE);
        if (cancelled) return;
        if (res.status === 404) {
          setPhase("hidden");
          return;
        }
        if (!res.ok || res.data == null) {
          throw new Error(res.error || "Request failed");
        }
        const raw = ((res.data as { data?: unknown })?.data ?? res.data) as Partial<MentorProfile>;
        setProfileName(typeof raw.name === "string" ? raw.name : "");
        setIsPublished(raw.isPublished === true);
        setIsMentor(raw.isMentor === true);
        setTopics(normalizeTopics(raw.mentoringTopics));
        setPhase("ready");
      } catch {
        if (!cancelled) setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchProfile]);

  const handleSave = async () => {
    if (saving || phase !== "ready") return;
    const cleanTopics = normalizeTopics(topics);
    setSaving(true);
    try {
      const res = await apiClient.patch<unknown>(endpointAlumni.MENTOR_PROFILE, {
        isMentor,
        mentoringTopics: cleanTopics,
      });
      if (!res.ok || res.data == null) {
        throw new Error(res.error || "Request failed");
      }
      const raw = ((res.data as { data?: unknown })?.data ?? res.data) as Partial<MentorProfile>;
      if (typeof raw.isMentor === "boolean") setIsMentor(raw.isMentor);
      if (typeof raw.isPublished === "boolean") setIsPublished(raw.isPublished);
      if (raw.mentoringTopics !== undefined) setTopics(normalizeTopics(raw.mentoringTopics));
      message.success(t("mentorSaveSuccess", "Đã cập nhật nguyện vọng làm mentor."));
    } catch {
      message.error(t("mentorSaveError", "Chưa thể lưu nguyện vọng làm mentor. Vui lòng thử lại."));
    } finally {
      setSaving(false);
    }
  };

  if (phase === "hidden") return null;

  return (
    <S.ContainerWrapper aria-labelledby="mentor-optin-heading">
      <Card bordered={false} className="mentor-optin-card">
        {phase === "loading" ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : phase === "error" ? (
          <Alert
            showIcon
            type="error"
            message={t("mentorLoadErrorTitle", "Không tải được nguyện vọng làm mentor")}
            description={t("mentorLoadError", "Chưa thể tải hồ sơ mentor của bạn. Vui lòng thử lại.")}
            action={
              <Button size="middle" onClick={fetchProfile} className="min-h-[44px]">
                {t("mentorRetry", "Thử lại")}
              </Button>
            }
          />
        ) : (
          <S.ContentWrapper>
            <S.HeadingRow>
              <S.IconWrap aria-hidden="true">
                <SolutionOutlined />
              </S.IconWrap>
              <div>
                <Typography.Title id="mentor-optin-heading" level={3} style={{ marginBottom: 4 }}>
                  {t("mentorTitle", "Làm mentor")}
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t(
                    "mentorSubtitle",
                    profileName
                      ? `Chào ${profileName}, bật công tắc khi bạn sẵn sàng đồng hành cùng đàn em DEVER.`
                      : "Bật công tắc khi bạn sẵn sàng đồng hành cùng đàn em DEVER."
                  )}
                </Typography.Paragraph>
              </div>
            </S.HeadingRow>

            <S.SwitchRow>
              <S.SwitchText>
                <S.SwitchTitle>{t("mentorSwitchTitle", "Sẵn sàng làm mentor")}</S.SwitchTitle>
                <S.SwitchDesc>
                  {t("mentorSwitchDesc", "Tắt bất cứ lúc nào nếu bạn tạm thời bận.")}
                </S.SwitchDesc>
              </S.SwitchText>
              <S.SwitchHitArea>
                <Switch
                  checked={isMentor}
                  loading={saving}
                  disabled={saving}
                  checkedChildren={t("mentorOn", "Bật")}
                  unCheckedChildren={t("mentorOff", "Tắt")}
                  onChange={setIsMentor}
                  aria-label={t("mentorSwitchTitle", "Sẵn sàng làm mentor")}
                  style={{ backgroundColor: isMentor ? "#0066CC" : "#94a3b8" }}
                />
              </S.SwitchHitArea>
            </S.SwitchRow>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <S.TopicsLabel>{t("mentorTopicsLabel", "Chủ đề có thể cố vấn (chọn trong 6 chủ đề)")}</S.TopicsLabel>
              <Select
                mode="multiple"
                value={topics}
                onChange={(next) => setTopics(normalizeTopics(next))}
                options={MENTOR_TOPIC_OPTIONS}
                placeholder={t("mentorTopicsPlaceholder", "Chọn các chủ đề bạn sẵn sàng chia sẻ...")}
                disabled={saving || !isMentor}
                maxTagCount="responsive"
              />
            </div>

            <Alert
              showIcon
              type={isPublished ? "success" : "info"}
              message={
                isPublished
                  ? t("mentorPublishedTitle", "Hồ sơ mentor đã xuất bản")
                  : t("mentorPendingTitle", "Chờ admin duyệt xuất bản")
              }
              description={t(
                "mentorAdminNote",
                "Bạn chỉ bật/tắt nguyện vọng và chọn chủ đề. Việc xuất bản lên danh sách mentor do admin duyệt."
              )}
              style={{ borderRadius: 8 }}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button
                type="primary"
                size="large"
                loading={saving}
                disabled={saving}
                onClick={handleSave}
                style={{ minWidth: 180, height: 42, fontWeight: 600, background: "#0066CC", borderRadius: 8 }}
              >
                {saving ? t("mentorSaving", "Đang lưu…") : t("mentorSave", "Lưu nguyện vọng")}
              </Button>
              <S.LiveRegion role="status" aria-live="polite">
                {saving ? t("mentorSaving", "Đang lưu…") : ""}
              </S.LiveRegion>
            </div>
          </S.ContentWrapper>
        )}
      </Card>
    </S.ContainerWrapper>
  );
}

export default MentorOptIn;
