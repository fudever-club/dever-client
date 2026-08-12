import React from "react";
import { MenuProps } from "antd";
import { UserOutlined, BookOutlined } from "@ant-design/icons";

export const sidebarMenu: MenuProps["items"] = [
  {
    key: "members",
    icon: React.createElement(UserOutlined),
    label: "allMember",
  },
  {
    key: "leetcode",
    icon: React.createElement(BookOutlined),
    label: "leetcode",
  },
];
