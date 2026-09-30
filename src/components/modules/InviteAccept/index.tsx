"use client";

import Image from "next/image";
import {
  Alert,
  Empty,
  Flex,
  Form,
  FormProps,
  Input,
  Result,
  Skeleton,
} from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import Button from "@/components/core/common/Button";
import SelectLanguage from "@/components/core/layouts/MainLayout/SelectLanguage";
import Typography from "@/components/core/common/Typography";
import LoadingScreen from "@/components/core/common/LoadingScreen";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";
import apiClient from "@/utils/apiClient";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";

import * as S from "../SignIn/styles";

type InviteInfo = {
  emailMasked: string;
  firstname: string;
  expiresAt: string;
};

type InviteStatus = "loading" | "ready" | "invalid" | "networkError" | "accepted";

type PasswordFields = {
  password: string;
  confirmPassword: string;
};

function inviteUrl(token: string) {
  return `/api/v1/invites/${encodeURIComponent(token)}`;
}

function formatExpiry(expiresAt: string, locale: string) {
  if (!expiresAt) return "";
  try {
    return new Date(expiresAt).toLocaleString(locale === "vi" ? "vi-VN" : "en-US");
  } catch {
    return expiresAt;
  }
}

function InviteAcceptModule() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const token = params?.token as string | undefined;
  const { t } = useTranslation(params?.locale as string, "invite");

  const [status, setStatus] = useState<InviteStatus>("loading");
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [loadError, setLoadError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Public lookup: no manual Bearer header; apiClient resolves API_SERVER
  // and sends cookies for the session set on accept.
  const loadInvite = useCallback(async () => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    setLoadError("");
    const res = await apiClient.get(inviteUrl(token));
    const body: any = res.data;
    if (res.ok) {
      const info = body?.data ?? body;
      if (info?.emailMasked) {
        setInvite({
          emailMasked: info.emailMasked,
          firstname: info.firstname ?? "",
          expiresAt: info.expiresAt ?? "",
        });
        setStatus("ready");
      } else {
        setStatus("invalid");
      }
      return;
    }
    if (res.status === 410) {
      setStatus("invalid");
      return;
    }
    setLoadError(
      typeof res.error === "string" && res.error ? res.error : t("networkError")
    );
    setStatus("networkError");
  }, [token, t]);

  useEffect(() => {
    void loadInvite();
  }, [loadInvite]);

  const onFinish: FormProps<PasswordFields>["onFinish"] = async (values) => {
    if (!token || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiClient.post(`${inviteUrl(token)}/accept`, {
        password: values.password,
      });
      const body: any = res.data;
      if (res.ok && res.status === 201) {
        const payload = body?.data ?? body;
        const sessionToken = payload?.token;
        const user = payload?.user;
        if (sessionToken) {
          webStorageClient.setToken(sessionToken);
          // Store only the id - same convention as SignIn (auth slice keeps the memory copy).
          webStorageClient.set(constants.USER_INFO, user?._id || user);
        }
        setStatus("accepted");
        setIsNavigating(true);
        // Honor the ?redirect= target set by auth guards; accept same-origin
        // /{locale}/... paths only to block open-redirect phishing.
        const redirectParam = searchParams?.get("redirect");
        const safeRedirect =
          redirectParam &&
          /^\/[a-z]{2}\/.+/.test(redirectParam) &&
          !redirectParam.startsWith("//")
            ? redirectParam
            : null;
        const destination = safeRedirect || `/${locale}/dashboard`;
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = destination;
          } else {
            router?.push(destination);
          }
        }, 600);
        return;
      }
      if (res.status === 410) {
        setStatus("invalid");
        return;
      }
      if (res.status === 409) {
        setSubmitError(
          body?.message || (t("alreadyUsed") as string)
        );
        return;
      }
      setSubmitError(
        body?.message || res.error || (t("acceptFailed") as string)
      );
    } catch (error: any) {
      setSubmitError(error?.message || (t("acceptFailed") as string));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <S.Wrapper>
      {isNavigating && <LoadingScreen message={t("redirecting") as string} />}
      <Flex justify="space-between">
        <Image
          alt="FU-DEVER"
          src={"/icons/layout/fu-dever-logo.png"}
          width={40}
          height={40}
        />
        <SelectLanguage />
      </Flex>
      <Typography.Title
        level={2}
        $color={themeColors?.primary}
        $align="center"
        $margin="32px 0px 16px 0"
      >
        {t("title")}
      </Typography.Title>
      <Typography.Text $align="center" $margin="0px 0px 32px 0">
        {t("description")}
      </Typography.Text>

      {status === "loading" && (
        <div aria-busy="true" aria-live="polite">
          <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 5 }} />
          <Typography.Text $align="center" $margin="16px 0 0 0">
            {t("validating")}
          </Typography.Text>
        </div>
      )}

      {status === "ready" && invite && (
        <>
          <S.AccessNotice role="note">
            <strong>{t("greeting", { firstname: invite.firstname })}</strong>
            <span>{t("inviteFor", { email: invite.emailMasked })}</span>
            {invite.expiresAt && (
              <span>
                {t("expiresAt", {
                  date: formatExpiry(invite.expiresAt, locale),
                })}
              </span>
            )}
          </S.AccessNotice>
          {submitError && (
            <Alert
              type="error"
              message={submitError}
              showIcon
              role="alert"
              style={{ marginBottom: 16 }}
            />
          )}
          <Form
            name="invite-accept"
            onFinish={onFinish}
            layout="vertical"
            validateTrigger={["onBlur", "onChange"]}
            aria-busy={submitting}
          >
            <Form.Item<PasswordFields>
              label={t("password")}
              name="password"
              wrapperCol={{ span: 24 }}
              hasFeedback
              rules={[
                { required: true, message: t("passwordError") as string },
                { min: 6, message: t("passwordMinLength") as string },
              ]}
            >
              <Input.Password
                placeholder={t("enterPassword") as string}
                autoComplete="new-password"
                aria-label={t("password") as string}
                disabled={submitting}
                style={{ minHeight: 44 }}
              />
            </Form.Item>

            <Form.Item<PasswordFields>
              label={t("confirmPassword")}
              name="confirmPassword"
              dependencies={["password"]}
              wrapperCol={{ span: 24 }}
              hasFeedback
              rules={[
                { required: true, message: t("confirmError") as string },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("passwordMismatch") as string)
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder={t("enterConfirmPassword") as string}
                autoComplete="new-password"
                aria-label={t("confirmPassword") as string}
                disabled={submitting}
                style={{ minHeight: 44 }}
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                $width="100%"
                loading={submitting}
                disabled={submitting}
                aria-busy={submitting}
                style={{ minHeight: 44 }}
              >
                {submitting ? t("submitting") : t("submit")}
              </Button>
            </Form.Item>
          </Form>
          <S.SignUpPrompt justify="center" gap={4} role="note">
            <span>{t("contactAdmin")}</span>
          </S.SignUpPrompt>
        </>
      )}

      {status === "invalid" && (
        <>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("invalidTitle")}
          />
          <S.AccessNotice role="status" aria-live="polite">
            <strong>{t("invalidTitle")}</strong>
            <span>{t("invalidDescription")}</span>
          </S.AccessNotice>
          <S.SignUpPrompt justify="center" gap={4} role="note">
            <span>{t("contactAdmin")}</span>
          </S.SignUpPrompt>
        </>
      )}

      {status === "networkError" && (
        <>
          <Alert
            type="error"
            message={loadError || (t("networkError") as string)}
            showIcon
            role="alert"
            style={{ marginBottom: 16 }}
          />
          <Button
            type="primary"
            $width="100%"
            onClick={() => void loadInvite()}
            style={{ minHeight: 44 }}
          >
            {t("retry")}
          </Button>
        </>
      )}

      {status === "accepted" && (
        <Result
          status="success"
          title={t("acceptSuccess")}
          subTitle={t("redirecting")}
        />
      )}
    </S.Wrapper>
  );
}

export default InviteAcceptModule;
