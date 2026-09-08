"use client";

import React, { useState } from "react";
import { Skeleton } from "antd";
import { Code2, ExternalLink, Plus, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { GithubOutlined } from "@ant-design/icons";
import styled from "styled-components";
import SubmitProjectModal from "@/components/ui/SubmitProjectModal";
import { useGetMySubmittedProjectsQuery, useGetOpenSourceProjectsQuery } from "@/store/queries/ecosystem";
import { useAppSelector } from "@/hooks/redux-toolkit";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";

const ContainerWrapper = styled.div`
  padding-top: 16px;
`;

const ProjectCardWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: rgba(0, 102, 204, 0.4);
    box-shadow: 0 6px 20px rgba(0, 102, 204, 0.08);
  }
`;

const formatExternalUrl = (url?: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

interface IProps {
  userData: any;
  isUserDataFetching: boolean;
}

export default function ProfileProjects({ userData, isUserDataFetching }: IProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { userInfo } = useAppSelector((state) => state.auth);
  const storedUser = typeof window !== "undefined" ? webStorageClient.get(constants.USER_INFO) : null;
  const currentUserId = userInfo?.id || storedUser?._id || storedUser?.id || "";
  const targetUserId = userData?._id || userData?.id || "";

  const isOwnProfile = Boolean(
    currentUserId &&
    (targetUserId === currentUserId || userData?.profileKey)
  );

  const { data: myProjectsData, isLoading: isMyProjectsLoading } = useGetMySubmittedProjectsQuery(
    undefined,
    { skip: !isOwnProfile }
  );

  const { data: publicProjectsData, isLoading: isPublicProjectsLoading } = useGetOpenSourceProjectsQuery(
    targetUserId ? { authorId: targetUserId } : undefined,
    { skip: isOwnProfile || !targetUserId }
  );

  const projects = isOwnProfile
    ? (myProjectsData?.data || [])
    : (publicProjectsData?.data || (Array.isArray(userData?.projects) ? userData.projects : []));

  const isLoading = isUserDataFetching || (isOwnProfile ? isMyProjectsLoading : isPublicProjectsLoading);

  return (
    <ContainerWrapper>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066CC] flex items-center justify-center font-bold">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 m-0">
                Dự Án Cá Nhân &amp; Open Source
              </h3>
            </div>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              Các công cụ, mã nguồn mở và sản phẩm công nghệ do thành viên xây dựng.
            </p>
          </div>

          {isOwnProfile && (
            <button
              type="button"
              aria-label="Thêm dự án mới"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0066CC] hover:bg-[#004C99] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm dự án mới
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3 py-2">
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#0066CC] flex items-center justify-center mx-auto shadow-xs">
              <Code2 className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800 m-0">
                {isOwnProfile ? "Chưa có dự án nào được đóng góp" : "Thành viên chưa xuất bản dự án công khai nào"}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto m-0">
                {isOwnProfile
                  ? "Chia sẻ dự án mã nguồn mở hoặc sản phẩm cá nhân để nhận ngay +150 EXP và huy hiệu Core Contributor trên Bảng Vàng CLB."
                  : "Các dự án sau khi được Ban Quản Trị phê duyệt sẽ hiển thị tại đây."}
              </p>
            </div>
            {isOwnProfile && (
              <button
                type="button"
                aria-label="Đóng góp dự án đầu tiên"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 text-[#0066CC] hover:bg-blue-100 text-xs font-bold active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Đóng Góp Dự Án Đầu Tiên (+150 EXP)
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {projects.map((proj: any) => (
              <ProjectCardWrapper key={proj._id || proj.title} className="flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066CC] text-[11px] font-bold border border-blue-100">
                      {proj.category || "Open Source"}
                    </span>
                    {proj.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" /> Chờ BQT duyệt (+150 EXP)
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 m-0 line-clamp-1">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 m-0">
                    {proj.description}
                  </p>

                  {Array.isArray(proj.tags) && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.tags.slice(0, 4).map((tag: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10.5px] font-medium font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4">
                  {proj.githubUrl && (
                    <a
                      href={formatExternalUrl(proj.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                    >
                      <GithubOutlined className="text-xs" /> GitHub
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={formatExternalUrl(proj.demoUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066CC] text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Demo Live
                    </a>
                  )}
                </div>
              </ProjectCardWrapper>
            ))}
          </div>
        )}
      </div>

      <SubmitProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </ContainerWrapper>
  );
}
