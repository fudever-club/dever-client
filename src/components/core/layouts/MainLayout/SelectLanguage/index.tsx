import type { MenuProps } from "antd";
import { Avatar, Flex, Typography } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next-nprogress-bar";
import { useParams, usePathname } from "next/navigation";

import { getPathname } from "@/utils/getPathname";
import { useTranslation } from "@/app/i18n/client";

import EnglandFlag from "@public/images/languages/englandFlag.png";
import VietnamFlag from "@public/images/languages/vietnamFlag.png";

import * as S from "./styles";

type MenuItem = Required<MenuProps>["items"][number];

function SelectLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const localActive = params?.locale as string;
  const [_, startTransition] = useTransition();

  const { t } = useTranslation(params?.locale as string, "layout");

  const handleClick: MenuProps["onClick"] = (e) => {
    startTransition(() => {
      router.replace(`/${e.key}/${getPathname(pathname)}${window.location.search}${window.location.hash}`);
    });
  };

  const items: MenuItem[] = [
    {
      key: "en",
      icon: (
        <Avatar
          src={
            <Image
              src={EnglandFlag}
              alt="Cờ tiếng Anh"
              width={48}
              height={48}
              sizes="48px"
            />
          }
          size="small"
        />
      ),
      label: t("english"),
    },
    {
      key: "vi",
      icon: (
        <Avatar
          src={
            <Image
              src={VietnamFlag}
              alt="Cờ tiếng Việt"
              width={48}
              height={48}
              sizes="48px"
            />
          }
          size="small"
        />
      ),
      label: t("vietnamese"),
    },
  ];

  return (
    <S.PopoverCustom
      trigger="click"
      placement="bottomRight"
      content={
        <S.MenuLanguage
          defaultSelectedKeys={[localActive]}
          mode="inline"
          items={items}
          onClick={handleClick}
        />
      }
    >
      <Flex gap={8} align="center">
        <Avatar
          src={
            <Image
              src={localActive === "en" ? EnglandFlag : VietnamFlag}
              alt={localActive === "en" ? "Cờ tiếng Anh (ngôn ngữ hiện tại)" : "Cờ tiếng Việt (ngôn ngữ hiện tại)"}
              width={48}
              height={48}
              sizes="48px"
            />
          }
          size="small"
        />
        <Flex align="center" gap={4}>
          <Typography.Text>
            {localActive === "en" ? "EN" : "VN"}
          </Typography.Text>
          <CaretDownOutlined />
        </Flex>
      </Flex>
    </S.PopoverCustom>
  );
}

export default SelectLanguage;
