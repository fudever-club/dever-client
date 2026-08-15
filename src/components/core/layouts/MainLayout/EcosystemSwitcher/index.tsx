import { GlobalOutlined, SafetyCertificateOutlined } from "@ant-design/icons";

interface EcosystemSwitcherProps {
  isAdmin: boolean;
}

function EcosystemSwitcher({ isAdmin }: EcosystemSwitcherProps) {
  const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3000";
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3003";

  return (
    <div className="w-64 space-y-1 p-1">
      <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Hệ sinh thái DEVER</p>
      <a
        href={landingUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-start gap-3 rounded-xl p-3 text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#0066CC]"
      >
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#0066CC]"><GlobalOutlined aria-hidden="true" /></span>
        <span><span className="block text-sm font-semibold">Trang chủ DEVER</span><span className="block pt-0.5 text-xs text-slate-500">Sự kiện, hoạt động và nội dung công khai</span></span>
      </a>
      {isAdmin && (
        <a
          href={adminUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-start gap-3 rounded-xl p-3 text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#0066CC]"
        >
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0066CC]"><SafetyCertificateOutlined aria-hidden="true" /></span>
          <span><span className="block text-sm font-semibold">Cổng quản trị</span><span className="block pt-0.5 text-xs text-slate-500">Quản lý nội dung và thành viên câu lạc bộ</span></span>
        </a>
      )}
    </div>
  );
}

export default EcosystemSwitcher;
