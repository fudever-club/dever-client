"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Tag,
  Divider,
  message,
  Card,
  Modal,
  Tabs,
  Tooltip,
  Row,
  Col,
  Space,
  Popconfirm,
} from "antd";
import {
  PenTool,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  UploadCloud,
  Code2,
  Table as TableIcon,
  AlertTriangle,
  Lightbulb,
  Workflow,
  Eye,
  Columns,
  Maximize2,
  Save,
  Send,
  Trash2,
  Edit3,
  Clock,
  FileText,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  Tag as TagIcon,
  ChevronRight,
  HelpCircle,
  X,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/hooks/redux-toolkit";
import webStorageClient from "@/utils/webStorageClient";

const { TextArea } = Input;
const { Option } = Select;

const CATEGORIES = [
  "Web & Frontend",
  "Backend & Distributed Systems",
  "Data Structure & Algorithms",
  "DevOps & Cloud Computing",
  "AI, Data & Machine Learning",
  "Mobile App Development",
  "Cyber Security",
  "Club Activities & Events",
];

const PRESET_TAGS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Golang",
  "Rust",
  "Python",
  "Java",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "LeetCode",
  "System Design",
  "Cloudflare",
  "TailwindCSS",
];

const CODE_LANGUAGES = [
  { label: "TypeScript", value: "typescript" },
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "SQL", value: "sql" },
  { label: "HTML/CSS", value: "html" },
  { label: "Bash / Shell", value: "bash" },
  { label: "Dockerfile", value: "dockerfile" },
  { label: "YAML / JSON", value: "yaml" },
];

const CALLOUT_PRESETS = [
  {
    type: "note",
    title: "Ghi chú (Note / Info)",
    icon: Lightbulb,
    badgeBg: "#EFF6FF",
    badgeBorder: "#93C5FD",
    badgeColor: "#0066CC",
    syntax: "> [!NOTE]\n> ",
    desc: "Khung thông tin bổ sung, giải thích ngữ cảnh kỹ thuật",
  },
  {
    type: "tip",
    title: "Mẹo hay (Pro Tip / Solution)",
    icon: Sparkles,
    badgeBg: "#ECFDF5",
    badgeBorder: "#6EE7B7",
    badgeColor: "#059669",
    syntax: "> [!TIP]\n> ",
    desc: "Mẹo tối ưu hiệu năng, best practices, thủ thuật code",
  },
  {
    type: "warning",
    title: "Cảnh báo (Warning / Important)",
    icon: AlertTriangle,
    badgeBg: "#FFFBEB",
    badgeBorder: "#FCD34D",
    badgeColor: "#D97706",
    syntax: "> [!WARNING]\n> ",
    desc: "Lưu ý rủi ro, sự cố bảo mật hoặc tương thích phiên bản",
  },
  {
    type: "caution",
    title: "Lỗi thường gặp (Caution / Gotchas)",
    icon: HelpCircle,
    badgeBg: "#FFF1F2",
    badgeBorder: "#FDA4AF",
    badgeColor: "#E11D48",
    syntax: "> [!CAUTION]\n> ",
    desc: "Hành động có rủi ro gây mất dữ liệu hoặc crash ứng dụng",
  },
];

const MERMAID_PRESETS = [
  {
    id: "architecture",
    title: "Kiến Trúc Client - Server - Database",
    desc: "Mô tả luồng giao tiếp giữa Frontend, Backend và Database Atlas",
    code: "```mermaid\ngraph TD\n  Client[Next.js Client] -->|REST / JWT| API[Express API Server]\n  API -->|Mongoose| DB[(MongoDB Atlas)]\n  API -->|S3 SDK| Storage[(Cloudflare R2 Bucket)]\n```\n",
  },
  {
    id: "sequence",
    title: "Sequence Diagram: Xác Thực JWT",
    desc: "Quy trình đăng nhập và xác thực phiên làm việc an toàn",
    code: "```mermaid\nsequenceDiagram\n  autonumber\n  actor User\n  participant Client as Next.js\n  participant Server as Backend API\n  participant DB as MongoDB\n  User->>Client: Nhập Email & Mật khẩu\n  Client->>Server: POST /api/v1/auth/login\n  Server->>DB: Tìm User & So khớp Bcrypt\n  DB-->>Server: Trả về User Object\n  Server-->>Client: JWT Token (1d)\n  Client-->>User: Đăng nhập thành công\n```\n",
  },
  {
    id: "gitflow",
    title: "Sơ Đồ Phân Nhánh Git Branching",
    desc: "Quy chuẩn đóng góp mã nguồn (Main, Develop, Feature)",
    code: "```mermaid\ngraph LR\n  Main[main branch] --- Staging[staging branch]\n  Staging --- Dev[develop branch]\n  Dev --> Feat1[feature/blog-editor]\n  Dev --> Feat2[feature/r2-storage]\n```\n",
  },
];

