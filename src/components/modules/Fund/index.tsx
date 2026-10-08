"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  Tag,
  Button,
  Space,
  Input,
  Typography,
  message,
  Row,
  Col,
  Upload,
  Modal,
  Alert,
  Skeleton,
  Table,
  Tooltip,
  Progress,
  Empty,
} from "antd";
import {
  WalletOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  UploadOutlined,
  QrcodeOutlined,
  BankOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  ReloadOutlined,
  CheckOutlined,
  DownloadOutlined,
  FullscreenOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  FileImageOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
import { compressImage } from "@/utils/imageCompressor";
import { apiClient } from "@/utils/apiClient";
import { endpointFund } from "@/helpers/enpoints";
import { useTranslation } from "@/app/i18n/client";
import dayjs from "dayjs";
import themeColors from "@/style/themes/default/colors";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface BankInfo {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  transferSyntaxTemplate: string;
  qrTemplateUrl?: string;
  customQrUrl?: string;
}

interface FundCampaign {
  _id: string;
  title: string;
  description?: string;
  amount: number;
  startDate: string;
  deadline: string;
  semester: string;
  status: "active" | "closed" | "upcoming";
  bankInfo: BankInfo;
}

interface FundPayment {
  _id: string;
  campaignId: {
    _id: string;
    title: string;
    amount: number;
    deadline: string;
    semester: string;
  };
  amount: number;
  proofImageUrl: string;
  transactionCode?: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
  createdAt: string;
}

interface FundPublicStats {
  title: string;
  amount: number;
  deadline: string;
  semester: string;
  paidCount: number;
  totalMembers: number;
  percent: number;
  totalMoneyCollected: number;
}

export default function FundModule() {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "fund");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeCampaign, setActiveCampaign] = useState<FundCampaign | null>(null);
  const [activePayment, setActivePayment] = useState<FundPayment | null>(null);
  const [history, setHistory] = useState<FundPayment[]>([]);

  // Public campaign stats header (GET /api/v1/funds/public-stats, no auth).
  // 404 with { data: null } means no collection period is open yet.
  const [stats, setStats] = useState<FundPublicStats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [statsError, setStatsError] = useState<boolean>(false);
  const [statsMissing, setStatsMissing] = useState<boolean>(false);

  // QR Display Mode: 'vietqr' (Default HD Napas247) | 'custom' (Original Treasurer Screenshot)
  const [qrMode, setQrMode] = useState<"vietqr" | "custom">("vietqr");

  // Form states
  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [transactionCode, setTransactionCode] = useState<string>("");
  const [memberNote, setMemberNote] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Modals
  const [qrZoomModalOpen, setQrZoomModalOpen] = useState<boolean>(false);
  const [billPreviewModalOpen, setBillPreviewModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setQrZoomModalOpen(false);
        setBillPreviewModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      // Single-flight refresh + credentials:include live in apiClient;
      // a 401 there already retried once and redirected if still unauthorized.
      const res = await apiClient.get(endpointFund.MY_PAYMENTS);

      if (res.status === 401) {
        return;
      }

      if (res.ok) {
        const json = (res.data as any) || {};
        const camp = json.data?.activeCampaign || null;
        setActiveCampaign(camp);
        setActivePayment(json.data?.activePayment || null);
        setHistory(json.data?.history || []);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
      message.error(t("loadErrorToast", "Không thể tải thông tin quỹ CLB."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchPublicStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(false);
    setStatsMissing(false);
    try {
      // Public endpoint: skipAuth omits the Bearer header/session cookies so
      // logged-out visitors don't trigger the global 401 redirect in apiClient.
      const res = await apiClient.get(endpointFund.PUBLIC_STATS, { skipAuth: true });

      if (res.status === 404) {
        setStatsMissing(true);
        return;
      }

      if (res.ok) {
        const payload = (res.data as any)?.data ?? null;
        if (payload) {
          setStats(payload as FundPublicStats);
        } else {
          setStatsMissing(true);
        }
      } else {
        setStatsError(true);
      }
    } catch {
      setStatsError(true);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicStats();
  }, [fetchPublicStats]);

  // Copy helper with animated checkmark
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    message.success(t("copiedPrefix", { defaultValue: `Đã sao chép: ${text}`, text }));
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Upload image to backend Cloudflare R2
  const handleUploadFile = async (file: File) => {
    setUploadingImage(true);
    try {
      // Compress receipt image client-side before upload to prevent high bandwidth and payload limits
      const compressedFile = await compressImage(file, {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1600,
        quality: 0.82,
      });

      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append("folder", "fund-proofs");

      const res = await apiClient.post("/api/v1/upload/image", formData);

      if (res.status === 401) {
        return false;
      }

      if (res.ok) {
        const json = (res.data as any) || {};
        const imageUrl = json.data?.url || json.url || json.secure_url;
        if (imageUrl) {
          setProofImageUrl(imageUrl);
          message.success(t("uploadImageSuccess", "Tải ảnh biên lai lên hệ thống lưu trữ thành công!"));
          return false;
        }
      }

      const errJson = (res.data as any) || null;
      throw new Error(errJson?.message || t("uploadImageFailDefault", "Tải ảnh biên lai lên thất bại"));
    } catch (err: any) {
      console.error("Fund proof upload error:", err);
      message.error(err?.message || t("uploadImageError", "Không thể tải ảnh biên lai lên máy chủ. Vui lòng thử lại!"));
    } finally {
      setUploadingImage(false);
    }
    return false;
  };

  // Submit payment proof
  const handleSubmitPayment = async () => {
    if (!activeCampaign) return;
    if (!proofImageUrl) {
      message.warning(t("proofRequired", "Vui lòng tải lên ảnh chụp màn hình biên lai chuyển khoản!"));
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.post(endpointFund.SUBMIT_PAYMENT, {
        campaignId: activeCampaign._id,
        proofImageUrl,
        transactionCode,
        note: memberNote,
        // No amount: the server always charges the campaign's amount.
      });

      if (res.status === 401) {
        return;
      }

      if (res.ok) {
        message.success(t("submitSuccess", "Đã gửi minh chứng đóng quỹ thành công! Ban Quản Trị sẽ đối soát sớm."));
        fetchData();
      } else {
        const err = (res.data as any) || {};
        message.error(err.message || t("submitFailDefault", "Gửi thất bại."));
      }
    } catch {
      message.error(t("networkError", "Lỗi kết nối máy chủ."));
    } finally {
      setSubmitting(false);
    }
  };

  // Official Configured Treasurer Bank Info
  const qrAmount = activeCampaign?.amount || 100000;
  const qrBankCode = activeCampaign?.bankInfo?.bankCode || "TPB";
  const qrAccNumber = activeCampaign?.bankInfo?.accountNumber || "81836101820";
  const qrAccHolder = activeCampaign?.bankInfo?.accountHolder || "NGUYEN THI NGOC ANH";
  const qrSyntax = activeCampaign?.bankInfo?.transferSyntaxTemplate || "DEVER [MSSV] [HoTen]";
  
  // Official VietQR HD Image (Square, full resolution, recognized by 100% banking apps)
  const vietQrImageUrl = `https://img.vietqr.io/image/${qrBankCode}-${qrAccNumber}-compact2.png?amount=${qrAmount}&addInfo=${encodeURIComponent(qrSyntax)}&accountName=${encodeURIComponent(qrAccHolder)}`;
  const customQrImageUrl = activeCampaign?.bankInfo?.customQrUrl || "/images/treasurer-qr.png";

  const currentDisplayQr = qrMode === "custom" && customQrImageUrl ? customQrImageUrl : vietQrImageUrl;

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 sm:p-8 max-w-7xl mx-auto">
        <Alert
          type="error"
          showIcon
          message={t("loadErrorTitle", "Không thể tải thông tin quỹ CLB")}
          description={t("loadErrorDesc", "Vui lòng kiểm tra kết nối và thử lại.")}
          action={
            <Button size="middle" danger onClick={fetchData} className="min-h-[44px]">
              {t("retry", "Thử lại")}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-primary text-xs font-bold mb-2 shadow-sm">
            <ThunderboltOutlined />
            <span>{t("badge", "CỔNG ĐÓNG QUỸ FU-DEVER")}</span>
          </div>
          <Title level={1} className="!mb-1 !text-3xl text-slate-900 font-extrabold tracking-tight">
            {t("heading", "Quỹ Hoạt Động & Phát Triển CLB")}
          </Title>
          <Text type="secondary" className="text-sm">
            {t("subtitle", "Thực hiện nghĩa vụ đóng quỹ thành viên để duy trì sinh hoạt, trang thiết bị Project Lab và tài trợ giải thưởng.")}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => {
            fetchData();
            fetchPublicStats();
          }}
          className="rounded-xl text-xs font-bold self-start sm:self-auto h-10 px-4 shadow-sm border-slate-200 hover:border-primary"
        >
          {t("refresh", "Làm mới")}
        </Button>
      </div>

      {/* Public stats header — progress percent is rendered exactly as the server returns it */}
      {statsLoading && (
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md" aria-busy="true" aria-live="polite">
          <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 3 }} />
        </div>
      )}
      {!statsLoading && statsError && (
        <Alert
          type="error"
          showIcon
          message={t("statsErrorTitle", "Không thể tải thống kê quỹ CLB")}
          description={t("statsErrorDesc", "Vui lòng kiểm tra kết nối và thử lại.")}
          action={
            <Button size="middle" danger onClick={fetchPublicStats} className="min-h-[44px]">
              {t("retry", "Thử lại")}
            </Button>
          }
        />
      )}
      {!statsLoading && !statsError && statsMissing && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-xs">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t("statsEmpty", "Chưa có kỳ thu quỹ")}
          />
        </div>
      )}
      {!statsLoading && !statsError && !statsMissing && stats && (
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white p-6 shadow-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Title level={3} className="!mb-0 text-slate-900 font-extrabold">
                {stats.title}
              </Title>
              {stats.semester && (
                <Tag color="blue" className="font-bold text-xs">
                  {stats.semester}
                </Tag>
              )}
            </div>
            <Text type="secondary" className="text-xs">
              {t("statsPaid", "Đã đóng")} <b className="text-slate-800">{stats.paidCount}/{stats.totalMembers}</b> {t("statsMembersSuffix", "thành viên")}
              {" • "}{t("statsAmountLabel", "Mức thu")} <b className="text-primary">{(stats.amount ?? 0).toLocaleString("vi-VN")} đ</b>
              {" • "}{t("statsCollectedLabel", "Đã thu")} <b className="text-slate-800">{(stats.totalMoneyCollected ?? 0).toLocaleString("vi-VN")} đ</b>
              {stats.deadline && (
                <>{" • "}{t("statsDeadlineLabel", "Hạn chót")} <b className="text-slate-800">{dayjs(stats.deadline).format("DD/MM/YYYY")}</b></>
              )}
            </Text>
            <Progress
              percent={typeof stats.percent === "number" ? stats.percent : 0}
              status="active"
              strokeColor={{ from: themeColors.primary, to: themeColors.primaryLight }}
              aria-label={`Tiến độ đóng quỹ ${typeof stats.percent === "number" ? stats.percent : 0}%`}
            />
          </div>
        </div>
      )}

      {/* 3-Way Status Notification Card */}
      {activePayment?.status === "approved" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <SafetyCertificateOutlined style={{ fontSize: "32px" }} />
            </div>
            <div>
              <Tag color="success" icon={<CheckCircleOutlined />} className="font-bold text-xs px-2.5 py-0.5 rounded-full">
                {t("approvedTag", "Hoàn thành nghĩa vụ quỹ")}
              </Tag>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{t("approvedTitle", "Chúc mừng! Bạn đã hoàn thành đóng quỹ kỳ này")}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {t("approvedMetaPeriod", "Kỳ quỹ:")} <b>{activeCampaign?.title}</b> • {t("approvedMetaConfirmed", "Số tiền đã xác nhận:")} <b>{(activePayment.amount || 100000).toLocaleString("vi-VN")} đ</b>
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => setBillPreviewModalOpen(true)}
            className="rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 h-10 px-5 shadow-md"
          >
            {t("viewReceipt", "Xem Lại Biên Lai")}
          </Button>
        </div>
      )}

      {activePayment?.status === "pending" && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <ClockCircleOutlined style={{ fontSize: "32px" }} />
            </div>
            <div>
              <Tag color="warning" icon={<ClockCircleOutlined />} className="font-bold text-xs px-2.5 py-0.5 rounded-full">
                {t("pendingTag", "Đang chờ đối soát")}
              </Tag>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{t("pendingTitle", "Minh chứng của bạn đang được Ban Quản Trị kiểm tra")}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {t("pendingMetaPrefix", "Đã nộp lúc:")} <b>{dayjs(activePayment.createdAt).format("HH:mm DD/MM/YYYY")}</b>. {t("pendingMetaSuffix", "Ban Quản Trị sẽ duyệt ngay khi tiền về tài khoản.")}
              </p>
            </div>
          </div>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setBillPreviewModalOpen(true)}
            className="rounded-xl font-bold text-xs border-amber-300 text-amber-800 hover:bg-amber-100 h-10 px-5 shadow-sm"
          >
            {t("viewSubmittedReceipt", "Xem Biên Lai Đã Nộp")}
          </Button>
        </div>
      )}

      {activePayment?.status === "rejected" && (
        <Alert
          type="error"
          showIcon
          className="rounded-2xl border-2 border-rose-300 shadow-sm p-4"
          message={<span className="font-bold text-rose-800 text-sm">{t("rejectedTitle", "Minh chứng đóng quỹ bị từ chối")}</span>}
          description={
            <div className="space-y-1.5 mt-1 text-xs text-rose-700 font-medium">
              <p>{t("rejectedReasonPrefix", "Lý do từ Ban Quản Trị:")} <b>{activePayment.reviewNotes || t("rejectedFallbackReason", "Ảnh minh chứng không rõ ràng hoặc chuyển khoản sai cú pháp.")}</b></p>
              <p>{t("rejectedHint", "Vui lòng kiểm tra lại thông tin và tải lên biên lai hợp lệ bên dưới.")}</p>
            </div>
          }
        />
      )}

      {/* Main Unified 2-Column Payment Grid */}
      {!activeCampaign && (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center space-y-2 shadow-xs">
          <p className="text-sm font-bold text-slate-700">{t("noCampaignTitle", "Hiện chưa có kỳ thu quỹ nào đang mở.")}</p>
          <p className="text-xs text-slate-500">{t("noCampaignDesc", "Ban Chủ Nhiệm sẽ thông báo khi có đợt đóng quỹ mới.")}</p>
        </div>
      )}
      {(!activePayment || activePayment.status === "rejected" || activePayment.status === "pending") && activeCampaign && (
        <Row gutter={[32, 32]}>
          {/* Column 1: Unified Payment Hub (Massive QR Code + Bank Details) */}
          <Col xs={24} lg={13}>
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden flex flex-col justify-between h-full">
              {/* Card Header Bar */}
              <div className="bg-primary-dark p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <BankOutlined className="text-xl text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white m-0">
                      {activeCampaign.bankInfo?.bankName || "TPBank (Ngân hàng Tiên Phong)"}
                    </h3>
                    <span className="text-xs text-blue-100 font-mono">{t("bankAccountLabel", "Tài khoản Thủ Quỹ Chính Thức")}</span>
                  </div>
                </div>
                <Tag className="!bg-white !text-primary-dark !border-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                  {activeCampaign.semester || "Fall 2026"}
                </Tag>
              </div>

              {/* Card Body: QR + Banking Info */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* QR Section with Mode Toggle */}
                <div className="flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200/90 shadow-inner">
                  {/* QR Mode Switcher */}
                  <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
                      <button
                        onClick={() => setQrMode("vietqr")}
                        className={`px-3.5 py-1.5 min-h-[44px] rounded-lg transition-colors inline-flex items-center gap-1 ${
                          qrMode === "vietqr" ? "bg-primary text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <ThunderboltOutlined />{t("qrStandard", "Mã VietQR chuẩn HD")}
                    </button>
                      <button
                        onClick={() => setQrMode("custom")}
                        className={`px-3.5 py-1.5 min-h-[44px] rounded-lg transition-colors inline-flex items-center gap-1 ${
                          qrMode === "custom" ? "bg-primary text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                      <FileImageOutlined />{t("qrCustom", "Ảnh gốc thủ quỹ")}
                    </button>
                  </div>

                  {/* QR Image Frame - Large & Crisp */}
                  <div className="relative group p-3 bg-white rounded-2xl shadow-xl border-2 border-slate-200 max-w-[320px] w-full">
                    {qrMode === "vietqr" ? (
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={t("qrZoomAria", "Phóng to mã QR")}
                        onClick={() => setQrZoomModalOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setQrZoomModalOpen(true);
                          }
                        }}
                        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <Image
                          src={vietQrImageUrl}
                          alt="Mã VietQR đóng quỹ CLB"
                          fill
                          sizes="(max-width: 640px) 100vw, 320px"
                          loading="lazy"
                          unoptimized={vietQrImageUrl.startsWith("http")}
                          className="object-contain hover:scale-[1.02] transition-transform duration-200"
                        />
                      </div>
                    ) : (
                      <div
                        role="button"
                        tabIndex={0}
                        aria-label={t("qrZoomAria", "Phóng to mã QR")}
                        onClick={() => setQrZoomModalOpen(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setQrZoomModalOpen(true);
                          }
                        }}
                        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      >
                        <Image
                          src={customQrImageUrl}
                          alt="Ảnh Gốc Thủ Quỹ"
                          fill
                          sizes="(max-width: 640px) 100vw, 320px"
                          loading="lazy"
                          unoptimized={customQrImageUrl.startsWith("http")}
                          className="object-contain hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => setQrZoomModalOpen(true)}
                      aria-label={t("qrZoomAria", "Phóng to mã QR")}
                      className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm cursor-pointer backdrop-blur-[2px] min-h-[44px]"
                    >
                      <ZoomInOutlined style={{ fontSize: 20 }} /> {t("qrZoomHint", "Nhấp để phóng to toàn màn hình")}
                    </button>
                  </div>

                  {/* Actions under QR */}
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <Button
                      type="primary"
                      icon={<ZoomInOutlined />}
                      onClick={() => setQrZoomModalOpen(true)}
                      className="rounded-xl text-xs font-bold bg-primary h-11 min-h-[44px] shadow-sm"
                    >
                      {t("qrZoom", "Phóng To Mã QR")}
                    </Button>
                    <a
                      href={currentDisplayQr}
                      download={`QR_ThuQuy_DEVER_${activeCampaign.semester}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button icon={<DownloadOutlined />} className="rounded-xl text-xs font-bold h-11 min-h-[44px]">
                        {t("qrDownload", "Tải Ảnh QR")}
                      </Button>
                    </a>
                  </div>

                  <p className="text-xs text-slate-600 font-medium m-0">
                    {t("qrHint", "Mở app Ngân hàng (TPBank, MB, VCB, Momo...) quét mã để tự điền số tiền và nội dung chuyển khoản.")}
                  </p>
                </div>

                {/* Bank Account Info Rows with 1-Click Copy */}
                <div className="space-y-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-xs">
                  {/* Account Number */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">{t("accNumber", "Số tài khoản nhận:")}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-extrabold text-slate-900 tracking-wider">
                        {qrAccNumber}
                      </span>
                      <Tooltip title={t("copyAccTitle", "Sao chép số tài khoản")}>
                        <Button
                          size="middle"
                          icon={copiedKey === "acc" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(qrAccNumber, "acc")}
                          className="h-11 min-h-[44px] px-2.5 rounded-lg font-bold text-xs border-blue-200 bg-white shadow-sm"
                        >
                          {copiedKey === "acc" ? t("copied", "Đã chép") : t("copy", "Chép")}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Account Holder */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">{t("accHolder", "Chủ tài khoản (Thủ Quỹ):")}</span>
                    <span className="font-extrabold text-sm text-slate-900 uppercase tracking-wide">
                      {qrAccHolder}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">{t("amountLabel", "Mức thu kỳ này:")}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-primary text-base">
                        {qrAmount.toLocaleString("vi-VN")} đ
                      </span>
                      <Tooltip title={t("copyAmountTitle", "Sao chép số tiền")}>
                        <Button
                          size="middle"
                          icon={copiedKey === "amount" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(String(qrAmount), "amount")}
                          className="h-11 min-h-[44px] px-2.5 rounded-lg font-bold text-xs border-blue-200 bg-white shadow-sm"
                        >
                          {copiedKey === "amount" ? t("copied", "Đã chép") : t("copy", "Chép")}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Transfer Memo Syntax */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium text-xs">{t("syntaxLabel", "Cú pháp chuyển khoản:")}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300">
                        {qrSyntax}
                      </span>
                      <Tooltip title={t("copySyntaxTitle", "Sao chép cú pháp")}>
                        <Button
                          size="middle"
                          icon={copiedKey === "syntax" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(qrSyntax, "syntax")}
                          className="h-11 min-h-[44px] px-2.5 rounded-lg font-bold text-xs border-amber-300 bg-white text-amber-900 shadow-sm"
                        >
                          {copiedKey === "syntax" ? t("copied", "Đã chép") : t("copy", "Chép")}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Column 2: Streamlined Step-by-Step Proof Verification Box */}
          <Col xs={24} lg={11}>
            <div id="fund-submit-box" className="rounded-3xl border border-slate-200/90 bg-white shadow-xl p-6 sm:p-7 h-full flex flex-col justify-between scroll-mt-4">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <UploadOutlined className="text-xl text-primary" />
                    <h3 className="font-extrabold text-slate-900 text-base m-0">{t("submitBoxTitle", "Nộp Minh Chứng Đóng Quỹ")}</h3>
                  </div>
                  <Tag color="blue" className="font-bold text-xs">{t("step", "Bước 2 / 2")}</Tag>
                </div>

                {/* Upload Component Box */}
                <div className="space-y-2">
                  <label htmlFor="fund-proof-upload" className="text-xs font-bold text-slate-800 block">
                    {t("uploadLabel", "1. Tải lên ảnh chụp biên lai chuyển khoản (Bill Banking)")}{" "}
                    <span aria-hidden="true" className="text-rose-500">*</span>
                    <span className="sr-only">{t("requiredSr", "(bắt buộc)")}</span>
                  </label>

                  <Upload.Dragger
                    id="fund-proof-upload"
                    aria-required="true"
                    beforeUpload={handleUploadFile}
                    showUploadList={false}
                    className="p-5 rounded-2xl border-dashed border-2 border-slate-300 hover:border-primary transition-colors bg-slate-50/60"
                  >
                    {proofImageUrl ? (
                      <div className="space-y-3 text-center">
                        <div className="relative mx-auto h-52 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
                          <Image
                            src={proofImageUrl}
                            alt="Xem trước ảnh biên lai đã tải lên"
                            fill
                            sizes="(max-width: 640px) 100vw, 400px"
                            loading="lazy"
                            unoptimized={proofImageUrl.startsWith("http")}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <span className="text-xs text-emerald-600 font-bold">{t("uploadSuccess", "✓ Đã tải ảnh biên lai thành công")}</span>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              setProofImageUrl("");
                            }}
                            className="text-xs font-semibold"
                            style={{ minHeight: 44 }}
                          >
                            {t("changeImage", "Đổi ảnh")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mx-auto shadow-inner">
                          <FileImageOutlined style={{ fontSize: "28px" }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 m-0">{t("uploadPlaceholderTitle", "Kéo thả hoặc nhấp để chọn ảnh biên lai")}</p>
                          <p className="text-xs text-slate-500 m-0 mt-1">{t("uploadPlaceholderDesc", "Hỗ trợ PNG, JPG, JPEG (tối đa 10MB)")}</p>
                        </div>
                      </div>
                    )}
                  </Upload.Dragger>
                </div>

                {/* Transaction Code */}
                <div className="space-y-1.5">
                  <label htmlFor="fund-transaction-code" className="text-xs font-bold text-slate-800 block">
                    {t("txnLabel", "2. Mã giao dịch ngân hàng (Mã FT / Số tham chiếu):")}
                  </label>
                  <Input
                    id="fund-transaction-code"
                    placeholder={t("txnPlaceholder", "Ví dụ: FT2412345678...")}
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="rounded-xl text-xs py-2.5 font-mono"
                    style={{ minHeight: 44 }}
                  />
                </div>

                {/* Member Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="fund-member-note" className="text-xs font-bold text-slate-800 block">
                    {t("noteLabel", "3. Lời nhắn / Ghi chú thêm (Tùy chọn):")}
                  </label>
                  <TextArea
                    id="fund-member-note"
                    rows={2}
                    placeholder={t("notePlaceholder", "Ghi chú thêm nếu bạn nộp hộ hoặc chuyển từ tài khoản khác...")}
                    value={memberNote}
                    onChange={(e) => setMemberNote(e.target.value)}
                    className="rounded-xl text-xs"
                    style={{ minHeight: 44 }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-5">
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={submitting || uploadingImage}
                  disabled={!proofImageUrl}
                  onClick={handleSubmitPayment}
                  className="bg-primary hover:bg-primary-dark rounded-2xl font-extrabold text-sm shadow-xl shadow-blue-600/25 active:scale-[0.98] transition-[background-color,transform] h-14 text-white flex items-center justify-center gap-2"
                >
                  <span>{t("confirmSubmit", "Xác Nhận Đã Chuyển Khoản & Nộp Minh Chứng")}</span>
                  <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* Payment History Section */}
      <div className="rounded-3xl border border-slate-200/80 shadow-md bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 m-0">
            <DollarOutlined className="text-primary" /> {t("historyTitle", "Lịch Sử Đóng Quỹ Của Bạn")}
          </h3>
          <span className="text-xs text-slate-500 font-medium">{t("historyTotal", `Tổng cộng ${history.length} lần đóng`, { count: history.length })}</span>
        </div>

          <Table
          dataSource={history}
          rowKey="_id"
          pagination={false}
          scroll={{ x: 640 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("historyEmpty", "Bạn chưa nộp lần nào trong kỳ này")}
              >
                <Button
                  type="primary"
                  size="middle"
                  className="min-h-[44px]"
                  onClick={() =>
                    document.getElementById("fund-submit-box")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  {t("historyEmptyCta", "Nộp ngay")}
                </Button>
              </Empty>
            ),
          }}
          columns={[
            {
              title: t("colCampaign", "Kỳ thu quỹ"),
              key: "campaign",
              render: (_: any, record: FundPayment) => (
                <div>
                  <Text strong className="text-xs text-slate-900 block">{record.campaignId?.title || t("fundFallbackTitle", "Quỹ CLB")}</Text>
                  <Tag color="blue" className="text-xs mt-0.5">{record.campaignId?.semester || "Fall 2026"}</Tag>
                </div>
              ),
            },
            {
              title: t("colAmount", "Số tiền"),
              dataIndex: "amount",
              key: "amount",
              render: (amount: number) => (
                <Text strong className="text-xs text-primary">
                  {(amount || 100000).toLocaleString("vi-VN")} đ
                </Text>
              ),
            },
            {
              title: t("colTxn", "Mã giao dịch"),
              dataIndex: "transactionCode",
              key: "transactionCode",
              render: (code: string) => <Text code className="text-xs">{code || "N/A"}</Text>,
            },
            {
              title: t("colStatus", "Trạng thái"),
              dataIndex: "status",
              key: "status",
              render: (status: string) => {
                if (status === "approved") return <Tag color="success" icon={<CheckCircleOutlined />}>{t("statusApproved", "Đã duyệt")}</Tag>;
                if (status === "rejected") return <Tag color="error" icon={<CloseCircleOutlined />}>{t("statusRejected", "Bị từ chối")}</Tag>;
                return <Tag color="warning" icon={<ClockCircleOutlined />}>{t("statusPending", "Chờ duyệt")}</Tag>;
              },
            },
            {
              title: t("colDate", "Ngày nộp"),
              dataIndex: "createdAt",
              key: "createdAt",
              render: (date: string) => (
                <Text className="text-xs text-slate-500">{dayjs(date).format("HH:mm DD/MM/YYYY")}</Text>
              ),
            },
          ]}
          className="rounded-2xl overflow-hidden border border-slate-100"
        />
      </div>

      {/* GIANT QR FULLSCREEN MODAL - ULTRA HIGH DEFINITION */}
      <Modal
        open={qrZoomModalOpen}
        onCancel={() => setQrZoomModalOpen(false)}
        footer={null}
        width="min(680px, 95vw)"
        centered
        title={
          <div className="flex items-center justify-between pr-6">
            <span className="font-extrabold text-base text-slate-900">{t("qrModalTitle", "Mã QR Chuyển Khoản Thủ Quỹ (TPBank)")}</span>
            <Tag color="blue" className="font-bold text-xs">{qrAccHolder}</Tag>
          </div>
        }
        className="text-center rounded-3xl"
        style={{ top: 20 }}
      >
        <div className="py-4 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl border-2 border-blue-200 max-w-[500px] w-full" style={{ maxWidth: "min(500px, 100%)" }}>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
              <Image
                src={vietQrImageUrl}
                alt="Mã QR chuyển khoản phóng to"
                fill
                sizes="(max-width: 640px) 95vw, 500px"
                loading="lazy"
                unoptimized={vietQrImageUrl.startsWith("http")}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full max-w-[500px] text-left text-xs space-y-1.5">
            <p className="m-0 text-slate-700">{t("qrModalBankPrefix", "Ngân hàng:")} <b>TPBank (Ngân hàng TMCP Tiên Phong)</b></p>
            <p className="m-0 text-slate-700">{t("qrModalAccPrefix", "Số tài khoản:")} <b className="font-mono text-sm text-primary">{qrAccNumber}</b></p>
            <p className="m-0 text-slate-700">{t("qrModalHolderPrefix", "Chủ tài khoản:")} <b>{qrAccHolder}</b></p>
            <p className="m-0 text-slate-700">{t("qrModalAmountPrefix", "Số tiền:")} <b>{qrAmount.toLocaleString("vi-VN")} đ</b></p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={vietQrImageUrl}
              download={`VietQR_${qrAccHolder}_TPBank.png`}
              target="_blank"
              rel="noreferrer"
            >
              <Button type="primary" icon={<DownloadOutlined />} className="rounded-xl font-bold bg-primary h-11 min-h-[44px] px-5">
                {t("qrModalDownload", "Tải Ảnh QR Về Điện Thoại")}
              </Button>
            </a>
            <Button onClick={() => setQrZoomModalOpen(false)} className="rounded-xl font-bold h-11 min-h-[44px] px-5">
              {t("close", "Đóng")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bill Preview Modal */}
      <Modal
        open={billPreviewModalOpen}
        onCancel={() => setBillPreviewModalOpen(false)}
        footer={null}
        title={t("billModalTitle", "Minh Chứng Biên Lai Đã Nộp")}
        width="min(520px, 95vw)"
        centered
        className="rounded-2xl text-center"
      >
        {activePayment?.proofImageUrl && (
          <div className="relative mx-auto mt-3 h-[60vh] max-h-[560px] min-h-[280px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
            <Image
              src={activePayment.proofImageUrl}
              alt="Ảnh biên lai đã nộp"
              fill
              sizes="(max-width: 640px) 95vw, 520px"
              loading="lazy"
              unoptimized={activePayment.proofImageUrl.startsWith("http")}
              className="object-contain"
            />
          </div>
        )}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => setBillPreviewModalOpen(false)}
            className="rounded-xl font-bold h-11 min-h-[44px] px-5"
          >
            {t("close", "Đóng")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
