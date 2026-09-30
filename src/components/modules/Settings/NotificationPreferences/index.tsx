"use client";

import { useCallback, useEffect, useState } from "react";
import { BellOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Skeleton, Switch, Typography, message } from "antd";

import { endpointNotifications } from "@/helpers/enpoints";
import { apiClient } from "@/utils/apiClient";

import * as S from "./styles";

type PrefKey = "arena" | "event";

interface NotificationPrefs {
  arena: boolean;
  event: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = { arena: true, event: true };

function normalizePrefs(raw: unknown): NotificationPrefs {
  const record = (raw ?? {}) as Partial<Record<PrefKey, unknown>>;
  return {
    arena: typeof record.arena === "boolean" ? record.arena : true,
    event: typeof record.event === "boolean" ? record.event : true,
  };
}

function NotificationPreferences() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<PrefKey | null>(null);

  const fetchPrefs = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await apiClient.get<unknown>(endpointNotifications.PREFS);
      if (!res.ok || res.data == null) {
        throw new Error(res.error || "Request failed");
      }
      const raw = (res.data as { data?: unknown })?.data ?? res.data;
      setPrefs(normalizePrefs(raw));
    } catch {
      // TODO(i18n): move hardcoded VI copy to settings locale namespace.
      setLoadError("Chưa thể tải tùy chọn thông báo. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await apiClient.get<unknown>(endpointNotifications.PREFS);
        if (cancelled) return;
        if (!res.ok || res.data == null) {
          throw new Error(res.error || "Request failed");
        }
        const raw = (res.data as { data?: unknown })?.data ?? res.data;
        setPrefs(normalizePrefs(raw));
      } catch {
        if (cancelled) return;
        // TODO(i18n): move hardcoded VI copy to settings locale namespace.
        setLoadError("Chưa thể tải tùy chọn thông báo. Vui lòng thử lại.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = async (key: PrefKey, checked: boolean) => {
    if (pendingKey !== null) return;
    const previous = prefs;
    setPrefs((current) => ({ ...current, [key]: checked }));
    setPendingKey(key);
    try {
      const res = await apiClient.put<unknown>(endpointNotifications.PREFS, {
        [key]: checked,
      });
      if (!res.ok || res.data == null) {
        throw new Error(res.error || "Request failed");
      }
      const raw = (res.data as { data?: unknown })?.data ?? res.data;
      setPrefs(normalizePrefs({ ...previous, [key]: checked, ...((raw ?? {}) as object) }));
      // TODO(i18n): move hardcoded VI copy to settings locale namespace.
      message.success("Đã cập nhật tùy chọn thông báo.");
    } catch {
      setPrefs(previous);
      // TODO(i18n): move hardcoded VI copy to settings locale namespace.
      message.error("Chưa thể cập nhật tùy chọn thông báo. Vui lòng thử lại.");
    } finally {
      setPendingKey(null);
    }
  };

  const rows: { key: PrefKey; title: string; desc: string }[] = [
    {
      key: "arena",
      // TODO(i18n): move hardcoded VI copy to settings locale namespace.
      title: "Đấu trường & huy hiệu",
      desc: "Huy hiệu mới, lên cấp, chuỗi hoạt động (streak).",
    },
    {
      key: "event",
      // TODO(i18n): move hardcoded VI copy to settings locale namespace.
      title: "Sự kiện",
      desc: "Vé, check-in và nhắc lịch sự kiện.",
    },
  ];

  const isPending = pendingKey !== null;

  return (
    <S.ContainerWrapper aria-labelledby="notification-prefs-heading">
      <Card bordered={false} className="notification-prefs-card">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : loadError ? (
          <Alert
            showIcon
            type="error"
            message="Không tải được tùy chọn thông báo"
            description={loadError}
            action={
              <Button size="small" onClick={fetchPrefs}>
                Thử lại
              </Button>
            }
          />
        ) : (
          <S.ContentWrapper>
            <S.HeadingRow>
              <S.IconWrap aria-hidden="true">
                <BellOutlined />
              </S.IconWrap>
              <div>
                <Typography.Title
                  id="notification-prefs-heading"
                  level={3}
                  style={{ marginBottom: 4 }}
                >
                  {/* TODO(i18n): move hardcoded VI copy to settings locale namespace. */}
                  Thông báo
                </Typography.Title>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {/* TODO(i18n): move hardcoded VI copy to settings locale namespace. */}
                  Chọn loại thông báo bạn muốn nhận từ CLB.
                </Typography.Paragraph>
              </div>
            </S.HeadingRow>

            {rows.map((row) => {
              const checked = prefs[row.key];
              const loading = pendingKey === row.key;
              return (
                <S.PrefRow
                  key={row.key}
                  style={{
                    borderColor: checked ? "#93c5fd" : "#e2e8f0",
                    background: checked ? "#f8fafc" : "#ffffff",
                  }}
                >
                  <S.PrefText>
                    <S.PrefTitle>{row.title}</S.PrefTitle>
                    <S.PrefDesc>{row.desc}</S.PrefDesc>
                  </S.PrefText>
                  <S.SwitchHitArea>
                    <Switch
                      checked={checked}
                      loading={loading}
                      disabled={isPending}
                      checkedChildren="Bật"
                      unCheckedChildren="Tắt"
                      onChange={(next) => handleToggle(row.key, next)}
                      aria-label={`${row.title}: ${checked ? "Bật" : "Tắt"}`}
                      style={{
                        backgroundColor: checked ? "#16a34a" : "#94a3b8",
                      }}
                    />
                  </S.SwitchHitArea>
                </S.PrefRow>
              );
            })}

            <S.TxnNote>
              <InfoCircleOutlined
                aria-hidden="true"
                style={{ color: "#0066cc", fontSize: 16, marginTop: 2 }}
              />
              {/* TODO(i18n): move hardcoded VI copy to settings locale namespace. */}
              <span>Tin giao dịch như duyệt bài và quỹ luôn được gửi và không thể tắt.</span>
            </S.TxnNote>

            <S.LiveRegion role="status" aria-live="polite">
              {isPending ? "Đang cập nhật tùy chọn thông báo…" : ""}
            </S.LiveRegion>
          </S.ContentWrapper>
        )}
      </Card>
    </S.ContainerWrapper>
  );
}

export default NotificationPreferences;
