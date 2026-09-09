"use client";

import { Button, Flex, Grid, Layout, Popover, message } from "antd";
import { useLocale } from "next-intl";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import LoadingScreen from "../../common/LoadingScreen";
import Typography from "../../common/Typography";
import DropdownMenu from "./DropdownMenu";
import EcosystemSwitcher from "./EcosystemSwitcher";
import SelectLanguage from "./SelectLanguage";
import NotificationBell from "@/components/ui/NotificationBell";
import DeverRouteLoader from "@/components/ui/DeverRouteLoader";
import ErrorBoundary from "../../common/ErrorBoundary";

import { useTranslation } from "@/app/i18n/client";
import { sidebarMenu } from "@/helpers/data/sidebarMenu";
import { useVerifyTokenMutation } from "@/store/queries/auth";
import { themes } from "@/style/themes";
import webStorageClient from "@/utils/webStorageClient";

import { constants } from "@/settings";
import { assignUserInfo } from "@/store/slices/auth";
import themeColors from "@/style/themes/default/colors";
import { AppstoreOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import * as S from "./styles";
import { UserInfo } from "@/helpers/types/userTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-toolkit";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const params = useParams();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const dispatch = useAppDispatch();
  const [verifyToken] = useVerifyTokenMutation();

  const wrapperRef: any = useRef(null);

  const { t } = useTranslation(params?.locale as string, "layout");

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [collapsedMobile, setCollapsedMobile] = useState<boolean>(true);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [isShowSwitcher, setIsShowSwitcher] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loadingVisible, setLoadingVisible] = useState<boolean>(true);
  const [loadingFadeOut, setLoadingFadeOut] = useState<boolean>(false);

  const { userInfo } = useAppSelector((state) => state.auth);

  const avatar = webStorageClient.get(constants.AVT);
  const [headerAvatarError, setHeaderAvatarError] = useState<boolean>(false);

  useEffect(() => {
    setHeaderAvatarError(false);
  }, [userInfo?.avatar]);

  const safeHeaderAvatar = !headerAvatarError && (userInfo?.avatar || avatar)
    ? (userInfo?.avatar || avatar)
    : "/images/avatar/avatar.jpg";

  const handleVerifyToken = useCallback(async () => {
    const startTime = Date.now();
    try {
      if (!webStorageClient.get("_access_token")) {
        message.error(t("token_not_valid"));
        throw new Error(t("token_not_valid"));
      }
      const res: { data: UserInfo } = await verifyToken(
        webStorageClient.get("_access_token") || "??"
      ).unwrap();

      // Guarantee minimum 450ms display time so the user sees the crisp branded LoadingScreen
      const elapsed = Date.now() - startTime;
      const minDisplayMs = 450;
      if (elapsed < minDisplayMs) {
        await new Promise((resolve) => setTimeout(resolve, minDisplayMs - elapsed));
      }

      setIsAuth(true);
      setLoadingFadeOut(true);
      setTimeout(() => {
        setLoadingVisible(false);
      }, 350);

      dispatch(
        assignUserInfo({
          id: res?.data?._id,
          email: res?.data?.email,
          firstname: res?.data?.firstname,
          lastname: res?.data?.lastname,
          avatar: res?.data?.avatar,
          nickname: res?.data?.nickname,
          isAdmin: Boolean(res?.data?.isAdmin),
          isLeader: Boolean(res?.data?.isLeader),
        })
      );
    } catch (error) {
      const elapsed = Date.now() - startTime;
      if (elapsed < 300) {
        await new Promise((resolve) => setTimeout(resolve, 300 - elapsed));
      }
      setIsAuth(false);
      setLoadingFadeOut(true);
      setTimeout(() => {
        setLoadingVisible(false);
      }, 300);
      webStorageClient.removeAll();
      router.push(`/${localActive}/sign-in`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, localActive, router, verifyToken]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current?.contains(event.target)) {
        setCollapsedMobile(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    handleVerifyToken();
  }, [handleVerifyToken]);

  const sideBarMenuFormat = sidebarMenu?.map((item: any) => ({
    ...item,
    label: t(item.label),
    link: `/${item.key}`,
  }));

  return (
    <>
      {loadingVisible && <LoadingScreen fadeOut={loadingFadeOut} />}
      {isAuth && (
        <S.ContainerLayoutCustom>
          <AppProgressBar
            height="4px"
            color={themeColors.primary}
            options={{ showSpinner: false }}
            shallowRouting
          />
          <S.MobileSider $collapsed={collapsedMobile}>
            <S.SiderContainer ref={wrapperRef}>
              <S.LogoWrapper>
                <div className="demo-logo-vertical">
                  <Flex align="center" justify="space-between">
                    <Flex
                      align="center"
                      gap={12}
                      onClick={() => router?.push(`/${localActive}/members`)}
                    >
                      <Image
                        alt=""
                        src={"/icons/layout/fu-dever-logo.png"}
                        width={40}
                        height={40}
                        style={{ cursor: "pointer" }}
                      />

                      <Typography.Title
                        level={4}
                        $color={themes?.default?.colors?.primary}
                        $fontWeight={800}
                      >
                        FU - DEVER
                      </Typography.Title>
                    </Flex>
                  </Flex>
                </div>
              </S.LogoWrapper>
              <S.MenuCustom
                mode="inline"
                selectedKeys={[pathname?.split("/")[2] || "dashboard"]}
                onClick={(e) => router?.push(`/${localActive}/${e?.key}`)}
                items={sideBarMenuFormat}
              />
            </S.SiderContainer>
          </S.MobileSider>
          <S.HeaderCustom>
            <S.HeaderContainerWrapper>
              <S.LogoWrapper>
                <div className="demo-logo-vertical">
                  <Flex align="center" justify="space-between">
                    <Flex
                      align="center"
                      gap={12}
                      onClick={() => router?.push(`/${localActive}/members`)}
                    >
                      <Image
                        alt=""
                        src={"/icons/layout/fu-dever-logo.png"}
                        width={40}
                        height={40}
                        style={{ cursor: "pointer" }}
                      />
                      {!collapsed && (
                        <Typography.Title
                          level={4}
                          $color={themes?.default?.colors?.primary}
                          $fontWeight={800}
                        >
                          {screens.xs ? "" : "FU - DEVER"}
                        </Typography.Title>
                      )}
                    </Flex>
                  </Flex>
                </div>
              </S.LogoWrapper>
            </S.HeaderContainerWrapper>
            <Flex align="center" gap={8}>
              <NotificationBell />
              <SelectLanguage />
              <Popover
                content={<EcosystemSwitcher isAdmin={Boolean(userInfo.isAdmin)} />}
                title="Chuyển không gian"
                trigger="click"
                open={isShowSwitcher}
                onOpenChange={setIsShowSwitcher}
                placement="bottomRight"
              >
                <Button type="text" shape="circle" size="large" aria-label="Mở hệ sinh thái DEVER" icon={<AppstoreOutlined />} />
              </Popover>
              <Popover
                content={<DropdownMenu />}
                trigger="click"
                open={isShowMenu}
                onOpenChange={() => setIsShowMenu(!isShowMenu)}
                placement="bottomRight"
              >
                <Flex>
                  <S.AvatarCustom
                    size={40}
                    data-testid="header-user-avatar"
                    aria-label="Menu cá nhân"
                    src={
                      <Image
                        src={safeHeaderAvatar}
                        alt="avatar"
                        width={40}
                        height={40}
                        unoptimized={safeHeaderAvatar.endsWith('.svg') || safeHeaderAvatar.startsWith('data:')}
                        onError={() => setHeaderAvatarError(true)}
                        style={{ objectFit: "cover", width: 40, height: 40, borderRadius: "50%" }}
                      />
                    }
                  />
                </Flex>
              </Popover>
              {screens.xs && (
                <S.MenuIcon
                  onClick={() => setCollapsedMobile(!collapsedMobile)}
                >
                  {collapsedMobile ? (
                    <MenuFoldOutlined style={{ fontSize: "24px" }} />
                  ) : (
                    <MenuUnfoldOutlined style={{ fontSize: "24px" }} />
                  )}
                </S.MenuIcon>
              )}
            </Flex>
          </S.HeaderCustom>
          <Layout>
            <S.SiderCustom
              trigger={null}
              width={200}
              breakpoint="lg"
              collapsed={collapsed}
              collapsedWidth={screens?.sm == true ? 80 : 0}
              onCollapse={() => setCollapsed(!collapsed)}
            >
              <S.MenuCustom
                mode="inline"
                selectedKeys={[pathname?.split("/")[2] || "dashboard"]}
                onClick={(e) => router?.push(`/${localActive}/${e?.key}`)}
                items={sideBarMenuFormat}
              />
            </S.SiderCustom>
            <S.LayoutCustom>
              <S.ContentCustom>
                <ErrorBoundary scope="page">{children}</ErrorBoundary>
              </S.ContentCustom>
            </S.LayoutCustom>
          </Layout>
        </S.ContainerLayoutCustom>
      )}
    </>
  );
};

export default MainLayout;
