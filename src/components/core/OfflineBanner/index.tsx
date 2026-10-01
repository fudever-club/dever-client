"use client";

import { useEffect, useState } from "react";
import { Alert } from "antd";

/** Honest offline banner: tells members the content on screen may be stale. */
export default function OfflineBanner() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;

  return (
    <Alert
      type="warning"
      showIcon
      closable={false}
      message="Bạn đang ngoại tuyến"
      description="Nội dung hiển thị có thể đã cũ. Kiểm tra lại mạng trước khi nộp quỹ, gửi bài hay điểm danh."
      style={{ marginBottom: 16 }}
      role="status"
      data-testid="offline-banner"
    />
  );
}
