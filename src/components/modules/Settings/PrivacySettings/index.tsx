"use client";

import {
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Skeleton, Switch, Typography, message, Tag } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";
import { ProfileVisibility, UserInfo } from "@/helpers/types/userTypes";
import { useUpdateUserProfileMutation } from "@/store/queries/settings";

import * as S from "./styles";

interface IProps {
  isUserProfileLoading: boolean;
  userData: UserInfo;
}

type VisibilityKey = keyof ProfileVisibility;

const visibilityGroups: {
  titleKey: string;
  hintKey: string;
  icon: string;
  fields: { key: VisibilityKey; label: string }[];
}[] = [
  {
    titleKey: "privacyGroupContact",
    hintKey: "privacyGroupContactHint",
    icon: "📞",
    fields: [
      { key: "phone", label: "visibilityPhone" },
      { key: "email", label: "visibilityEmail" },
      { key: "MSSV", label: "visibilityStudentId" },
      { key: "dob", label: "visibilityBirthday" },
      { key: "hometown", label: "visibilityHometown" },
    ],
  },
  {
    titleKey: "privacyGroupCareer",
    hintKey: "privacyGroupCareerHint",
    icon: "💼",
    fields: [
      { key: "job", label: "visibilityJob" },
      { key: "workplace", label: "visibilityWorkplace" },
      { key: "school", label: "visibilitySchool" },
      { key: "skills", label: "visibilitySkills" },
      { key: "favourites", label: "visibilityFavourites" },
    ],
  },
  {
    titleKey: "privacyGroupActivity",
    hintKey: "privacyGroupActivityHint",
    icon: "🌐",
    fields: [
      { key: "nickname", label: "visibilityNickname" },
      { key: "description", label: "visibilityAbout" },
      { key: "socials", label: "visibilitySocials" },
      { key: "leetcode", label: "visibilityLeetcode" },
    ],
  },
];

const allFields = visibilityGroups.flatMap((g) => g.fields);

const getPrivateDefaults = (): ProfileVisibility =>
  allFields.reduce<ProfileVisibility>((visibility, field) => {
    visibility[field.key] = false;
    return visibility;
  }, {});

function PrivacySettings({ isUserProfileLoading, userData }: IProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const [visibility, setVisibility] = useState<ProfileVisibility>(getPrivateDefaults);

  useEffect(() => {
    setVisibility({
      ...getPrivateDefaults(),
      ...(userData?.profileVisibility ?? {}),
    });
  }, [userData?.profileVisibility]);

  const updateVisibility = (key: VisibilityKey, checked: boolean) => {
    setVisibility((current) => ({ ...current, [key]: checked }));
  };

  const saveVisibility = async () => {
    try {
      await updateUserProfile({ profileVisibility: visibility }).unwrap();
      message.success(t("privacySaveSuccess"));
    } catch {
      message.error(t("privacySaveError"));
    }
  };

  return (
    <S.ContainerWrapper aria-labelledby="privacy-settings-heading">
      <Card bordered={false} className="privacy-settings-card">
        {isUserProfileLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <S.ContentWrapper>
            <S.HeadingRow>
              <S.IconWrap aria-hidden="true">
                <SafetyCertificateOutlined />
              </S.IconWrap>
              <div>
                <Typography.Title id="privacy-settings-heading" level={3} style={{ marginBottom: 4 }}>
                  {t("privacyTitle")}
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t("privacyDescription")}
                </Typography.Paragraph>
              </div>
            </S.HeadingRow>

            <Alert
              showIcon
              type="info"
              icon={<EyeInvisibleOutlined style={{ color: "#0066cc" }} />}
              message={<strong>{t("privacyDefaultTitle")}</strong>}
              description={t("privacyDefaultDescription")}
              style={{ borderRadius: 8, border: "1px solid #bfdbfe", background: "#eff6ff" }}
            />

            {visibilityGroups.map((group, gIdx) => (
              <div key={gIdx} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{group.icon}</span>
                    <strong style={{ fontSize: 14, color: "#1e293b" }}>{t(group.titleKey)}</strong>
                  </div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {t(group.hintKey)}
                  </Typography.Text>
                </div>

                <Row gutter={[10, 10]}>
                  {group.fields.map((field) => {
                    const isVisible = Boolean(visibility[field.key]);
                    return (
                      <Col xs={24} sm={12} key={field.key}>
                        <S.VisibilityRow
                          style={{
                            borderColor: isVisible ? "#93c5fd" : "#e2e8f0",
                            background: isVisible ? "#f8fafc" : "#ffffff",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                            {isVisible ? (
                              <EyeOutlined style={{ color: "#16a34a", fontSize: 15 }} />
                            ) : (
                              <LockOutlined style={{ color: "#64748b", fontSize: 15 }} />
                            )}
                            <span style={{ fontWeight: 500, fontSize: 13, color: isVisible ? "#0f172a" : "#475569" }}>
                              {t(field.label)}
                            </span>
                          </div>

                          <Switch
                            checked={isVisible}
                            checkedChildren={t("privacyVisible")}
                            unCheckedChildren={t("privacyPrivate")}
                            onChange={(checked) => updateVisibility(field.key, checked)}
                            disabled={isLoading}
                            aria-label={`${t(field.label)}: ${
                              isVisible ? t("privacyVisible") : t("privacyPrivate")
                            }`}
                            style={{
                              backgroundColor: isVisible ? "#16a34a" : "#94a3b8",
                            }}
                          />
                        </S.VisibilityRow>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            ))}

            <S.SensitiveNote style={{ marginTop: 8 }}>
              <SafetyCertificateOutlined aria-hidden="true" style={{ color: "#0066cc", fontSize: 16, marginTop: 2 }} />
              <span>{t("privacySensitiveNote")}</span>
            </S.SensitiveNote>

            <S.ActionRow style={{ marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="button"
                size="large"
                loading={isLoading}
                disabled={isLoading}
                onClick={saveVisibility}
                icon={<CheckCircleOutlined />}
                style={{
                  minWidth: 180,
                  height: 42,
                  fontWeight: 600,
                  background: "#0066cc",
                  borderRadius: 8,
                }}
              >
                {isLoading ? t("privacySaving") : t("privacySave")}
              </Button>
              <S.LiveRegion role="status" aria-live="polite">
                {isLoading ? t("privacySaving") : ""}
              </S.LiveRegion>
            </S.ActionRow>
          </S.ContentWrapper>
        )}
      </Card>
    </S.ContainerWrapper>
  );
}

export default PrivacySettings;
