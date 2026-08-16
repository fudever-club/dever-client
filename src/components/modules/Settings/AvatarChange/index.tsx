"use client";
import React, { useState } from "react";
import * as S from "./styles";

import {
  Button,
  Card,
  Grid,
  message,
  Skeleton,
  Typography,
  Upload,
} from "antd";
import Image from "next/image";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";

import { CloudUploadOutlined } from "@ant-design/icons";
import { UserInfo } from "@/helpers/types/userTypes";
import { useUpdateUserProfileMutation } from "@/store/queries/settings";
import webStorageClient from "@/utils/webStorageClient";
import { constants } from "@/settings";
import { applyChangeAvatar } from "@/store/slices/auth";
import { useTranslation } from "@/app/i18n/client";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-toolkit";

interface IProps {
  isProfileFetching: boolean;
  userData: UserInfo;
}

function AvatarChange({ isProfileFetching, userData }: IProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [updateUserProfile] = useUpdateUserProfileMutation();
  const dispatch = useAppDispatch();
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");

  const { userInfo } = useAppSelector((state) => state.auth);

  const handleUpload = async ({
    onSuccess,
    onError,
    file,
    onProgress,
  }: any) => {
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
        setIsUploading(true);
      },
    };

    fmData.append("image", file);
    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?expiration=600&key=918aada6b01cafd0f2376e075c429457",
        fmData,
        config
      );

      setImageUrl(res?.data?.data?.url);

      const updateData = {
        avatar: res?.data?.data?.url,
      };

      await updateUserProfile(updateData).unwrap();

      webStorageClient.set(constants.AVT, res?.data?.data?.url);

      dispatch(applyChangeAvatar(res?.data?.data?.url));

      onSuccess("ok");
      setIsUploading(false);
      message.success(t("updateSuccess"));
    } catch (err) {
      onError({ err });
      setIsUploading(false);
      message.error(t("updateError"));
    }
  };

  const displayName =
    [userData?.firstname, userData?.lastname].filter(Boolean).join(" ") ||
    userData?.nickname ||
    [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
    "Thành viên DEVER";

  return (
    <S.ContentWrapper>
      <S.CustomCard>
        <S.AvatarEditorWrapper>
          <div style={{ position: "relative" }}>
            {isProfileFetching ? (
              <Skeleton.Avatar
                active={isProfileFetching}
                size={125}
                shape={"square"}
                style={{ width: 125, height: 125, borderRadius: "8px" }}
              />
            ) : (
              <Image
                src={imageUrl || userInfo.avatar || "/images/avatar/avatar.jpg"}
                width={500}
                height={500}
                alt="avatar"
                style={{
                  objectFit: "cover",
                  width: 125,
                  height: 125,
                  borderRadius: "8px",
                }}
              />
            )}
          </div>
          <S.Wrapper>
            <Typography.Title level={3}>
              {isProfileFetching ? (
                <Skeleton.Input
                  active={isProfileFetching}
                  size={"default"}
                  style={{ width: "100%" }}
                />
              ) : (
                displayName
              )}
            </Typography.Title>
            <Typography.Text style={{ fontSize: "16px" }}>
              {isProfileFetching ? (
                <Skeleton.Input
                  active={isProfileFetching}
                  size={"default"}
                  style={{ width: "100%" }}
                />
              ) : userData?.email != null ? (
                userData?.email
              ) : (
                t("notSetYet")
              )}
            </Typography.Text>

            <Upload
              name="file"
              action={
                "https://api.imgbb.com/1/upload?expiration=600&key=918aada6b01cafd0f2376e075c429457"
              }
              headers={{
                authorization: "authorization-text",
              }}
              customRequest={handleUpload}
              multiple={false}
              fileList={[]}
            >
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                loading={isUploading}
              >
                {t("changeAvatar")}
              </Button>
            </Upload>
          </S.Wrapper>
        </S.AvatarEditorWrapper>
      </S.CustomCard>
    </S.ContentWrapper>
  );
}

export default AvatarChange;
