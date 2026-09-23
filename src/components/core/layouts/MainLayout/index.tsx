"use client";

import { Button, Flex, Grid, Layout, Popover, Result } from "antd";
import { useLocale } from "next-intl";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import React, {
  useEffect,
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
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [verificationAttempt, setVerificationAttempt] = useState(0);

  const { userInfo } = useAppSelector((state) => state.auth);

  const avatar = webStorageClient.get(constants.AVT);
  const [headerAvatarError, setHeaderAvatarError] = useState<boolean>(false);

  useEffect(() => {
    setHeaderAvatarError(false);
  }, [userInfo?.avatar]);

  const safeHeaderAvatar = !headerAvatarError && (userInfo?.avatar || avatar)
    ? (userInfo?.avatar || avatar)
    : "/images/avatar/avatar.jpg";

  useEffect(() => {
    let active = true;
    let displayTimer: ReturnType<typeof setTimeout>;
    let fadeTimer: ReturnType<typeof setTimeout>;
    let request: ReturnType<typeof verifyToken> | undefined;
    const startTime = Date.now();
    setIsAuth(false);
    setVerificationFailed(false);
    setLoadingVisible(true);
    setLoadingFadeOut(false);
    const token = webStorageClient.getToken();
    if (!token) {
      webStorageClient.removeAll();
      router.replace(`/${localActive}/sign-in`);
    } else {
      request = verifyToken(token);
      request.unwrap().then((res: { data: UserInfo }) => {
        if (!active) return;
        if (!res.data?._id) throw new Error("Invalid verification response");
        dispatch(assignUserInfo({
          id: res.data._id, email: res.data.email,
          firstname: res.data.firstname, lastname: res.data.lastname,
          avatar: res.data.avatar, nickname: res.data.nickname,
          isAdmin: Boolean(res.data.isAdmin), isLeader: Boolean(res.data.isLeader),
        }));
        displayTimer = setTimeout(() => {
          setIsAuth(true);
          setLoadingFadeOut(true);
          fadeTimer = setTimeout(() => setLoadingVisible(false), 350);
        }, Math.max(0, 450 - (Date.now() - startTime)));
      }).catch((error) => {
        if (!active) return;
        if (error?.status === 401) {
          webStorageClient.removeAll();
          router.replace(`/${localActive}/sign-in`);
        } else {
          setLoadingVisible(false);
          setVerificationFailed(true);
        }
      });
    }
    return () => {
      active = false;
      request?.abort();
      clearTimeout(displayTimer);
      clearTimeout(fadeTimer);
    };
  }, [dispatch, localActive, router, verifyToken, verificationAttempt]);

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

  const sideBarMenuFormat = sidebarMenu?.map((item: any) => ({
    ...item,
    label: t(item.label),
    link: `/${item.key}`,
  }));

  return (
    <>
      {loadingVisible && <LoadingScreen fadeOut={loadingFadeOut} />}
      {verificationFailed && <Result status="error" title={t("verificationError")}
        extra={<Button type="primary" onClick={() => setVerificationAttempt((attempt) => attempt + 1)}>{t("retry")}</Button>} />}
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
