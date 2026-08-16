import React from "react";
import { MenuProps } from "antd";
import { AppstoreOutlined, BookOutlined, CompassOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons";

export const sidebarMenu: MenuProps["items"] = [
  {
    key: "dashboard",
    icon: React.createElement(AppstoreOutlined),
    label: "dashboard",
  },
  {
    key: "hall-of-fame",
    icon: React.createElement(TrophyOutlined),
    label: "hallOfFame",
  },
  {
    key: "members",
    icon: React.createElement(TeamOutlined),
    label: "allMember",
  },
  {
    key: "leetcode",
    icon: React.createElement(BookOutlined),
    label: "leetcode",
  },
  {
    key: "discover",
    icon: React.createElement(CompassOutlined),
    label: "discover",
  },
];
