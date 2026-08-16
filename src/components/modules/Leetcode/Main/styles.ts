import styled from "styled-components";

export const Container = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

export const HeaderBanner = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, #004c99 0%, #0066cc 55%, #0080ff 100%);
  padding: 20px 16px;
  color: #ffffff;
  box-shadow: 0 10px 25px -3px rgba(0, 102, 204, 0.25);
  margin-top: 2px;

  @media (min-width: 640px) {
    border-radius: 24px;
    padding: 28px 32px;
  }
`;

export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
`;

export const TitleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  backdrop-filter: blur(4px);
`;

export const MainTitle = styled.h1`
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 8px 0 6px 0;
  line-height: 1.25;

  @media (min-width: 640px) {
    font-size: 26px;
  }

  @media (min-width: 1024px) {
    font-size: 28px;
  }
`;

export const Description = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;

  @media (min-width: 640px) {
    font-size: 14px;
    line-height: 1.6;
  }
`;

export const RefreshButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const PodiumGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: flex-end;
  justify-items: center;
  margin: 8px 0 16px 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin: 16px 0 24px 0;
  }
`;

export const PodiumItem = styled.div<{ $orderMobile: number; $orderDesktop: number }>`
  width: 100%;
  display: flex;
  justify-content: center;
  order: ${(props) => props.$orderMobile};

  @media (min-width: 768px) {
    order: ${(props) => props.$orderDesktop};
  }
`;

export const CardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.04);

  @media (min-width: 640px) {
    border-radius: 24px;
    padding: 24px 28px;
  }
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  h2 {
    font-size: 16px;
    font-weight: 800;
    color: #0f172a;
    margin: 0;

    @media (min-width: 640px) {
      font-size: 18px;
    }
  }
`;

export const LeaderboardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const LeaderboardRow = styled.div<{ $rank: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 16px;
  border: 1px solid
    ${(props) =>
      props.$rank === 0
        ? "#FDE68A"
        : props.$rank === 1
        ? "#E2E8F0"
        : props.$rank === 2
        ? "#FED7AA"
        : "#F1F5F9"};
  background-color: ${(props) =>
    props.$rank === 0
      ? "#FEFCE8"
      : props.$rank === 1
      ? "#F8FAFC"
      : props.$rank === 2
      ? "#FFF7ED"
      : "#FFFFFF"};
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

export const RankBadge = styled.span<{ $rank: number }>`
  width: 28px;
  height: 28px;
  min-width: 28px;
  min-height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 900;
  font-size: 12px;
  background-color: ${(props) =>
    props.$rank === 0
      ? "#FEF3C7"
      : props.$rank === 1
      ? "#F1F5F9"
      : props.$rank === 2
      ? "#FFEDD5"
      : "#F8FAFC"};
  color: ${(props) =>
    props.$rank === 0
      ? "#92400E"
      : props.$rank === 1
      ? "#475569"
      : props.$rank === 2
      ? "#C2410C"
      : "#94A3B8"};
`;

export const UserText = styled.div`
  min-width: 0;
  flex: 1;

  h4 {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 2px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }

  p {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (min-width: 640px) {
      font-size: 12px;
    }
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-end;

  @media (min-width: 640px) {
    align-self: center;
  }
`;

export const ACPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  background-color: #eff6ff;
  color: #0066cc;
  border: 1px solid #bfdbfe;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 4px 12px;
    font-size: 12px;
  }
`;

export const PtsPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  background-color: #f1f5f9;
  color: #334155;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 4px 12px;
    font-size: 12px;
  }
`;
