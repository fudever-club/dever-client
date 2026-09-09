import { Avatar, Card, Image } from "antd";
import styled from "styled-components";

export const ContainerWrapper = styled.div`
  width: 100%;
`;

export const CustomCard = styled(Card)`
  border-radius: 16px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04) !important;
  .ant-card-body {
    padding: 18px !important;
    @media ${(props) => props.theme.breakpoints.smMax} {
      padding: 14px !important;
    }
  }
`;

export const MainContentWrapper = styled.div`
  display: flex;
  gap: 14px;
  flex-direction: column;
`;

export const PreviewGroupCustom = styled(Image.PreviewGroup)`
`;

export const AvatarCustom = styled(Image)`
  width: 120px !important;
  height: 120px !important;
  object-fit: cover;
  border-radius: 16px !important;
  border: 2px solid #eff6ff !important;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08) !important;

  @media ${(props) => props.theme.breakpoints.smMax} {
    width: 88px !important;
    height: 88px !important;
    border-radius: 14px !important;
  }
`;

export const AvatarWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: row;
  align-items: center;

  @media (min-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
  }

  @media ${(props) => props.theme.breakpoints.smMax} {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }
`;

export const RSideContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;