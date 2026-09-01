"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import webStorageClient from "@/utils/webStorageClient";
import dayjs from "dayjs";

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

export default function FundModule() {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeCampaign, setActiveCampaign] = useState<FundCampaign | null>(null);
  const [activePayment, setActivePayment] = useState<FundPayment | null>(null);
  const [history, setHistory] = useState<FundPayment[]>([]);

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

  const apiServer = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";

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
    try {
      const token = webStorageClient.getToken();
      const res = await fetch(`${apiServer}/api/v1/funds/my-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        const camp = json.data?.activeCampaign || null;
        setActiveCampaign(camp);
        setActivePayment(json.data?.activePayment || null);
        setHistory(json.data?.history || []);
      }
    } catch {
      message.error("Không thể tải thông tin quỹ CLB.");
    } finally {
      setLoading(false);
    }
  }, [apiServer]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Copy helper with animated checkmark
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    message.success(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Upload image to backend Cloudflare R2
  const handleUploadFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const token = webStorageClient.getToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${apiServer}/api/v1/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const imageUrl = json.url || json.data?.url || json.secure_url;
        setProofImageUrl(imageUrl);
        message.success("Tải ảnh biên lai lên thành công!");
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setProofImageUrl(reader.result as string);
          message.success("Đã chọn ảnh biên lai!");
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setProofImageUrl(reader.result as string);
        message.success("Đã chọn ảnh biên lai!");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
    return false;
  };

  // Submit payment proof
  const handleSubmitPayment = async () => {
    if (!activeCampaign) return;
    if (!proofImageUrl) {
      message.warning("Vui lòng tải lên ảnh chụp màn hình biên lai chuyển khoản!");
      return;
    }

    setSubmitting(true);
    try {
      const token = webStorageClient.getToken();
      const res = await fetch(`${apiServer}/api/v1/funds/submit-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId: activeCampaign._id,
          proofImageUrl,
          transactionCode,
          note: memberNote,
          amount: activeCampaign.amount || 100000,
        }),
      });

      if (res.ok) {
        message.success("Đã gửi minh chứng đóng quỹ thành công! Ban Quản Trị sẽ đối soát sớm.");
        fetchData();
      } else {
        const err = await res.json();
        message.error(err.message || "Gửi thất bại.");
      }
    } catch {
      message.error("Lỗi kết nối máy chủ.");
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

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066CC] text-xs font-bold mb-2 shadow-sm">
            <ThunderboltOutlined />
            <span>CỔNG ĐÓNG QUỸ FU-DEVER</span>
          </div>
          <Title level={2} className="!mb-1 text-slate-900 font-black tracking-tight">
            Quỹ Hoạt Động &amp; Phát Triển CLB
          </Title>
          <Text type="secondary" className="text-sm">
            Thực hiện nghĩa vụ đóng quỹ thành viên để duy trì sinh hoạt, trang thiết bị Project Lab và tài trợ giải thưởng.
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchData}
          className="rounded-xl text-xs font-bold self-start sm:self-auto h-10 px-4 shadow-sm border-slate-200 hover:border-[#0066CC]"
        >
          Làm mới
        </Button>
      </div>

      {/* 3-Way Status Notification Card */}
      {activePayment?.status === "approved" && (
        <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 shadow-xl shadow-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
              <SafetyCertificateOutlined style={{ fontSize: "32px" }} />
            </div>
            <div>
              <Tag color="success" className="font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                ✓ ĐÃ HOÀN THÀNH NGHĨA VỤ QUỸ
              </Tag>
              <h3 className="text-xl font-black text-slate-900 mt-1">Chúc mừng! Bạn đã hoàn thành đóng quỹ kỳ này</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Kỳ quỹ: <b>{activeCampaign?.title}</b> • Số tiền đã xác nhận: <b>{(activePayment.amount || 100000).toLocaleString("vi-VN")} đ</b>
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => setBillPreviewModalOpen(true)}
            className="rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 h-10 px-5 shadow-md"
          >
            Xem Lại Biên Lai
          </Button>
        </div>
      )}

      {activePayment?.status === "pending" && (
        <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-white p-6 shadow-xl shadow-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <ClockCircleOutlined style={{ fontSize: "32px" }} />
            </div>
            <div>
              <Tag color="warning" className="font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                ⏳ ĐANG CHỜ ĐỐI SOÁT
              </Tag>
              <h3 className="text-xl font-black text-slate-900 mt-1">Minh chứng của bạn đang được Ban Quản Trị kiểm tra</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Đã nộp lúc: <b>{dayjs(activePayment.createdAt).format("HH:mm DD/MM/YYYY")}</b>. Ban Quản Trị sẽ duyệt ngay khi tiền về tài khoản.
              </p>
            </div>
          </div>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setBillPreviewModalOpen(true)}
            className="rounded-xl font-bold text-xs border-amber-300 text-amber-800 hover:bg-amber-100 h-10 px-5 shadow-sm"
          >
            Xem Biên Lai Đã Nộp
          </Button>
        </div>
      )}

      {activePayment?.status === "rejected" && (
        <Alert
          type="error"
          showIcon
          className="rounded-2xl border-2 border-rose-300 shadow-sm p-4"
          message={<span className="font-bold text-rose-800 text-sm">Minh chứng đóng quỹ bị từ chối</span>}
          description={
            <div className="space-y-1.5 mt-1 text-xs text-rose-700 font-medium">
              <p>Lý do từ Ban Quản Trị: <b>{activePayment.reviewNotes || "Ảnh minh chứng không rõ ràng hoặc chuyển khoản sai cú pháp."}</b></p>
              <p>Vui lòng kiểm tra lại thông tin và tải lên biên lai hợp lệ bên dưới.</p>
            </div>
          }
        />
      )}

      {/* Main Unified 2-Column Payment Grid */}
      {(!activePayment || activePayment.status === "rejected" || activePayment.status === "pending") && activeCampaign && (
        <Row gutter={[32, 32]}>
          {/* Column 1: Unified Payment Hub (Massive QR Code + Bank Details) */}
          <Col xs={24} lg={13}>
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden flex flex-col justify-between h-full">
              {/* Card Header Bar */}
              <div className="bg-gradient-to-r from-[#003B73] via-[#004C99] to-[#0066CC] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <BankOutlined className="text-xl text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white m-0">
                      {activeCampaign.bankInfo?.bankName || "TPBank (Ngân hàng Tiên Phong)"}
                    </h3>
                    <span className="text-xs text-blue-100 font-mono">Tài khoản Thủ Quỹ Chính Thức</span>
                  </div>
                </div>
                <Tag color="gold" className="font-bold text-xs px-2.5 py-0.5 rounded-full border-0 shadow-sm">
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
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        qrMode === "vietqr" ? "bg-[#0066CC] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      ⚡ Mã VietQR Chuẩn HD
                    </button>
                    <button
                      onClick={() => setQrMode("custom")}
                      className={`px-3.5 py-1.5 rounded-lg transition-all ${
                        qrMode === "custom" ? "bg-[#0066CC] text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      🖼️ Ảnh Gốc Thủ Quỹ
                    </button>
                  </div>

                  {/* QR Image Frame - Large & Crisp */}
                  <div className="relative group p-3 bg-white rounded-2xl shadow-xl border-2 border-slate-200 max-w-[320px] w-full">
                    {qrMode === "vietqr" ? (
                      <img
                        src={vietQrImageUrl}
                        alt="VietQR HD Napas247"
                        className="w-full h-auto object-contain rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        onClick={() => setQrZoomModalOpen(true)}
                      />
                    ) : (
                      <div className="overflow-hidden rounded-xl bg-slate-900 max-h-80 flex items-center justify-center cursor-pointer" onClick={() => setQrZoomModalOpen(true)}>
                        <img
                          src={customQrImageUrl}
                          alt="Ảnh Gốc Thủ Quỹ"
                          className="w-full h-auto object-contain hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    
                    <div
                      onClick={() => setQrZoomModalOpen(true)}
                      className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm cursor-pointer backdrop-blur-[2px]"
                    >
                      <ZoomInOutlined style={{ fontSize: 20 }} /> Nhấp để phóng to toàn màn hình
                    </div>
                  </div>

                  {/* Actions under QR */}
                  <div className="flex items-center gap-3 pt-1">
                    <Button
                      type="primary"
                      icon={<ZoomInOutlined />}
                      onClick={() => setQrZoomModalOpen(true)}
                      className="rounded-xl text-xs font-bold bg-[#0066CC] h-9 shadow-sm"
                    >
                      Phóng To Mã QR
                    </Button>
                    <a
                      href={currentDisplayQr}
                      download={`QR_ThuQuy_DEVER_${activeCampaign.semester}.png`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button icon={<DownloadOutlined />} className="rounded-xl text-xs font-bold h-9">
                        Tải Ảnh QR
                      </Button>
                    </a>
                  </div>

                  <p className="text-xs text-slate-600 font-medium m-0">
                    Mở app Ngân hàng (TPBank, MB, VCB, Momo...) quét mã để tự điền số tiền và nội dung chuyển khoản.
                  </p>
                </div>

                {/* Bank Account Info Rows with 1-Click Copy */}
                <div className="space-y-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-xs">
                  {/* Account Number */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">Số tài khoản nhận:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black text-slate-900 tracking-wider">
                        {qrAccNumber}
                      </span>
                      <Tooltip title="Sao chép số tài khoản">
                        <Button
                          size="small"
                          icon={copiedKey === "acc" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(qrAccNumber, "acc")}
                          className="h-8 px-2.5 rounded-lg font-bold text-xs border-blue-200 bg-white shadow-sm"
                        >
                          {copiedKey === "acc" ? "Đã chép" : "Chép"}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Account Holder */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">Chủ tài khoản (Thủ Quỹ):</span>
                    <span className="font-black text-sm text-slate-900 uppercase tracking-wide">
                      {qrAccHolder}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/80">
                    <span className="text-slate-500 font-medium text-xs">Mức thu kỳ này:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#0066CC] text-base">
                        {qrAmount.toLocaleString("vi-VN")} đ
                      </span>
                      <Tooltip title="Sao chép số tiền">
                        <Button
                          size="small"
                          icon={copiedKey === "amount" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(String(qrAmount), "amount")}
                          className="h-8 px-2.5 rounded-lg font-bold text-xs border-blue-200 bg-white shadow-sm"
                        >
                          {copiedKey === "amount" ? "Đã chép" : "Chép"}
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Transfer Memo Syntax */}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 font-medium text-xs">Cú pháp chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-800 bg-amber-100/90 px-2.5 py-1 rounded-md border border-amber-300">
                        {qrSyntax}
                      </span>
                      <Tooltip title="Sao chép cú pháp">
                        <Button
                          size="small"
                          icon={copiedKey === "syntax" ? <CheckOutlined className="text-emerald-600 font-bold" /> : <CopyOutlined />}
                          onClick={() => handleCopy(qrSyntax, "syntax")}
                          className="h-8 px-2.5 rounded-lg font-bold text-xs border-amber-300 bg-white text-amber-900 shadow-sm"
                        >
                          {copiedKey === "syntax" ? "Đã chép" : "Chép"}
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
            <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl p-6 sm:p-7 h-full flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <UploadOutlined className="text-xl text-[#0066CC]" />
                    <h3 className="font-extrabold text-slate-900 text-base m-0">Nộp Minh Chứng Đóng Quỹ</h3>
                  </div>
                  <Tag color="blue" className="font-bold text-xs">Bước 2 / 2</Tag>
                </div>

                {/* Upload Component Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    1. Tải lên ảnh chụp biên lai chuyển khoản (Bill Banking) <span className="text-rose-500">*</span>
                  </label>

                  <Upload.Dragger
                    beforeUpload={handleUploadFile}
                    showUploadList={false}
                    className="p-5 rounded-2xl border-dashed border-2 border-slate-300 hover:border-[#0066CC] transition-colors bg-slate-50/60"
                  >
                    {proofImageUrl ? (
                      <div className="space-y-3 text-center">
                        <img
                          src={proofImageUrl}
                          alt="Uploaded Bill Preview"
                          className="max-h-52 mx-auto rounded-xl shadow-md border border-slate-200 object-contain"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-emerald-600 font-bold">✓ Đã tải ảnh biên lai thành công</span>
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
                          >
                            Đổi ảnh
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 py-6 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066CC] flex items-center justify-center mx-auto shadow-inner">
                          <FileImageOutlined style={{ fontSize: "28px" }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 m-0">Kéo thả hoặc nhấp để chọn ảnh biên lai</p>
                          <p className="text-xs text-slate-400 m-0 mt-1">Hỗ trợ PNG, JPG, JPEG (tối đa 10MB)</p>
                        </div>
                      </div>
                    )}
                  </Upload.Dragger>
                </div>

                {/* Transaction Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    2. Mã giao dịch ngân hàng (Mã FT / Số tham chiếu):
                  </label>
                  <Input
                    placeholder="Ví dụ: FT2412345678..."
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="rounded-xl text-xs py-2.5 font-mono"
                  />
                </div>

                {/* Member Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    3. Lời nhắn / Ghi chú thêm (Tùy chọn):
                  </label>
                  <TextArea
                    rows={2}
                    placeholder="Ghi chú thêm nếu bạn nộp hộ hoặc chuyển từ tài khoản khác..."
                    value={memberNote}
                    onChange={(e) => setMemberNote(e.target.value)}
                    className="rounded-xl text-xs"
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
                  className="bg-[#0066CC] hover:bg-[#004C99] rounded-2xl font-black text-sm shadow-xl shadow-blue-600/25 active:scale-[0.98] transition-all h-14 text-white flex items-center justify-center gap-2"
                >
                  <span>Xác Nhận Đã Chuyển Khoản &amp; Nộp Minh Chứng</span>
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
            <DollarOutlined className="text-[#0066CC]" /> Lịch Sử Đóng Quỹ Của Bạn
          </h3>
          <span className="text-xs text-slate-500 font-medium">Tổng cộng {history.length} lần đóng</span>
        </div>

        <Table
          dataSource={history}
          rowKey="_id"
          pagination={false}
          columns={[
            {
              title: "Kỳ thu quỹ",
              key: "campaign",
              render: (_: any, record: FundPayment) => (
                <div>
                  <Text strong className="text-xs text-slate-900 block">{record.campaignId?.title || "Quỹ CLB"}</Text>
                  <Tag color="blue" className="text-[10px] mt-0.5">{record.campaignId?.semester || "Fall 2026"}</Tag>
                </div>
              ),
            },
            {
              title: "Số tiền",
              dataIndex: "amount",
              key: "amount",
              render: (amount: number) => (
                <Text strong className="text-xs text-[#0066CC]">
                  {(amount || 100000).toLocaleString("vi-VN")} đ
                </Text>
              ),
            },
            {
              title: "Mã giao dịch",
              dataIndex: "transactionCode",
              key: "transactionCode",
              render: (code: string) => <Text code className="text-xs">{code || "N/A"}</Text>,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              key: "status",
              render: (status: string) => {
                if (status === "approved") return <Tag color="success" icon={<CheckCircleOutlined />}>Đã duyệt</Tag>;
                if (status === "rejected") return <Tag color="error" icon={<CloseCircleOutlined />}>Bị từ chối</Tag>;
                return <Tag color="warning" icon={<ClockCircleOutlined />}>Chờ duyệt</Tag>;
              },
            },
            {
              title: "Ngày nộp",
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
        width={680}
        title={
          <div className="flex items-center justify-between pr-6">
            <span className="font-extrabold text-base text-slate-900">Mã QR Chuyển Khoản Thủ Quỹ (TPBank)</span>
            <Tag color="blue" className="font-bold text-xs">{qrAccHolder}</Tag>
          </div>
        }
        className="text-center rounded-3xl"
        style={{ top: 20 }}
      >
        <div className="py-4 flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-white rounded-3xl shadow-2xl border-2 border-blue-200 max-w-[500px] w-full">
            <img
              src={vietQrImageUrl}
              alt="QR Code Zoom Khổng Lồ"
              className="w-full h-auto object-contain rounded-2xl"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 w-full max-w-[500px] text-left text-xs space-y-1.5">
            <p className="m-0 text-slate-700">Ngân hàng: <b>TPBank (Ngân hàng TMCP Tiên Phong)</b></p>
            <p className="m-0 text-slate-700">Số tài khoản: <b className="font-mono text-sm text-[#0066CC]">{qrAccNumber}</b></p>
            <p className="m-0 text-slate-700">Chủ tài khoản: <b>{qrAccHolder}</b></p>
            <p className="m-0 text-slate-700">Số tiền: <b>{qrAmount.toLocaleString("vi-VN")} đ</b></p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={vietQrImageUrl}
              download={`VietQR_${qrAccHolder}_TPBank.png`}
              target="_blank"
              rel="noreferrer"
            >
              <Button type="primary" icon={<DownloadOutlined />} className="rounded-xl font-bold bg-[#0066CC] h-10 px-5">
                Tải Ảnh QR Về Điện Thoại
              </Button>
            </a>
            <Button onClick={() => setQrZoomModalOpen(false)} className="rounded-xl font-bold h-10 px-5">
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bill Preview Modal */}
      <Modal
        open={billPreviewModalOpen}
        onCancel={() => setBillPreviewModalOpen(false)}
        footer={null}
        title="Minh Chứng Biên Lai Đã Nộp"
        className="rounded-2xl text-center"
      >
        {activePayment?.proofImageUrl && (
          <img
            src={activePayment.proofImageUrl}
            alt="Bill Proof"
            className="max-h-96 mx-auto rounded-xl shadow-md border border-slate-200 mt-3"
          />
        )}
      </Modal>
    </div>
  );
}