// Helper to render code snippet in preview with 1-click copy
function CodeBlockWithCopy({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: "16px 0",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #1E293B",
        backgroundColor: "#0D1117",
        color: "#F8FAFC",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          backgroundColor: "#161B22",
          borderBottom: "1px solid #1E293B",
          fontSize: "12px",
          fontFamily: "monospace",
          color: "#94A3B8",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "bold", color: "#60A5FA" }}>
          <span style={{ height: "10px", width: "10px", borderRadius: "50%", backgroundColor: "#EF4444", display: "inline-block" }} />
          <span style={{ height: "10px", width: "10px", borderRadius: "50%", backgroundColor: "#F59E0B", display: "inline-block" }} />
          <span style={{ height: "10px", width: "10px", borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" }} />
          <span style={{ marginLeft: "8px" }}>{language || "text"}</span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 10px",
            borderRadius: "8px",
            backgroundColor: "#1E293B",
            color: "#E2E8F0",
            border: "1px solid #334155",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {copied ? <Check size={12} color="#34D399" /> : <Copy size={12} />}
          {copied ? "Đã sao chép" : "Sao chép"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "16px", fontSize: "13px", fontFamily: "monospace", overflowX: "auto", lineHeight: "1.6", color: "#E2E8F0" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Rich Interactive Markdown Live Renderer
function RichMarkdownRenderer({ content }: { content: string }) {
  if (!content.trim()) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "#94A3B8" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "20px",
            backgroundColor: "#EFF6FF",
            color: "#0066CC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
          }}
        >
          <PenTool size={28} />
        </div>
        <p style={{ fontSize: "15px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
          Nội dung xem trước thời gian thực sẽ hiển thị tại đây
        </p>
        <p style={{ fontSize: "13px", color: "#64748B", maxWidth: "480px", margin: "0 auto" }}>
          Hỗ trợ đầy đủ khối Code đa ngôn ngữ, Khung ghi chú (Callouts), Sơ đồ Mermaid, Bảng biểu và Ảnh chất lượng cao.
        </p>
      </div>
    );
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = "";

  lines.forEach((line, index) => {
    // Code block toggle
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlockWithCopy
            key={`code-${index}`}
            code={codeBlockContent.join("\n")}
            language={codeBlockLang}
          />
        );
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = "";
      } else {
        inCodeBlock = true;
        codeBlockLang = line.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }

    // Heading H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={index}
          style={{
            fontSize: "26px",
            fontWeight: "800",
            color: "#0F172A",
            borderBottom: "2px solid #E2E8F0",
            paddingBottom: "8px",
            marginTop: "24px",
            marginBottom: "12px",
          }}
        >
          {line.replace("# ", "")}
        </h1>
      );
      return;
    }

    // Heading H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={index}
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0066CC",
            borderBottom: "1px solid #F1F5F9",
            paddingBottom: "6px",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          {line.replace("## ", "")}
        </h2>
      );
      return;
    }

    // Heading H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={index}
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1E293B",
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          {line.replace("### ", "")}
        </h3>
      );
      return;
    }

    // Callout Alert Box
    if (line.startsWith("> [!NOTE]") || line.startsWith("> [!TIP]") || line.startsWith("> [!WARNING]") || line.startsWith("> [!CAUTION]")) {
      const isTip = line.includes("TIP");
      const isWarning = line.includes("WARNING");
      const isCaution = line.includes("CAUTION");

      const bgColor = isCaution ? "#FFF1F2" : isWarning ? "#FFFBEB" : isTip ? "#ECFDF5" : "#EFF6FF";
      const borderColor = isCaution ? "#F43F5E" : isWarning ? "#F59E0B" : isTip ? "#10B981" : "#0066CC";
      const textColor = isCaution ? "#9F1239" : isWarning ? "#92400E" : isTip ? "#065F46" : "#004C99";

      elements.push(
        <div
          key={index}
          style={{
            margin: "14px 0",
            padding: "14px 16px",
            borderRadius: "14px",
            border: `1px solid ${borderColor}50`,
            backgroundColor: bgColor,
            color: textColor,
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            boxShadow: "0 2px 8px -2px rgba(0,0,0,0.05)",
          }}
        >
          <Lightbulb size={18} style={{ flexShrink: 0, marginTop: "1px", color: borderColor }} />
          <div>
            <strong>{isCaution ? "LỖI NGUY HIỂM:" : isWarning ? "CẢNH BÁO QUAN TRỌNG:" : isTip ? "MẸO KỸ THUẬT:" : "GHI CHÚ HỌC THUẬT:"}</strong>
          </div>
        </div>
      );
      return;
    }

    // Callout continuation
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={index}
          style={{
            margin: "6px 0 12px 0",
            border: "1px solid #E2E8F0",
            color: "#1E293B",
            fontStyle: "italic",
            fontSize: "13px",
            backgroundColor: "#F8FAFC",
            borderRadius: "12px",
            padding: "10px 14px",
          }}
        >
          {line.replace("> ", "")}
        </blockquote>
      );
      return;
    }

    // Image parser (Markdown ![alt](url), HTML <img src="...">, or direct image URL)
    const mdImgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
    const htmlImgMatch = line.match(/<img.*?src=["'](.*?)["'].*?>/i);
    const directUrlMatch = /^https?:\/\/\S+\.(?:png|jpe?g|webp|gif|svg)(\?\S*)?$/i.test(line.trim()) ? [line.trim(), "", line.trim()] : null;

    const imgMatch = mdImgMatch || htmlImgMatch || directUrlMatch;
    if (imgMatch) {
      const altText = mdImgMatch ? mdImgMatch[1] : "Hình ảnh minh họa";
      const imgSrc = mdImgMatch ? mdImgMatch[2] : htmlImgMatch ? htmlImgMatch[1] : line.trim();

      elements.push(
        <div
          key={index}
          style={{
            margin: "16px 0",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 12px -2px rgba(0,0,0,0.08)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt={altText} style={{ width: "100%", maxHeight: "380px", objectFit: "cover" }} />
          {altText && altText !== "Hình ảnh minh họa" && (
            <p style={{ textAlign: "center", fontSize: "11px", color: "#64748B", padding: "6px 12px", margin: 0, backgroundColor: "#F8FAFC", borderTop: "1px solid #F1F5F9", fontWeight: 600 }}>
              📷 {altText}
            </p>
          )}
        </div>
      );
      return;
    }

    // Bullet lists
    if (/^[-*]\s/.test(line)) {
      elements.push(
        <li key={index} style={{ marginLeft: "18px", listStyleType: "disc", fontSize: "13px", color: "#334155", lineHeight: "1.7" }}>
          {line.replace(/^[-*]\s/, "")}
        </li>
      );
      return;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={index} style={{ marginLeft: "18px", listStyleType: "decimal", fontSize: "13px", color: "#334155", lineHeight: "1.7" }}>
          {line.replace(/^\d+\.\s/, "")}
        </li>
      );
      return;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={index} style={{ height: "8px" }} />);
      return;
    }

    // Regular paragraph
    elements.push(
      <p key={index} style={{ fontSize: "13px", color: "#334155", lineHeight: "1.7", marginBottom: "6px", fontWeight: "normal" }}>
        {line}
      </p>
    );
  });

  return <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>{elements}</div>;
}

