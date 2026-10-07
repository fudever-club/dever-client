"use client";

import React, { useState } from "react";
import {
  Badge,
  Button,
  Popover,
  Tabs,
  Typography,
  Skeleton,
  Empty,
  Tooltip,
  message,
} from "antd";
import {
  Bell,
  Trophy,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Flame,
  Info,
  CheckCheck,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
} from "@/store/queries/notifications";

const { Text } = Typography;

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const locale = useLocale();
  const router = useRouter();

  const {
    data: notifData,
    isLoading,
    isError,
    refetch,
  } = useGetMyNotificationsQuery(undefined, {
    pollingInterval: 15000, // Poll every 15s for fresh notifications
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsAsReadMutation();
  const [deleteNotif, { isLoading: isDeleting }] = useDeleteNotificationMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const notifications = notifData?.data || [];
  const unreadCount = notifData?.unreadCount || 0;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n: any) => !n.isRead)
      : notifications;

  const handleItemClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif._id).unwrap();
      } catch (e) {
        console.warn("Failed to mark as read", e);
      }
    }
    if (notif.link) {
      setOpen(false);
      // If external link
      if (notif.link.startsWith("http")) {
        window.open(notif.link, "_blank");
      } else {
        // localized route
        const targetPath = notif.link.startsWith(`/${locale}`)
          ? notif.link
          : `/${locale}${notif.link.startsWith("/") ? "" : "/"}${notif.link}`;
        router.push(targetPath);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      message.success("Đã đánh dấu tất cả là đã đọc");
    } catch (e) {
      message.error("Không thể cập nhật trạng thái thông báo");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isDeleting || deletingId !== null) return;
    setDeletingId(id);
    try {
      await deleteNotif(id).unwrap();
      message.success("Đã xóa thông báo");
    } catch (e) {
      message.error("Lỗi khi xóa thông báo");
    } finally {
      setDeletingId(null);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "badge_unlocked":
      case "level_up":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 ring-1 ring-amber-200">
            <Trophy className="h-4 w-4" />
          </div>
        );
      case "blog_approved":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        );
      case "blog_rejected":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
            <XCircle className="h-4 w-4" />
          </div>
        );
      case "blog_changes_requested":
      case "blog_submitted":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-200">
            <FileText className="h-4 w-4" />
          </div>
        );
      case "streak_milestone":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-200">
            <Flame className="h-4 w-4" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 ring-1 ring-slate-200">
            <Info className="h-4 w-4" />
          </div>
        );
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const date = new Date(dateStr);
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return "Vừa xong";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "";
    }
  };

  const popoverContent = (
    <div className="w-[min(360px,calc(100vw-32px))] sm:w-[min(400px,calc(100vw-32px))]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 text-base">Thông báo</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-[#0066CC]">
              {unreadCount} mới
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            type="text"
            size="middle"
            icon={<CheckCheck className="h-3.5 w-3.5" />}
            loading={isMarkingAll}
            disabled={isMarkingAll}
            onClick={handleMarkAllRead}
            className="!text-xs !text-[#0066CC] hover:!bg-blue-50 min-h-[44px]"
          >
            Đọc tất cả
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        className="!mb-1"
        items={[
          { key: "all", label: `Tất cả (${notifications.length})` },
          { key: "unread", label: `Chưa đọc (${unreadCount})` },
        ]}
      />

      {/* Content Body */}
      <div className="max-h-[380px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton avatar active paragraph={{ rows: 1 }} />
            <Skeleton avatar active paragraph={{ rows: 1 }} />
            <Skeleton avatar active paragraph={{ rows: 1 }} />
          </div>
        ) : isError ? (
          <div className="py-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
            <Text type="secondary" className="block text-xs mb-2">
              Không thể tải danh sách thông báo
            </Text>
            <Button size="middle" onClick={() => refetch()} className="min-h-[44px]">
              Thử lại
            </Button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-8">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-xs text-slate-400">
                  {activeTab === "unread"
                    ? "Bạn không có thông báo chưa đọc nào"
                    : "Chưa có thông báo nào từ hệ thống"}
                </span>
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item: any) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item)}
                className={`group relative flex cursor-pointer items-start gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] ${
                  !item.isRead ? "bg-blue-50/40" : ""
                }`}
              >
                {renderIcon(item.type)}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs truncate ${
                        !item.isRead
                          ? "font-bold text-slate-900"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066CC]" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500 line-clamp-2 mt-0.5">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                    {item.link && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-[#0066CC] font-medium opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus-visible:opacity-100 transition-opacity">
                        Xem chi tiết <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button — always visible on touch (<sm), min 44px target */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item._id)}
                  disabled={deletingId === item._id || isDeleting}
                  aria-label="Xóa thông báo"
                  aria-busy={deletingId === item._id}
                  className="absolute right-1 top-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-slate-100 hover:text-rose-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 sm:right-2 sm:top-3 sm:p-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 sm:focus-visible:opacity-100"
                >
                  <Trash2 className="h-4 w-4 sm:h-3 sm:w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="rounded-2xl shadow-xl"
    >
      <div className="relative inline-flex items-center justify-center">
        <Badge
          count={unreadCount}
          overflowCount={99}
          offset={[-2, 4]}
          size="small"
          styles={{
            root: { cursor: "pointer" },
            indicator: {
              backgroundColor: "#0066CC",
              boxShadow: "0 0 0 2px #fff",
              fontSize: "11px",
              height: "16px",
              minWidth: "16px",
              lineHeight: "16px",
            },
          }}
        >
          <Button
            type="text"
            shape="circle"
            size="large"
            aria-label="Thông báo"
            className="flex items-center justify-center text-slate-700 hover:text-[#0066CC] hover:bg-slate-100 transition-all duration-200 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0066CC] focus-visible:ring-offset-2"
            icon={<Bell className="h-5 w-5" />}
          />
        </Badge>
      </div>
    </Popover>
  );
}
