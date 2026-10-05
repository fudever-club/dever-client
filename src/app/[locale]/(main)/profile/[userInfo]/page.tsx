import ProfileModule from "@/components/modules/Profile";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "FU-DEVER | Hồ sơ thành viên",
};

interface IProps {
  params: Promise<{
    userInfo: string;
  }>;
}

async function Profile({ params }: IProps) {
  const { userInfo } = await params;
  return <ProfileModule userInfo={userInfo} />;
}

export default Profile;