export default function CreateBlogModule() {
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [viewMode, setViewMode] = useState<"split" | "focus" | "preview">("split");
  const [loading, setLoading] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Content & Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web & Frontend");
  const [excerpt, setExcerpt] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["React", "TypeScript"]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Visual Studio Modals
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLang, setCodeLang] = useState("typescript");
  const [codeSnippet, setCodeSnippet] = useState("");

  const [isCalloutModalOpen, setIsCalloutModalOpen] = useState(false);
  const [selectedCallout, setSelectedCallout] = useState(CALLOUT_PRESETS[0]);
  const [calloutText, setCalloutText] = useState("");

  const [isMermaidModalOpen, setIsMermaidModalOpen] = useState(false);

  // Upload state
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingContentImg, setUploadingContentImg] = useState(false);

  // My Blogs list state
  const [myBlogs, setMyBlogs] = useState<any[]>([]);
  const [loadingMyBlogs, setLoadingMyBlogs] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const { userInfo } = useAppSelector((state: any) => state.auth);

  const textAreaRef = useRef<any>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const contentImgFileRef = useRef<HTMLInputElement>(null);

  const API_SERVER =
    process.env.NEXT_PUBLIC_API_SERVER ||
    "https://dever-backend-production.up.railway.app";

  // Realtime Metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeEstimate = `${Math.max(1, Math.ceil(wordCount / 200))} phút đọc`;

  // Auto-Save Draft to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("dever_blog_draft_v3");
    if (saved && !editingBlogId) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        if (parsed.coverUrl) setCoverUrl(parsed.coverUrl);
        if (parsed.content) setContent(parsed.content);
        if (parsed.selectedTags) setSelectedTags(parsed.selectedTags);
        if (parsed.savedAt) setLastSaved(parsed.savedAt);
      } catch (e) {}
    }
  }, [editingBlogId]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!content.trim() && !title.trim()) return;

    const timer = setTimeout(() => {
      const now = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const draftObj = {
        title,
        category,
        excerpt,
        coverUrl,
        content,
        selectedTags,
        savedAt: now,
      };
      localStorage.setItem("dever_blog_draft_v3", JSON.stringify(draftObj));
      setLastSaved(now);
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, category, excerpt, coverUrl, content, selectedTags]);

  // Fetch Member's Blogs
  const fetchMyBlogs = useCallback(async () => {
    const token = webStorageClient.getToken();
    if (!token) return;

    setLoadingMyBlogs(true);
    try {
      const res = await fetch(`${API_SERVER}/api/v1/blogs/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMyBlogs(data.data || []);
      }
    } catch (e) {
      // Quiet fail
    } finally {
      setLoadingMyBlogs(false);
    }
  }, [API_SERVER]);

  useEffect(() => {
    if (activeTab === "my-blogs") {
      fetchMyBlogs();
    }
  }, [activeTab, fetchMyBlogs]);

  // Insert formatting helper at cursor
  const insertFormatting = (prefix: string, suffix: string = "", placeholder: string = "văn bản") => {
    const textarea = textAreaRef.current?.resizableTextArea?.textArea || textAreaRef.current;
    if (!textarea) {
      const updated = content ? `${content}\n${prefix}${placeholder}${suffix}` : `${prefix}${placeholder}${suffix}`;
      setContent(updated);
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = content.substring(start, end) || placeholder;
    const replacement = `${prefix}${selectedText}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Direct Image Upload Helper
  const handleUploadImageFile = async (file: File, folder: string = "blog-images"): Promise<string | null> => {
    const token = webStorageClient.getToken();
    if (!token) {
      message.error("Vui lòng đăng nhập để tải ảnh lên bài viết.");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch(`${API_SERVER}/api/v1/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        return data.data?.url || null;
      } else {
        message.error(data.message || "Tải ảnh lên thất bại");
        return null;
      }
    } catch (e) {
      message.error("Lỗi kết nối khi tải ảnh lên");
      return null;
    }
  };

  // Cover Image Handlers
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await handleUploadImageFile(file, "blog-covers");
    if (url) {
      setCoverUrl(url);
      message.success("Đã tải ảnh bìa bài viết thành công!");
    }
    setUploadingCover(false);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingContentImg(true);
    const url = await handleUploadImageFile(file, "blog-images");
    if (url) {
      insertFormatting(`\n![${file.name.replace(/\.[^/.]+$/, "")}](${url})\n`, "", "");
      message.success("Đã tải và chèn ảnh vào bài viết!");
    }
    setUploadingContentImg(false);
  };

  // Clipboard Paste Screenshot handler
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          message.loading({ content: "Đang tải ảnh chụp màn hình lên...", key: "paste_img" });
          const url = await handleUploadImageFile(file, "blog-images");
          if (url) {
            message.success({ content: "Đã chèn ảnh chụp màn hình!", key: "paste_img" });
            insertFormatting(`\n![Screenshot](${url})\n`, "", "");
          } else {
            message.error({ content: "Tải ảnh thất bại", key: "paste_img" });
          }
          break;
        }
      }
    }
  };

  // Insert Generated Table
  const handleInsertTable = () => {
    let tableMd = "\n|";
    for (let c = 1; c <= tableCols; c++) {
      tableMd += ` Cột ${c} |`;
    }
    tableMd += "\n|";
    for (let c = 1; c <= tableCols; c++) {
      tableMd += " :--- |";
    }
    for (let r = 1; r <= tableRows; r++) {
      tableMd += "\n|";
      for (let c = 1; c <= tableCols; c++) {
        tableMd += ` Dữ liệu ${r}.${c} |`;
      }
    }
    tableMd += "\n\n";

    insertFormatting(tableMd, "", "");
    setIsTableModalOpen(false);
    message.success("Đã tạo bảng biểu trực quan!");
  };

  // Insert Generated Code Block
  const handleInsertCode = () => {
    const finalCode = codeSnippet.trim() || `// Viết mã nguồn ${codeLang} tại đây\nconsole.log("Hello FU-DEVER");`;
    const formatted = `\n\`\`\`${codeLang}\n${finalCode}\n\`\`\`\n\n`;
    insertFormatting(formatted, "", "");
    setIsCodeModalOpen(false);
    setCodeSnippet("");
    message.success("Đã chèn khối mã nguồn chuyên nghiệp!");
  };

  // Insert Generated Callout
  const handleInsertCallout = () => {
    const text = calloutText.trim() || "Nhập nội dung ghi chú quan trọng tại đây...";
    const formatted = `\n${selectedCallout.syntax}${text}\n\n`;
    insertFormatting(formatted, "", "");
    setIsCalloutModalOpen(false);
    setCalloutText("");
    message.success("Đã chèn khung ghi chú!");
  };

  // Submit Handler
  const handleSaveOrPublish = async (actionType: "draft" | "submit" | "publish") => {
    if (!title.trim()) {
      message.warning("Vui lòng nhập tiêu đề bài viết!");
      return;
    }
    if (!content.trim()) {
      message.warning("Vui lòng nhập nội dung bài viết!");
      return;
    }

    const token = webStorageClient.getToken();
    if (!token) {
      message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      router.push(`/${locale}/sign-in`);
      return;
    }

    let payloadStatus = "draft";
    if (actionType === "submit") payloadStatus = "pending_review";
    if (actionType === "publish" && userInfo.isAdmin) payloadStatus = "published";

    const body = {
      title,
      category,
      excerpt: excerpt || title.substring(0, 120),
      content,
      tags: selectedTags,
      coverImage:
        coverUrl ||
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'><defs><linearGradient id='dever-grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23004C99'/><stop offset='50%25' stop-color='%230066CC'/><stop offset='100%25' stop-color='%230098FF'/></linearGradient></defs><rect width='100%25' height='100%25' fill='url(%23dever-grad)'/><g fill='none' stroke='white' stroke-opacity='0.15' stroke-width='2'><path d='M0,150 Q300,50 600,150 T1200,150'/><path d='M0,350 Q300,250 600,350 T1200,350'/><path d='M0,500 Q300,400 600,500 T1200,500'/></g><circle cx='600' cy='260' r='64' fill='white' fill-opacity='0.1'/><text x='600' y='275' font-family='sans-serif' font-size='48' font-weight='900' fill='white' text-anchor='middle'>FU-DEVER</text><text x='600' y='360' font-family='sans-serif' font-size='28' font-weight='700' fill='%23E0F2FE' text-anchor='middle'>TECH BLOG &amp; KNOWLEDGE BASE</text></svg>",
      status: payloadStatus,
      submitForReview: actionType === "submit",
    };

    setLoading(true);
    try {
      const url = editingBlogId ? `${API_SERVER}/api/v1/blogs/${editingBlogId}` : `${API_SERVER}/api/v1/blogs`;
      const method = editingBlogId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (res.ok && json.status === "success") {
        if (actionType === "submit") {
          message.success("🎉 Bài viết đã được gửi tới Ban Chuyên Môn xét duyệt!");
        } else if (actionType === "publish") {
          message.success("🚀 Bài viết đã được xuất bản trực tiếp lên Landing Page!");
        } else {
          message.success("💾 Bản nháp bài viết đã được lưu an toàn!");
        }

        localStorage.removeItem("dever_blog_draft_v3");
        setEditingBlogId(null);
        setActiveTab("my-blogs");
        fetchMyBlogs();
      } else {
        message.error(json?.message || "Có lỗi xảy ra khi lưu bài viết.");
      }
    } catch (e) {
      message.error("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExisting = (blog: any) => {
    setEditingBlogId(blog._id);
    setTitle(blog.title || "");
    setCategory(blog.category || "Web & Frontend");
    setExcerpt(blog.excerpt || "");
    setCoverUrl(blog.coverImage || "");
    setContent(blog.content || "");
    setSelectedTags(blog.tags || []);
    setActiveTab("editor");
  };

  const handleDeletePost = async (blogId: string) => {
    const token = webStorageClient.getToken();
    try {
      const res = await fetch(`${API_SERVER}/api/v1/blogs/${blogId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        message.success("Đã xóa bài viết.");
        fetchMyBlogs();
      } else {
        message.error("Không thể xóa bài viết này.");
      }
    } catch (e) {
      message.error("Lỗi khi kết nối đến máy chủ.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", padding: "24px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top Header Banner in DEVER Deep Blue */}
      <div
        style={{
          background: "linear-gradient(135deg, #0066CC 0%, #0080FF 50%, #00B4D8 100%)",
          borderRadius: "24px",
          padding: "28px 36px",
          color: "#FFFFFF",
          boxShadow: "0 12px 30px -4px rgba(0, 102, 204, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              backdropFilter: "blur(8px)",
              fontSize: "12px",
              fontWeight: 700,
              width: "fit-content",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <Sparkles size={14} color="#FDE047" /> DEVER Studio Blog Writer
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: 0, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            {editingBlogId ? "Chỉnh Sửa Bài Viết Chuyên Môn" : "Soạn Thảo & Chia Sẻ Kiến Thức Kỹ Thuật"}
          </h1>
          <p style={{ fontSize: "14px", color: "#E0F2FE", margin: 0, fontWeight: 500 }}>
            Chia sẻ kinh nghiệm lập trình, kiến trúc hệ thống, thuật toán và dự án thực tế cùng các thành viên CLB FU-DEVER.
          </p>
        </div>

        {/* Tab Switcher Button */}
        <div>
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "editor" ? "my-blogs" : "editor")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#FFFFFF",
              color: "#0066CC",
              border: "none",
              borderRadius: "16px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease",
            }}
          >
            {activeTab === "editor" ? (
              <>
                <BookOpen size={16} color="#0066CC" /> Bài viết của tôi
              </>
            ) : (
              <>
                <Edit3 size={16} color="#0066CC" /> Quay lại Soạn thảo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Tabs Container */}
      {activeTab === "editor" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Top Control & Live Metrics Bar */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "16px 24px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 16px -2px rgba(0, 102, 204, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            {/* View Mode Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#F1F5F9", padding: "4px", borderRadius: "14px" }}>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: viewMode === "split" ? "#0066CC" : "transparent",
                  color: viewMode === "split" ? "#FFFFFF" : "#64748B",
                  boxShadow: viewMode === "split" ? "0 2px 8px rgba(0, 102, 204, 0.25)" : "none",
                }}
              >
                <Columns size={14} /> 2 Cột Live Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode("focus")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: viewMode === "focus" ? "#0066CC" : "transparent",
                  color: viewMode === "focus" ? "#FFFFFF" : "#64748B",
                  boxShadow: viewMode === "focus" ? "0 2px 8px rgba(0, 102, 204, 0.25)" : "none",
                }}
              >
                <Maximize2 size={14} /> Tập Trung Viết (Focus)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: viewMode === "preview" ? "#0066CC" : "transparent",
                  color: viewMode === "preview" ? "#FFFFFF" : "#64748B",
                  boxShadow: viewMode === "preview" ? "0 2px 8px rgba(0, 102, 204, 0.25)" : "none",
                }}
              >
                <Eye size={14} /> Toàn Màn Hình
              </button>
            </div>

            {/* Live Metrics & Auto-Save Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#64748B", fontWeight: 600 }}>
              {lastSaved && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#059669",
                    backgroundColor: "#ECFDF5",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    border: "1px solid #A7F3D0",
                    fontWeight: 700,
                    fontSize: "12px",
                  }}
                >
                  <CheckCircle2 size={14} /> Đã lưu nháp {lastSaved}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <FileText size={14} color="#0066CC" /> {wordCount} từ ({charCount} ký tự)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={14} color="#8B5CF6" /> {readTimeEstimate}
              </span>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Button
                onClick={() => handleSaveOrPublish("draft")}
                loading={loading}
                style={{
                  borderRadius: "14px",
                  fontWeight: 700,
                  height: "40px",
                  padding: "0 18px",
                  borderColor: "#CBD5E1",
                }}
              >
                <Save size={15} style={{ display: "inline", marginRight: "6px" }} /> Lưu Bản Nháp
              </Button>

              {userInfo?.isAdmin ? (
                <Button
                  type="primary"
                  onClick={() => handleSaveOrPublish("publish")}
                  loading={loading}
                  style={{
                    backgroundColor: "#0066CC",
                    borderRadius: "14px",
                    fontWeight: 700,
                    height: "40px",
                    padding: "0 22px",
                    boxShadow: "0 4px 14px rgba(0, 102, 204, 0.3)",
                  }}
                >
                  <Send size={15} style={{ display: "inline", marginRight: "6px" }} /> Xuất Bản Ngay
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => handleSaveOrPublish("submit")}
                  loading={loading}
                  style={{
                    backgroundColor: "#0066CC",
                    borderRadius: "14px",
                    fontWeight: 700,
                    height: "40px",
                    padding: "0 22px",
                    boxShadow: "0 4px 14px rgba(0, 102, 204, 0.3)",
                  }}
                >
                  <Send size={15} style={{ display: "inline", marginRight: "6px" }} /> Gửi Duyệt Bài Viết
                </Button>
              )}
            </div>
          </div>

          {/* Article Header & Metadata Card */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              padding: "28px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 20px -2px rgba(0, 102, 204, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Cover Image Dropzone */}
            <div style={{ position: "relative" }}>
              {coverUrl ? (
                <div style={{ position: "relative", width: "100%", height: "240px", borderRadius: "18px", overflow: "hidden", border: "1px solid #CBD5E1" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      display: "flex",
                      gap: "10px",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      padding: "8px 12px",
                      borderRadius: "14px",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => coverFileRef.current?.click()}
                      disabled={uploadingCover}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "10px",
                        backgroundColor: "#0066CC",
                        color: "#FFFFFF",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <RefreshCw size={13} /> {uploadingCover ? "Đang tải..." : "Đổi ảnh bìa"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverUrl("")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "#E11D48",
                        border: "none",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} /> Xóa ảnh
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => coverFileRef.current?.click()}
                  style={{
                    width: "100%",
                    height: "160px",
                    borderRadius: "18px",
                    border: "2px dashed #93C5FD",
                    backgroundColor: "#EFF6FF",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      backgroundColor: "#DBEAFE",
                      color: "#0066CC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ImageIcon size={24} />
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#1E293B", margin: 0 }}>
                    {uploadingCover ? "Đang tải ảnh lên..." : "Tải ảnh bìa bài viết"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                    Kéo thả hoặc bấm để chọn ảnh từ máy tính (JPEG, PNG, WebP)
                  </p>
                </div>
              )}
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleCoverUpload}
              />
            </div>

            {/* Title & Category Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Tiêu đề bài viết <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <Input
                  size="large"
                  placeholder="VD: Tối ưu hóa truy vấn MongoDB với Compound Index & Execution Plan..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: "14px", fontWeight: 700, fontSize: "16px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  Chủ đề chuyên môn <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <Select
                  size="large"
                  value={category}
                  onChange={setCategory}
                  style={{ width: "100%", borderRadius: "14px", fontWeight: 600 }}
                >
                  {CATEGORIES.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                Tóm tắt ngắn (Excerpt)
              </label>
              <TextArea
                rows={2}
                placeholder="Mô tả 2-3 câu ngắn gọn về giải pháp hoặc bài học trong bài viết..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                style={{ borderRadius: "14px", fontSize: "13px" }}
              />
            </div>

            {/* Technical Tags Selector */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Tags kỹ thuật liên quan:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {PRESET_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) setSelectedTags(selectedTags.filter((t) => t !== tag));
                        else setSelectedTags([...selectedTags, tag]);
                      }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: isSelected ? "1px solid #0066CC" : "1px solid #E2E8F0",
                        backgroundColor: isSelected ? "#0066CC" : "#F8FAFC",
                        color: isSelected ? "#FFFFFF" : "#475569",
                        transition: "all 0.15s ease",
                      }}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual Interactive Toolbar & Studios */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "12px 18px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 12px -2px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              {/* Text formatting tools */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#F1F5F9", padding: "4px 8px", borderRadius: "12px" }}>
                <Tooltip title="Tiêu đề H1 (Đề mục lớn nhất)">
                  <button
                    type="button"
                    onClick={() => insertFormatting("# ", "", "Tiêu đề chính")}
                    style={{ padding: "4px 10px", fontSize: "12px", fontWeight: 800, borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#334155" }}
                  >
                    H1
                  </button>
                </Tooltip>
                <Tooltip title="Tiêu đề H2 (Mục lớn)">
                  <button
                    type="button"
                    onClick={() => insertFormatting("## ", "", "Đề mục 2")}
                    style={{ padding: "4px 10px", fontSize: "12px", fontWeight: 800, borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#334155" }}
                  >
                    H2
                  </button>
                </Tooltip>
                <Tooltip title="Tiêu đề H3 (Tiểu mục)">
                  <button
                    type="button"
                    onClick={() => insertFormatting("### ", "", "Tiểu mục 3")}
                    style={{ padding: "4px 10px", fontSize: "12px", fontWeight: 800, borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#334155" }}
                  >
                    H3
                  </button>
                </Tooltip>
                <Divider type="vertical" style={{ margin: "0 4px" }} />
                <Tooltip title="In đậm (Bold)">
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**", "in đậm")}
                    style={{ padding: "4px 10px", fontSize: "12px", fontWeight: 900, borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#334155" }}
                  >
                    B
                  </button>
                </Tooltip>
                <Tooltip title="In nghiêng (Italic)">
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*", "in nghiêng")}
                    style={{ padding: "4px 10px", fontSize: "12px", fontStyle: "italic", fontFamily: "serif", borderRadius: "8px", border: "none", backgroundColor: "transparent", cursor: "pointer", color: "#334155" }}
                  >
                    I
                  </button>
                </Tooltip>
              </div>

              {/* 5 Visual Interactive Studio Buttons (SOLID ROUNDED BADGES WITH CRISP ICONS) */}
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                {/* 1. Visual Table Builder Button */}
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#EFF6FF",
                    color: "#0066CC",
                    border: "1px solid #BFDBFE",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "4px", borderRadius: "8px", backgroundColor: "#0066CC", color: "#FFFFFF", display: "flex" }}>
                    <TableIcon size={14} />
                  </div>
                  Tạo Bảng Biểu
                </button>

                {/* 2. Visual Code Studio Button */}
                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#EEF2FF",
                    color: "#4F46E5",
                    border: "1px solid #C7D2FE",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "4px", borderRadius: "8px", backgroundColor: "#4F46E5", color: "#FFFFFF", display: "flex" }}>
                    <Code2 size={14} />
                  </div>
                  Chèn Mã Nguồn
                </button>

                {/* 3. Visual Callout Alert Button */}
                <button
                  type="button"
                  onClick={() => setIsCalloutModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#ECFDF5",
                    color: "#059669",
                    border: "1px solid #A7F3D0",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "4px", borderRadius: "8px", backgroundColor: "#059669", color: "#FFFFFF", display: "flex" }}>
                    <Lightbulb size={14} />
                  </div>
                  Khung Ghi Chú
                </button>

                {/* 4. Visual Mermaid Architecture Button */}
                <button
                  type="button"
                  onClick={() => setIsMermaidModalOpen(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#ECFEFF",
                    color: "#0891B2",
                    border: "1px solid #A5F3FC",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "4px", borderRadius: "8px", backgroundColor: "#0891B2", color: "#FFFFFF", display: "flex" }}>
                    <Workflow size={14} />
                  </div>
                  Sơ Đồ Kiến Trúc
                </button>

                {/* 5. Direct Image Upload Button */}
                <button
                  type="button"
                  onClick={() => contentImgFileRef.current?.click()}
                  disabled={uploadingContentImg}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    borderRadius: "12px",
                    backgroundColor: "#FAF5FF",
                    color: "#7E22CE",
                    border: "1px solid #E9D5FF",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ padding: "4px", borderRadius: "8px", backgroundColor: "#7E22CE", color: "#FFFFFF", display: "flex" }}>
                    <UploadCloud size={14} />
                  </div>
                  {uploadingContentImg ? "Đang tải..." : "Tải ảnh lên"}
                </button>
                <input
                  ref={contentImgFileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleContentImageUpload}
                />
              </div>
            </div>
          </div>

          {/* Main Dual-Pane Studio Canvas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: viewMode === "split" ? "repeat(auto-fit, minmax(420px, 1fr))" : "1fr",
              gap: "20px",
            }}
          >
            {/* Left: Input Textarea Area */}
            {viewMode !== "preview" && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "20px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 20px -2px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "10px", fontSize: "12px", fontWeight: 700, color: "#64748B" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "#0066CC" }}>
                    <Edit3 size={15} /> Khung Soạn Thảo Markdown (Hỗ trợ dán ảnh Ctrl + V)
                  </span>
                  <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 500 }}>
                    Markdown & Blocks
                  </span>
                </div>
                <TextArea
                  ref={textAreaRef}
                  rows={24}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Bắt đầu viết nội dung bài viết kỹ thuật tại đây... Sử dụng thanh công cụ bên trên để chèn Bảng biểu, Khối Code, Sơ đồ Mermaid hoặc dán trực tiếp ảnh chụp màn hình (Ctrl+V)!"
                  style={{
                    border: "none",
                    boxShadow: "none",
                    fontFamily: "monospace",
                    fontSize: "13.5px",
                    lineHeight: "1.7",
                    minHeight: "480px",
                    resize: "vertical",
                    padding: 0,
                  }}
                />
              </div>
            )}

            {/* Right: Rich Live Preview Area */}
            {viewMode !== "focus" && (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "24px",
                  padding: "28px",
                  border: "1px solid #BFDBFE",
                  boxShadow: "0 4px 24px -2px rgba(0, 102, 204, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  minHeight: "520px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 800, color: "#0066CC", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <Eye size={16} /> Xem Trước Trực Tiếp (Live Landing Page Render)
                  </span>
                  <Tag color="blue" style={{ borderRadius: "8px", fontWeight: 700, fontSize: "11px", padding: "2px 10px" }}>
                    {category}
                  </Tag>
                </div>

                {/* Rendered Preview Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {title && (
                    <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0F172A", margin: 0, lineHeight: "1.3" }}>
                      {title}
                    </h1>
                  )}

                  {coverUrl && (
                    <div style={{ borderRadius: "18px", overflow: "hidden", border: "1px solid #E2E8F0", maxHeight: "280px" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverUrl} alt="Cover Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}

                  <RichMarkdownRenderer content={content} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: My Articles Management */
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={20} color="#0066CC" /> Danh Sách Bài Viết Của Tôi
              </h2>
              <p style={{ fontSize: "13px", color: "#64748B", margin: "4px 0 0 0" }}>
                Theo dõi trạng thái xét duyệt và xem góp ý chuyên môn từ Ban Quản Trị CLB.
              </p>
            </div>
            <Button
              type="primary"
              onClick={() => {
                setEditingBlogId(null);
                setTitle("");
                setExcerpt("");
                setCoverUrl("");
                setContent("");
                setActiveTab("editor");
              }}
              style={{
                backgroundColor: "#0066CC",
                borderRadius: "14px",
                fontWeight: 700,
                height: "40px",
                padding: "0 18px",
              }}
            >
              <Plus size={15} style={{ display: "inline", marginRight: "6px" }} /> Viết Bài Mới
            </Button>
          </div>

          {loadingMyBlogs ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748B" }}>
              <RefreshCw size={24} color="#0066CC" className="animate-spin" style={{ margin: "0 auto 10px auto" }} />
              <p style={{ fontSize: "13px", fontWeight: 600 }}>Đang tải danh sách bài viết...</p>
            </div>
          ) : myBlogs.length === 0 ? (
            <div style={{ padding: "80px 20px", textAlign: "center" }}>
              <BookOpen size={48} color="#BFDBFE" style={{ margin: "0 auto 12px auto" }} />
              <p style={{ fontSize: "15px", fontWeight: 700, color: "#1E293B", margin: "0 0 6px 0" }}>
                Bạn chưa có bài viết nào
              </p>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
                Hãy bắt đầu chia sẻ bài viết kỹ thuật đầu tiên để đóng góp cho cộng đồng FU-DEVER!
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myBlogs.map((b) => (
                <div
                  key={b._id}
                  style={{
                    padding: "18px 22px",
                    borderRadius: "16px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    boxShadow: "0 2px 8px -2px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Tag color={b.status === "published" ? "success" : b.status === "pending_review" ? "processing" : b.status === "changes_requested" ? "warning" : "default"} style={{ borderRadius: "9999px", fontWeight: 700, padding: "2px 10px" }}>
                        {b.status === "published" ? "🟢 Đã Xuất Bản" : b.status === "pending_review" ? "🟡 Đang Chờ Duyệt" : b.status === "changes_requested" ? "🟠 Cần Chỉnh Sửa" : "⚪ Bản Nháp"}
                      </Tag>
                      <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
                        {b.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {b.title}
                    </h3>
                    {b.reviewNotes && (
                      <div style={{ padding: "8px 14px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", fontSize: "12px", color: "#92400E" }}>
                        <strong>Nhận xét từ Ban Chuyên Môn:</strong> {b.reviewNotes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <Button
                      onClick={() => handleEditExisting(b)}
                      style={{ borderRadius: "12px", fontWeight: 700 }}
                    >
                      <Edit3 size={14} style={{ display: "inline", marginRight: "4px" }} /> Chỉnh sửa
                    </Button>
                    <Popconfirm
                      title="Xóa bài viết này?"
                      onConfirm={() => handleDeletePost(b._id)}
                      okText="Xác nhận xóa"
                      cancelText="Hủy"
                    >
                      <Button danger style={{ borderRadius: "12px", fontWeight: 700 }}>
                        <Trash2 size={14} />
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 1. VISUAL MODAL: Table Builder */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0066CC", fontWeight: 800 }}>
            <TableIcon size={18} /> Trình Tạo Bảng Biểu Trực Quan (Visual Table Builder)
          </div>
        }
        open={isTableModalOpen}
        onOk={handleInsertTable}
        onCancel={() => setIsTableModalOpen(false)}
        okText="Chèn Bảng Vào Bài Viết"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: "#0066CC", borderRadius: "12px", fontWeight: 700 } }}
        cancelButtonProps={{ style: { borderRadius: "12px" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            Tự động tạo bảng Markdown chuẩn định dạng mà không cần gõ thủ công ký tự `|---|---|`.
          </p>

          <Row gutter={16}>
            <Col span={12}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Số Cột (Columns): {tableCols}
              </label>
              <Select value={tableCols} onChange={setTableCols} style={{ width: "100%", borderRadius: "12px" }}>
                {[2, 3, 4, 5, 6].map((c) => (
                  <Option key={c} value={c}>{c} Cột</Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                Số Hàng (Rows): {tableRows}
              </label>
              <Select value={tableRows} onChange={setTableRows} style={{ width: "100%", borderRadius: "12px" }}>
                {[2, 3, 4, 5, 6, 8, 10].map((r) => (
                  <Option key={r} value={r}>{r} Hàng</Option>
                ))}
              </Select>
            </Col>
          </Row>

          {/* Grid Preview */}
          <div style={{ padding: "14px", backgroundColor: "#F8FAFC", borderRadius: "16px", border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", margin: "0 0 10px 0" }}>
              Xem trước cấu trúc bảng:
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${tableCols}, minmax(0, 1fr))`,
                gap: "6px",
              }}
            >
              {Array.from({ length: tableCols }).map((_, c) => (
                <div key={`h-${c}`} style={{ padding: "8px", backgroundColor: "#0066CC", color: "#FFFFFF", fontSize: "11px", fontWeight: 800, textAlign: "center", borderRadius: "8px" }}>
                  Cột {c + 1}
                </div>
              ))}
              {Array.from({ length: tableCols * 2 }).map((_, r) => (
                <div key={`d-${r}`} style={{ padding: "8px", backgroundColor: "#FFFFFF", color: "#64748B", fontSize: "11px", textAlign: "center", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  Ô dữ liệu
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. VISUAL MODAL: Code Block Studio */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4F46E5", fontWeight: 800 }}>
            <Code2 size={18} /> Visual Code Block Studio
          </div>
        }
        open={isCodeModalOpen}
        onOk={handleInsertCode}
        onCancel={() => setIsCodeModalOpen(false)}
        okText="Chèn Khối Code Vào Bài Viết"
        cancelText="Hủy"
        width={680}
        okButtonProps={{ style: { backgroundColor: "#4F46E5", borderRadius: "12px", fontWeight: 700 } }}
        cancelButtonProps={{ style: { borderRadius: "12px" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", marginBottom: "8px" }}>
              Chọn ngôn ngữ lập trình:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {CODE_LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setCodeLang(lang.value)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: codeLang === lang.value ? "1px solid #4F46E5" : "1px solid #E2E8F0",
                    backgroundColor: codeLang === lang.value ? "#4F46E5" : "#F8FAFC",
                    color: codeLang === lang.value ? "#FFFFFF" : "#334155",
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
              Dán hoặc nhập mã nguồn:
            </label>
            <TextArea
              rows={8}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder={`// Dán mã nguồn ${codeLang} tại đây...`}
              style={{ fontFamily: "monospace", fontSize: "13px", backgroundColor: "#0D1117", color: "#F8FAFC", borderRadius: "14px", padding: "14px" }}
            />
          </div>
        </div>
      </Modal>

      {/* 3. VISUAL MODAL: Callout Alert Studio */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#059669", fontWeight: 800 }}>
            <Lightbulb size={18} /> Trình Tạo Khung Ghi Chú & Mẹo Hay
          </div>
        }
        open={isCalloutModalOpen}
        onOk={handleInsertCallout}
        onCancel={() => setIsCalloutModalOpen(false)}
        okText="Chèn Ghi Chú"
        cancelText="Hủy"
        okButtonProps={{ style: { backgroundColor: "#059669", borderRadius: "12px", fontWeight: 700 } }}
        cancelButtonProps={{ style: { borderRadius: "12px" } }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "12px 0" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", marginBottom: "8px" }}>
              Chọn mẫu thông báo:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
              {CALLOUT_PRESETS.map((item) => {
                const IconComp = item.icon;
                const isSelected = selectedCallout.type === item.type;
                return (
                  <div
                    key={item.type}
                    onClick={() => setSelectedCallout(item)}
                    style={{
                      padding: "14px",
                      borderRadius: "14px",
                      border: isSelected ? `2px solid ${item.badgeColor}` : "1px solid #E2E8F0",
                      backgroundColor: isSelected ? item.badgeBg : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 800, fontSize: "13px", color: item.badgeColor, marginBottom: "4px" }}>
                      <IconComp size={16} color={item.badgeColor} />
                      {item.title}
                    </div>
                    <p style={{ fontSize: "11.5px", color: "#64748B", margin: 0, lineHeight: "1.4" }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
              Nội dung thông báo:
            </label>
            <TextArea
              rows={3}
              value={calloutText}
              onChange={(e) => setCalloutText(e.target.value)}
              placeholder="Nhập nội dung mẹo hay hoặc cảnh báo..."
              style={{ borderRadius: "14px", fontSize: "13px" }}
            />
          </div>
        </div>
      </Modal>

      {/* 4. VISUAL MODAL: Mermaid Architecture Studio */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0891B2", fontWeight: 800 }}>
            <Workflow size={18} /> Sơ Đồ Kiến Trúc Hệ Thống (Mermaid Diagram)
          </div>
        }
        open={isMermaidModalOpen}
        onCancel={() => setIsMermaidModalOpen(false)}
        footer={null}
        width={680}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "12px 0" }}>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            Chọn sơ đồ mẫu để hệ thống tự động render trực quan trong bài viết:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {MERMAID_PRESETS.map((preset) => (
              <div
                key={preset.id}
                style={{
                  padding: "16px 20px",
                  borderRadius: "16px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Workflow size={16} color="#0891B2" /> {preset.title}
                  </h4>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>{preset.desc}</p>
                </div>
                <Button
                  type="primary"
                  onClick={() => {
                    insertFormatting(preset.code, "", "");
                    setIsMermaidModalOpen(false);
                    message.success("Đã chèn sơ đồ kiến trúc!");
                  }}
                  style={{
                    backgroundColor: "#0891B2",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "12px",
                    flexShrink: 0,
                  }}
                >
                  Chèn Sơ Đồ Này
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
