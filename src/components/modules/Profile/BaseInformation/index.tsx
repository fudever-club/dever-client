import "./must.styles.css";
import * as S from "./styles";

import { Flex, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        <S.MainContentWrapper>
          <S.AvatarWrapper>
            {isUserDataFetching ? (
              <Skeleton.Image
                active={isUserDataFetching}
                style={{ width: 140, height: 140 }}
              />
            ) : (
              <S.PreviewGroupCustom>
                <S.AvatarCustom alt="avatar" src={userData?.avatar!} />
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
                <Typography.Title level={3} $fontWeight={700}>
                  {userData?.firstname && userData?.lastname
                    ? `${userData?.firstname} ${userData?.lastname}`
                    : userData?.email}
                </Typography.Title>
              )}

              {isUserDataFetching ? (
                <Skeleton.Input
                  active={isUserDataFetching}
                  size="default"
                  style={{ width: "100%" }}
                />
              ) : (
                <Flex align="center" gap={12}>
                  <Image
                    src={BriefCaseIcon}
                    alt="icon"
                    width={24}
                    height={24}
                  />
                  <Typography.Text $fontSize="16px">
                    {userData?.job ? userData?.job : t("notSetYet")}
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
                <Flex align="center" gap={12}>
                  <Image src={Cake} alt="icon" width={24} height={24} />
                  <Typography.Text $fontSize="16px">
                    {userData?.dob
                      ? moment(userData?.dob).format("DD/MM/YYYY")
                      : t("notSetYet")}
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
                <Flex align="center" gap={12}>
                  <Image src={Gen} alt="icon" width={24} height={24} />
                  <Typography.Text $fontSize="16px">
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
            <Flex vertical>
              <Typography.Text $fontSize="16px">{t("email")}</Typography.Text>
              <Typography.Text $fontSize="16px" $fontWeight={700}>
                {userData?.email ?? t("notSetYet")}
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
            <Flex vertical>
              <Typography.Text $fontSize="16px">
                {t("hometown")}
              </Typography.Text>
              <Typography.Text $fontSize="16px" $fontWeight={700}>
                {userData?.hometown ?? t("notSetYet")}
              </Typography.Text>
            </Flex>
          )}
          {/* {isUserDataFetching ? (
            <Skeleton.Input
              active={isUserDataFetching}
              size="default"
              style={{ width: "100%" }}
            />
          ) : (
            <Flex vertical>
              <Typography.Text $fontSize="16px">{t("phone")}</Typography.Text>
              <Typography.Text $fontSize="16px" $fontWeight={700}>
                {userData?.phone ?? t("notSetYet")}
              </Typography.Text>
            </Flex>
          )} */}
          {isUserDataFetching ? (
            <Skeleton.Input
              active={isUserDataFetching}
              size="default"
              style={{ width: "100%" }}
            />
          ) : (
            <Flex vertical gap={10}>
              <Typography.Text $fontSize="16px" $fontWeight={700}>
                {t("socials")}
              </Typography.Text>
              {userData?.socials! && userData?.socials.length > 0 ? (
                <Flex gap={12} align="center">
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
                <Typography.Text $fontSize="16px">
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
