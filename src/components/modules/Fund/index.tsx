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
  Divider,
  Statistic,
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
  InfoCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  CheckOutlined,
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

  // Form states
  const [proofImageUrl, setProofImageUrl] = useState<string>("");
  const [transactionCode, setTransactionCode] = useState<string>("");
  const [memberNote, setMemberNote] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Modal preview
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const apiServer = process.env.NEXT_PUBLIC_API_SERVER || "http://localhost:5000";

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewModalOpen(false);
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
        setActiveCampaign(json.data?.activeCampaign || null);
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

  // Copy helper
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
        // Fallback: convert to base64 preview if direct upload not configured
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
    return false; // prevent default upload
  };

  // Submit proof
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
          amount: activeCampaign.amount,
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

  // Construct dynamic VietQR URL
  const qrAmount = activeCampaign?.amount || 100000;
  const qrBankCode = activeCampaign?.bankInfo?.bankCode || "MB";
  const qrAccNumber = activeCampaign?.bankInfo?.accountNumber || "0912345678";
  const qrAccHolder = encodeURIComponent(activeCampaign?.bankInfo?.accountHolder || "CLB LAP TRINH FU DEVER");
  const qrSyntax = encodeURIComponent(activeCampaign?.bankInfo?.transferSyntaxTemplate || "DEVER QUY CLB");
  const dynamicQrUrl = `https://img.vietqr.io/image/${qrBankCode}-${qrAccNumber}-compact2.png?amount=${qrAmount}&addInfo=${qrSyntax}&accountName=${qrAccHolder}`;

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton active paragraph={{ rows: 4 }} />
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={3} className="!mb-1 flex items-center gap-2 text-slate-900">
            <WalletOutlined className="text-[#0066CC]" /> Quỹ Hoạt Động &amp; Đóng Quỹ CLB
          </Title>
          <Text type="secondary" className="text-xs">
            Thực hiện nghĩa vụ đóng quỹ thành viên để duy trì sinh hoạt, trang thiết bị Lab và tài trợ giải thưởng.
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchData}
          className="rounded-xl text-xs font-semibold self-start sm:self-auto"
        >
          Làm mới
        </Button>
      </div>

      {/* 3-Way Status Card */}
      {activePayment?.status === "approved" && (
        <Card className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <SafetyCertificateOutlined className="text-3xl" />
              </div>
              <div>
                <Tag color="success" className="font-bold text-xs">ĐÃ HOÀN THÀNH NGHĨA VỤ QUÝ</Tag>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Bạn đã đóng quỹ thành công!</h3>
                <p className="text-xs text-slate-600">
                  Kỳ quỹ: <b>{activeCampaign?.title}</b> • Số tiền: <b>{(activePayment.amount || 100000).toLocaleString("vi-VN")} đ</b>
                </p>
              </div>
            </div>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => setPreviewModalOpen(true)}
              className="rounded-xl font-semibold text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100"
            >
              Xem Lại Biên Lai
            </Button>
          </div>
        </Card>
      )}

      {activePayment?.status === "pending" && (
        <Card className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                <ClockCircleOutlined className="text-3xl" />
              </div>
              <div>
                <Tag color="warning" className="font-bold text-xs">ĐANG CHỜ ĐỐI SOÁT</Tag>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Minh chứng của bạn đang được Ban Quản Trị kiểm tra</h3>
                <p className="text-xs text-slate-600">
                  Đã nộp lúc: {dayjs(activePayment.createdAt).format("HH:mm DD/MM/YYYY")}. Chúng tôi sẽ xác nhận sớm nhất!
                </p>
              </div>
            </div>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => setPreviewModalOpen(true)}
              className="rounded-xl font-semibold text-xs border-amber-300 text-amber-800 hover:bg-amber-100"
            >
              Xem Biên Lai Đã Nộp
            </Button>
          </div>
        </Card>
      )}

      {activePayment?.status === "rejected" && (
        <Alert
          type="error"
          showIcon
          className="rounded-2xl"
          message="Minh chứng đóng quỹ bị từ chối"
          description={
            <div className="space-y-1 mt-1 text-xs">
              <p>Lý do từ Ban Quản Trị: <b>{activePayment.reviewNotes || "Ảnh minh chứng không rõ ràng hoặc chuyển khoản sai cú pháp."}</b></p>
              <p>Vui lòng kiểm tra lại và nộp lại biên lai hợp lệ bên dưới.</p>
            </div>
          }
        />
      )}

      {/* Main Grid: Smart VietQR & Proof Upload Form */}
      {(!activePayment || activePayment.status === "rejected" || activePayment.status === "pending") && activeCampaign && (
        <Row gutter={[24, 24]}>
          {/* Column 1: Smart VietQR Card */}
          <Col xs={24} lg={12}>
            <Card className="rounded-3xl border border-blue-200/80 shadow-md h-full flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <QrcodeOutlined className="text-xl text-[#0066CC]" />
                    <span className="font-bold text-slate-900 text-sm">Mã Chuyển Khoản VietQR Nhanh</span>
                  </div>
                  <Tag color="processing" className="font-bold text-xs">{activeCampaign.semester}</Tag>
                </div>

                {/* QR Image Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={dynamicQrUrl}
                    alt="VietQR DEVER Fund"
                    className="max-h-64 rounded-xl shadow-sm border border-slate-200"
                  />
                  <p className="text-[11px] text-slate-500 mt-2 text-center">
                    Mở ứng dụng Ngân hàng (MB, VCB, Techcombank, TPB...) quét mã để tự điền số tiền và cú pháp.
                  </p>
                </div>

                {/* Bank Details Table with 1-Click Copy */}
                <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/60">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-bold text-slate-800">{activeCampaign.bankInfo?.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/60">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{activeCampaign.bankInfo?.accountNumber}</span>
                      <Tooltip title="Sao chép số TK">
                        <Button
                          type="text"
                          size="small"
                          icon={copiedKey === "acc" ? <CheckOutlined className="text-emerald-600" /> : <CopyOutlined />}
                          onClick={() => handleCopy(activeCampaign.bankInfo.accountNumber, "acc")}
                          className="h-6 w-6 p-0"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/60">
                    <span className="text-slate-500">Chủ tài khoản:</span>
                    <span className="font-bold text-slate-800">{activeCampaign.bankInfo?.accountHolder}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-blue-100/60">
                    <span className="text-slate-500">Số tiền:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0066CC] text-sm">{(activeCampaign.amount || 100000).toLocaleString("vi-VN")} đ</span>
                      <Tooltip title="Sao chép số tiền">
                        <Button
                          type="text"
                          size="small"
                          icon={copiedKey === "amount" ? <CheckOutlined className="text-emerald-600" /> : <CopyOutlined />}
                          onClick={() => handleCopy(String(activeCampaign.amount), "amount")}
                          className="h-6 w-6 p-0"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500">Nội dung chuyển khoản:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-700">{activeCampaign.bankInfo?.transferSyntaxTemplate}</span>
                      <Tooltip title="Sao chép nội dung">
                        <Button
                          type="text"
                          size="small"
                          icon={copiedKey === "syntax" ? <CheckOutlined className="text-emerald-600" /> : <CopyOutlined />}
                          onClick={() => handleCopy(activeCampaign.bankInfo.transferSyntaxTemplate, "syntax")}
                          className="h-6 w-6 p-0"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* Column 2: Upload Proof Form */}
          <Col xs={24} lg={12}>
            <Card className="rounded-3xl border border-slate-200/80 shadow-md h-full flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <UploadOutlined className="text-xl text-[#0066CC]" />
                    <span className="font-bold text-slate-900 text-sm">Nộp Minh Chứng Chuyển Khoản</span>
                  </div>
                  <span className="text-xs text-slate-400">Bước 2 / 2</span>
                </div>

                {/* Upload Component */}
                <div className="space-y-2">
                  <Text strong className="text-xs text-slate-700 block">
                    1. Tải lên ảnh chụp màn hình biên lai (Bill Banking) <span className="text-rose-500">*</span>
                  </Text>
                  
                  <Upload.Dragger
                    beforeUpload={handleUploadFile}
                    showUploadList={false}
                    className="p-4 rounded-2xl border-dashed border-2 border-slate-200 hover:border-[#0066CC] transition-colors bg-slate-50/50"
                  >
                    {proofImageUrl ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={proofImageUrl}
                          alt="Uploaded Bill"
                          className="max-h-36 mx-auto rounded-xl shadow border border-slate-200"
                        />
                        <p className="text-xs text-emerald-600 font-semibold">✓ Đã chọn ảnh biên lai. Nhấp để thay đổi.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4 text-center">
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined className="text-3xl text-[#0066CC]" />
                        </p>
                        <p className="text-xs font-semibold text-slate-700">Kéo thả hoặc nhấp để chọn ảnh biên lai</p>
                        <p className="text-[11px] text-slate-400">Hỗ trợ PNG, JPG, JPEG (tối đa 10MB)</p>
                      </div>
                    )}
                  </Upload.Dragger>
                </div>

                {/* Transaction Code */}
                <div className="space-y-1">
                  <Text strong className="text-xs text-slate-700 block">2. Mã giao dịch ngân hàng (Tùy chọn):</Text>
                  <Input
                    placeholder="Ví dụ: FT2412345678 hoặc mã tham chiếu"
                    value={transactionCode}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="rounded-xl text-xs py-2"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <Text strong className="text-xs text-slate-700 block">3. Lời nhắn / Ghi chú thêm (Tùy chọn):</Text>
                  <TextArea
                    rows={2}
                    placeholder="Ghi chú thêm nếu bạn nộp thay hoặc có lưu ý..."
                    value={memberNote}
                    onChange={(e) => setMemberNote(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                {/* Submit CTA */}
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={submitting || uploadingImage}
                  disabled={!proofImageUrl}
                  onClick={handleSubmitPayment}
                  className="bg-[#0066CC] hover:bg-[#004C99] rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all h-12 mt-4"
                >
                  Xác Nhận Đã Chuyển Khoản
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Payment History Table */}
      <Card className="rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarOutlined className="text-[#0066CC]" /> Lịch Sử Đóng Quỹ Của Bạn
          </h3>
          <span className="text-xs text-slate-500">Tổng cộng {history.length} lần đóng</span>
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
                if (status === "approved") return <Tag color="success">Đã duyệt</Tag>;
                if (status === "rejected") return <Tag color="error">Bị từ chối</Tag>;
                return <Tag color="warning">Chờ duyệt</Tag>;
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
          className="rounded-2xl overflow-hidden"
        />
      </Card>

      {/* Bill Preview Modal */}
      <Modal
        open={previewModalOpen}
        onCancel={() => setPreviewModalOpen(false)}
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
