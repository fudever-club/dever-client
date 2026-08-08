"use client";

import styled from "styled-components";
import { Flex } from "antd";

export const Wrapper = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;

  h4 {
    margin-top: 32px;
    margin-bottom: 16px;

    font-size: 24px;
  }
  > p {
    margin-bottom: 32px;
  }
`;

export const AccessNotice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 0 24px;
  padding: 12px 14px;
  color: #004c99;
  background: #eff7ff;
  border: 1px solid #b8dcff;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.5;
`;

export const SignUpPrompt = styled(Flex)`
  align-items: center;
  color: #4b5563;
  font-size: 14px;

  a {
    font-weight: 600;
  }

  a:focus-visible {
    outline: 3px solid #66b5ff;
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

export const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
