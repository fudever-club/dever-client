import "./must.styles.css";
import * as S from "./styles";

import React, { useState } from "react";
import { Flex, Skeleton, message } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Copy, Check } from "lucide-react";

import Typography from "@/components/core/common/Typography";
import { UserInfo } from "@/helpers/types/userTypes";
import { useTranslation } from "@/app/i18n/client";
import { SocialBrandIcon } from "@/helpers/socialMediaIcons";

import BriefCaseIcon from "@public/icons/layout/profiles/briefcase.svg";
import CalendarIcon from "@public/icons/layout/profiles/calendar-month.svg";
import Cake from "@public/icons/layout/profiles/cake.svg";
import Gen from "@public/icons/layout/profiles/gen.svg";

interface IProps {
  userData: UserInfo;
  isUserDataFetching: boolean;
}

function BaseInformation({ userData, isUserDataFetching }: IProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "profile");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const fallbackCopyText = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedEmail(true);
      message.success("Đã sao chép email!");
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Ignore fallback errors
    }
  };

  const handleCopyEmail = (email?: string) => {
    if (!email) return;
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          setCopiedEmail(true);
          message.success("Đã sao chép email!");
          setTimeout(() => setCopiedEmail(false), 2000);
        })
        .catch(() => {
          fallbackCopyText(email);
        });
    } else {
      fallbackCopyText(email);
    }
  };

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        <S.MainContentWrapper>
          <S.AvatarWrapper>
            {isUserDataFetching ? (
              <Skeleton.Image
                active={isUserDataFetching}
                style={{ width: 100, height: 100, borderRadius: 16 }}
              />
            ) : (
              <S.PreviewGroupCustom>
                <S.AvatarCustom
                  alt="avatar"
                  src={userData?.avatar || "/images/avatar/avatar.jpg"}
                  fallback="/images/avatar/avatar.jpg"
                />
              </S.PreviewGroupCustom>
            )}
            <S.RSideContent>
              {isUserDataFetching ? (
                <Skeleton.Input
                  active={isUserDataFetching}
                  size="default"
                  style={{ width: "100%" }}
                />
              ) : (
                <Typography.Title
                  level={4}
                  $fontWeight={700}
                  style={{
                    margin: 0,
                    wordBreak: "break-word",
                    fontSize: "1.15rem",
                    lineHeight: 1.3,
                  }}
                >
                  {userData?.firstname && userData?.lastname
                    ? `${userData?.firstname} ${userData?.lastname}`
                    : userData?.email}
                </Typography.Title>
              )}

              {isUserDataFetching ? (
                <Skeleton.Input
                  active={isUserDataFetching}
                  size="small"
                  style={{ width: "80%" }}
                />
              ) : (
                <Flex align="center" gap={8} style={{ minHeight: 24 }}>
                  <Image
                    src={BriefCaseIcon}
                    alt="icon"
                    width={18}
                    height={18}
                  />
                  <Typography.Text
                    $fontSize="14px"
                    style={{ wordBreak: "break-word" }}
                  >
                    {userData?.job ? userData?.job : t("notSetYet")}
                  </Typography.Text>
                </Flex>
              )}
              {isUserDataFetching ? (
                <Skeleton.Input
                  active={isUserDataFetching}
                  size="small"
                  style={{ width: "60%" }}
                />
              ) : (
                <Flex align="center" gap={8} style={{ minHeight: 24 }}>
                  <Image src={Cake} alt="icon" width={18} height={18} />
                  <Typography.Text
                    $fontSize="14px"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {userData?.dob
                      ? moment(userData?.dob).format("DD/MM/YYYY")
                      : t("notSetYet")}
                  </Typography.Text>
                </Flex>
              )}
              {isUserDataFetching ? (
                <Skeleton.Input
                  active={isUserDataFetching}
                  size="small"
                  style={{ width: "60%" }}
                />
              ) : (
                <Flex align="center" gap={8} style={{ minHeight: 24 }}>
                  <Image src={Gen} alt="icon" width={18} height={18} />
                  <Typography.Text
                    $fontSize="14px"
                    $fontWeight={600}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {userData?.MSSV ? userData?.MSSV : t("notSetYet")}
                  </Typography.Text>
                </Flex>
              )}
            </S.RSideContent>
          </S.AvatarWrapper>

          {isUserDataFetching ? (
            <Skeleton.Input
              active={isUserDataFetching}
              size="default"
              style={{ width: "100%" }}
            />
          ) : (
            <Flex vertical gap={4}>
              <Typography.Text $fontSize="13px" $color="#64748b" $fontWeight={600}>
                {t("email")}
              </Typography.Text>
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span
                  className="font-medium text-sm text-slate-800 select-all min-w-0"
                  style={{ wordBreak: "break-all", overflowWrap: "anywhere" }}
                >
                  {userData?.email ?? t("notSetYet")}
                </span>
                {userData?.email && (
                  <button
                    type="button"
                    onClick={() => handleCopyEmail(userData?.email)}
                    title="Sao chép email"
                    aria-label="Sao chép email"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#0066CC] hover:bg-white border border-transparent hover:border-slate-200 transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </Flex>
          )}

          {isUserDataFetching ? (
            <Skeleton.Input
              active={isUserDataFetching}
              size="default"
              style={{ width: "100%" }}
            />
          ) : (
            <Flex vertical gap={4}>
              <Typography.Text $fontSize="13px" $color="#64748b" $fontWeight={600}>
                {t("hometown")}
              </Typography.Text>
              <Typography.Text
                $fontSize="14px"
                $fontWeight={600}
                style={{ wordBreak: "break-word" }}
              >
                {userData?.hometown ?? t("notSetYet")}
              </Typography.Text>
            </Flex>
          )}

          {isUserDataFetching ? (
            <Skeleton.Input
              active={isUserDataFetching}
              size="default"
              style={{ width: "100%" }}
            />
          ) : (
            <Flex vertical gap={8}>
              <Typography.Text $fontSize="13px" $color="#64748b" $fontWeight={600}>
                {t("socials")}
              </Typography.Text>
              {userData?.socials! && userData?.socials.length > 0 ? (
                <Flex gap={8} align="center" wrap="wrap">
                  {userData?.socials!.map((item, index) => (
                    <Link
                      href={item.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={index}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 44,
                        minHeight: 44,
                        transition: "transform 0.2s ease",
                      }}
                      className="hover:scale-110 active:scale-95"
                    >
                      <SocialBrandIcon
                        platform={item.socialId?.constant || item.socialId?.name}
                        size={28}
                      />
                    </Link>
                  ))}
                </Flex>
              ) : (
                <Typography.Text $fontSize="14px" italic>
                  {t("notSetYet")}
                </Typography.Text>
              )}
            </Flex>
          )}
        </S.MainContentWrapper>
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default BaseInformation;
