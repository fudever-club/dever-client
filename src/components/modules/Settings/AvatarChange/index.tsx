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
import { compressImage } from "@/utils/imageCompressor";
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
  const [imgError, setImgError] = useState<boolean>(false);
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
    const token = webStorageClient.getToken();
    const API_SERVER = constants.API_SERVER;

    setIsUploading(true);
    try {
      const compressedFile = await compressImage(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 600,
        quality: 0.85,
      });

      const fmData = new FormData();
      fmData.append("file", compressedFile);
      fmData.append("folder", "avatar");

      const res = await axios.post(`${API_SERVER}/api/v1/upload/image`, fmData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (event: any) => {
          if (event.total) {
            onProgress({ percent: (event.loaded / event.total) * 100 });
          }
        },
      });

      const uploadedUrl = res?.data?.data?.url;
      if (!uploadedUrl) {
        throw new Error(res?.data?.message || "Tải ảnh lên thất bại");
      }

      setImageUrl(uploadedUrl);
      setImgError(false);

      const updateData = {
        avatar: uploadedUrl,
      };

      await updateUserProfile(updateData).unwrap();

      webStorageClient.set(constants.AVT, uploadedUrl);

      dispatch(applyChangeAvatar(uploadedUrl));

      onSuccess("ok");
      setIsUploading(false);
      message.success(t("updateSuccess"));
    } catch (err: any) {
      onError({ err });
      setIsUploading(false);
      message.error(err?.response?.data?.message || t("updateError"));
    }
  };

  const displayName =
    [userData?.firstname, userData?.lastname].filter(Boolean).join(" ") ||
    userData?.nickname ||
    [userInfo?.firstname, userInfo?.lastname].filter(Boolean).join(" ") ||
    "Thành viên DEVER";

  const effectiveAvatar: string =
    !imgError && (imageUrl || userInfo?.avatar)
      ? (imageUrl || userInfo?.avatar || "/images/avatar/avatar.jpg")
      : "/images/avatar/avatar.jpg";

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
                src={effectiveAvatar}
                width={500}
                height={500}
                alt="avatar"
                onError={() => setImgError(true)}
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
              customRequest={handleUpload}
              multiple={false}
              fileList={[]}
              showUploadList={false}
              accept="image/*"
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
