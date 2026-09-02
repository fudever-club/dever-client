"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  message,
  Skeleton,
  Typography,
  Upload,
  Space,
  Tag,
  Tooltip,
} from "antd";
import {
  CustomerServiceOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  CloudUploadOutlined,
  CheckCircleFilled,
  LinkOutlined,
  SoundOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";
import axios from "axios";

import * as S from "./styles";
import { UserInfo, FavoriteTrack } from "@/helpers/types/userTypes";
import { useUpdateUserProfileMutation } from "@/store/queries/settings";
import { useTranslation } from "@/app/i18n/client";
import webStorageClient from "@/utils/webStorageClient";

interface IProps {
  isUserProfileLoading: boolean;
  userData: UserInfo;
}

const PRESET_TRACKS = [
  {
    title: "DEVER Midnight Code Session",
    artist: "FPTU Lofi Chillout • Beats to Code to",
    url: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    tag: "☕ FPTU Lofi",
  },
  {
    title: "Cyberpunk Synthwave Focus",
    artist: "Chill Electronic & Deep Focus",
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    tag: "🌆 Synthwave",
  },
  {
    title: "Coffee Shop Rain & Code",
    artist: "Relaxing Acoustic Lofi Beats",
    url: "https://ice2.somafm.com/lush-128-mp3",
    tag: "🌧️ Coffee Shop",
  },
  {
    title: "Peaceful Piano Study Beats",
    artist: "Instrumental Coding Flow",
    url: "https://ice4.somafm.com/dronezone-128-mp3",
    tag: "🎹 Piano Lofi",
  },
];

function FavoriteTrackChange({ isUserProfileLoading, userData }: IProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, "settings");

  const [title, setTitle] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (userData?.favoriteTrack) {
      setTitle(userData.favoriteTrack.title || "");
      setArtist(userData.favoriteTrack.artist || "");
      setUrl(userData.favoriteTrack.url || "");
    }
  }, [userData]);

  // Audio Playback Preview Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const activeUrl = url || PRESET_TRACKS[0].url;
      if (audioRef.current.src !== activeUrl) {
        audioRef.current.src = activeUrl;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Playback error:", err);
          message.warning("Không thể phát thử audio từ URL này. Vui lòng kiểm tra định dạng file âm thanh.");
          setIsPlaying(false);
        });
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_TRACKS[0]) => {
    setTitle(preset.title);
    setArtist(preset.artist);
    setUrl(preset.url);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = preset.url;
      setIsPlaying(false);
    }
  };

  // Upload Audio to Cloudflare R2 via Backend
  const handleUploadAudio = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "audio");

    const token = webStorageClient.getToken();
    const API_SERVER =
      process.env.NEXT_PUBLIC_API_SERVER ||
      (typeof window !== "undefined" && window.location.hostname.includes("localhost")
        ? "http://localhost:5000"
        : "https://dever-backend-production.up.railway.app");

    setIsUploading(true);
    try {
      const res = await axios.post(`${API_SERVER}/api/v1/upload/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.status === "success" && res.data?.data?.url) {
        const audioPublicUrl = res.data.data.url;
        setUrl(audioPublicUrl);
        if (!title) {
          // Infer title from filename without extension
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          setTitle(cleanName);
        }
        if (!artist) {
          setArtist("Custom Member Audio • Coding Chill");
        }
        message.success(t("trackUploadSuccess"));
        onSuccess(res.data);
      } else {
        throw new Error(res.data?.message || "Upload failed");
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || t("trackUploadError"));
      onError(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        favoriteTrack: {
          title: title.trim() || null,
          artist: artist.trim() || null,
          url: url.trim() || null,
        },
      };

      await updateUserProfile(payload).unwrap();
      message.success(t("trackSaveSuccess"));
    } catch (error) {
      message.error(t("trackSaveError"));
    }
  };

  const hasChanges =
    (title || "") !== (userData?.favoriteTrack?.title || "") ||
    (artist || "") !== (userData?.favoriteTrack?.artist || "") ||
    (url || "") !== (userData?.favoriteTrack?.url || "");

  return (
    <S.ContainerWrapper>
      <S.CustomCard>
        {isUserProfileLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <S.ContentWrapper>
            {/* Header Title */}
            <S.HeaderSection>
              <S.IconBadge>
                <CustomerServiceOutlined />
              </S.IconBadge>
              <div>
                <Typography.Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                  {t("favoriteTrackTitle")}
                </Typography.Title>
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {t("favoriteTrackSubtitle")}
                </Typography.Text>
              </div>
            </S.HeaderSection>

            {/* Presets Selection */}
            <S.PresetsSection>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography.Text strong style={{ fontSize: 13, color: "#334155" }}>
                  {t("trackPresets")}
                </Typography.Text>
              </div>
              <S.PresetList>
                {PRESET_TRACKS.map((preset, idx) => {
                  const isSelected = url === preset.url;
                  return (
                    <S.PresetChip
                      key={idx}
                      type="button"
                      $active={isSelected}
                      onClick={() => handleSelectPreset(preset)}
                    >
                      {isSelected && <CheckCircleFilled style={{ color: "#0066CC" }} />}
                      {preset.tag} — {preset.title}
                    </S.PresetChip>
                  );
                })}
              </S.PresetList>
            </S.PresetsSection>

            {/* Form Inputs Grid */}
            <S.FormGrid>
              <S.FieldWrapper>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {t("trackSongTitle")}
                </Typography.Text>
                <Input
                  size="large"
                  placeholder={t("trackSongTitlePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </S.FieldWrapper>

              <S.FieldWrapper>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {t("trackArtist")}
                </Typography.Text>
                <Input
                  size="large"
                  placeholder={t("trackArtistPlaceholder")}
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </S.FieldWrapper>

              <S.FullWidthField>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    {t("trackAudioUrl")}
                  </Typography.Text>
                  <Upload
                    customRequest={handleUploadAudio}
                    showUploadList={false}
                    accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.flac"
                  >
                    <Button
                      size="small"
                      icon={<CloudUploadOutlined />}
                      loading={isUploading}
                      style={{ borderRadius: 6, fontSize: 12, color: "#0066CC", borderColor: "#93C5FD" }}
                    >
                      {t("trackUploadButton")}
                    </Button>
                  </Upload>
                </div>
                <Input
                  size="large"
                  prefix={<LinkOutlined style={{ color: "#94A3B8" }} />}
                  placeholder={t("trackAudioUrlPlaceholder")}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </S.FullWidthField>
            </S.FormGrid>

            {/* Live Audio Preview Player */}
            <S.PreviewPlayer>
              <S.TrackInfo>
                <S.PlayButton type="button" onClick={togglePlay} aria-label={isPlaying ? "Tạm dừng" : "Phát thử"}>
                  {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
                </S.PlayButton>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {title || "DEVER Midnight Code Session"}
                  </div>
                  <div style={{ fontSize: 12, color: "#93C5FD", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {artist || "FPTU Lofi Chillout • Beats to Code to"}
                  </div>
                </div>
              </S.TrackInfo>

              <Space>
                {isPlaying && (
                  <Tag color="cyan" style={{ border: "none", animation: "pulse 2s infinite" }}>
                    <SoundOutlined /> Đang phát thử
                  </Tag>
                )}
              </Space>

              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onError={() => setIsPlaying(false)}
                preload="none"
              />
            </S.PreviewPlayer>

            {/* Action Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSave}
                loading={isLoading}
                disabled={!hasChanges}
                style={{
                  borderRadius: 8,
                  backgroundColor: "#0066CC",
                  fontWeight: 600,
                  minWidth: 140,
                }}
              >
                {isLoading ? t("trackSaving") : t("trackSave")}
              </Button>
            </div>
          </S.ContentWrapper>
        )}
      </S.CustomCard>
    </S.ContainerWrapper>
  );
}

export default FavoriteTrackChange;
