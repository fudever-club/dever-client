"use client";

import { EyeInvisibleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Row, Skeleton, Switch, Typography, message } from "antd";
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

const visibilityFields: { key: VisibilityKey; label: string }[] = [
  { key: "description", label: "visibilityAbout" },
  { key: "nickname", label: "visibilityNickname" },
  { key: "job", label: "visibilityJob" },
  { key: "school", label: "visibilitySchool" },
  { key: "workplace", label: "visibilityWorkplace" },
  { key: "skills", label: "visibilitySkills" },
  { key: "favourites", label: "visibilityFavourites" },
  { key: "leetcode", label: "visibilityLeetcode" },
  { key: "socials", label: "visibilitySocials" },
  { key: "email", label: "visibilityEmail" },
  { key: "phone", label: "visibilityPhone" },
  { key: "MSSV", label: "visibilityStudentId" },
  { key: "dob", label: "visibilityBirthday" },
  { key: "hometown", label: "visibilityHometown" },
];

const getPrivateDefaults = (): ProfileVisibility =>
  visibilityFields.reduce<ProfileVisibility>((visibility, field) => {
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
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <S.ContentWrapper>
            <S.HeadingRow>
              <S.IconWrap aria-hidden="true">
                <SafetyCertificateOutlined />
              </S.IconWrap>
              <div>
                <Typography.Title id="privacy-settings-heading" level={3}>
                  {t("privacyTitle")}
                </Typography.Title>
                <Typography.Paragraph>{t("privacyDescription")}</Typography.Paragraph>
              </div>
            </S.HeadingRow>

            <Alert
              showIcon
              type="info"
              icon={<EyeInvisibleOutlined />}
              message={t("privacyDefaultTitle")}
              description={t("privacyDefaultDescription")}
            />

            <S.SectionLabel>{t("privacyOptionalTitle")}</S.SectionLabel>
            <Row gutter={[12, 12]}>
              {visibilityFields.map((field) => (
                <Col xs={24} sm={12} key={field.key}>
                  <S.VisibilityRow>
                    <span>{t(field.label)}</span>
                    <Switch
                      checked={Boolean(visibility[field.key])}
                      checkedChildren={t("privacyVisible")}
                      unCheckedChildren={t("privacyPrivate")}
                      onChange={(checked) => updateVisibility(field.key, checked)}
                      disabled={isLoading}
                      aria-label={`${t(field.label)}: ${
                        visibility[field.key] ? t("privacyVisible") : t("privacyPrivate")
                      }`}
                    />
                  </S.VisibilityRow>
                </Col>
              ))}
            </Row>

            <S.SensitiveNote>
              <SafetyCertificateOutlined aria-hidden="true" />
              <span>{t("privacySensitiveNote")}</span>
            </S.SensitiveNote>

            <S.ActionRow>
              <Button
                type="primary"
                htmlType="button"
                loading={isLoading}
                disabled={isLoading}
                onClick={saveVisibility}
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
