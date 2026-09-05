"use client";

import React from "react";
import styled, { keyframes } from "styled-components";

const spinClockwise = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const spinCounterClockwise = keyframes`
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 40%, rgba(240, 247, 255, 0.98) 0%, rgba(255, 255, 255, 0.99) 100%);
  padding: 24px;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const OuterRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #0066CC;
  border-right-color: #0080FF;
  animation: ${spinClockwise} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  box-shadow: 0 0 16px rgba(0, 102, 204, 0.25);
`;

const InnerRing = styled.div`
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-bottom-color: #38BDF8;
  border-left-color: #0066CC;
  animation: ${spinCounterClockwise} 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
`;

const CodeBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(235, 244, 255, 0.95), rgba(219, 234, 254, 0.95));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0066CC;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const Label = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
  margin: 0;
  letter-spacing: 0.02em;
`;

export default function RootLocaleLoading() {
  return (
    <Container>
      <SpinnerWrapper>
        <OuterRing />
        <InnerRing />
        <CodeBadge>&lt;/&gt;</CodeBadge>
      </SpinnerWrapper>
      <Label>Đang khởi tạo không gian FU-DEVER...</Label>
    </Container>
  );
}
