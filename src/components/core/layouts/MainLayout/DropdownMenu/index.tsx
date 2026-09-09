import React, { useState, useEffect } from "react";
import { Avatar, Flex } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "next-nprogress-bar";

import Divider from "@/components/core/common/Divider";

import { useTranslation } from "@/app/i18n/client";
import { userDropdownMenu } from "@/helpers/data/userDropdownMenu";
import webStorageClient from "@/utils/webStorageClient";

import * as S from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Typography from "@/components/core/common/Typography";
import themeColors from "@/style/themes/default/colors";

function DropdownMenu() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [userInfo?.avatar]);

  const safeMenuAvatar = !avatarError && userInfo?.avatar
    ? userInfo.avatar
    : "/images/avatar/avatar.jpg";

  const { t } = useTranslation(params?.locale as string, "layout");

  const sideBarMenuFormat = userDropdownMenu?.map((item: any) => ({
    ...item,
    label: t(item.label),
    link: `/${item.key}`,
  }));

  const handleClickItem = (key: string) => {
    switch (key) {
      case "profile":
        router.push(`/${locale}/profile/${userInfo.id}`);
        break;
      case "settings":
        router.push(`/${locale}/settings`);
        break;
      case "logout":
        webStorageClient.removeAll();
        router.push(`/${locale}/sign-in`);
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ minWidth: 230, maxWidth: 280 }}>
      <Flex gap={10} align="center" style={{ padding: "4px 4px 6px 4px" }}>
        <Avatar
          size={36}
          src={
            <Image
              src={safeMenuAvatar}
              alt="avatar"
              width={36}
              height={36}
              unoptimized={safeMenuAvatar.endsWith('.svg') || safeMenuAvatar.startsWith('data:')}
              onError={() => setAvatarError(true)}
              style={{ objectFit: "cover", width: 36, height: 36, borderRadius: "50%" }}
            />
          }
        />
        <Flex vertical style={{ minWidth: 0, flex: 1 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: "14px",
              color: "#0f172a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {[userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") || "Thành viên DEVER"}
          </span>
          <span
            style={{
              fontSize: "12px",
              color: themeColors.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
            title={userInfo?.email || undefined}
          >
            @{userInfo?.email}
          </span>
        </Flex>
      </Flex>
      <Divider $margin={6} />
      <S.MenuCustom
        items={sideBarMenuFormat}
        onClick={(e) => handleClickItem(e?.key)}
      />
    </div>
  );
}

export default DropdownMenu;
