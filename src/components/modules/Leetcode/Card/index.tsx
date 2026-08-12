import Image from "next/image";
import { Flex } from "antd";
import { useState } from "react";

import Typography from "@/components/core/common/Typography";
import { LeetcodeLeaderboardEntry } from "@/helpers/types/leetcodeTypes";

import * as S from "./styles";

function getInitials(entry: LeetcodeLeaderboardEntry) {
  const name = [entry.user?.firstname, entry.user?.lastname].filter(Boolean).join(" ").trim();
  return name ? name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "D";
}

function Card({ data, top, isTop1 }: { data: LeetcodeLeaderboardEntry; top: number; isTop1?: boolean }) {
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const avatar = data.user?.avatar?.trim();
  const showAvatar = Boolean(avatar && !hasAvatarError);
  const name = [data.user?.firstname, data.user?.lastname].filter(Boolean).join(" ").trim() || "Thành viên DEVER";

  return (
    <S.Main $isTop1={isTop1}>
      {isTop1 && <Image src="/icons/crown.svg" alt="Hạng nhất" width={60} height={52} />}
      <S.ImageWrapper>
        {showAvatar ? (
          <Image src={avatar!} alt={name} width={290} height={400} onError={() => setHasAvatarError(true)} />
        ) : (
          <S.AvatarFallback aria-label={name}>{getInitials(data)}</S.AvatarFallback>
        )}
        <span>{top}</span>
      </S.ImageWrapper>
      <S.Content>
        <Typography.Title level={3} $align="center">{name}</Typography.Title>
        <Flex justify="center" gap={4}>
          <Image src="/icons/leetcode.svg" alt="" width={20} height={20} />
          <Typography.Text>{data.acSubmissionList.length * 10} Pts</Typography.Text>
        </Flex>
      </S.Content>
    </S.Main>
  );
}

export default Card;
