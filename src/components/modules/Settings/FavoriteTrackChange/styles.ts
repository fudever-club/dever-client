import styled from "styled-components";
import { Card } from "antd";

export const ContainerWrapper = styled.div`
  width: 100%;
`;

export const CustomCard = styled(Card)`
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .ant-card-body {
    padding: 24px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #e6f4ff;
  color: #0066cc;
  font-size: 20px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PresetsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
`;

export const PresetList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PresetChip = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${(props) => (props.$active ? "#0066cc" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#e6f4ff" : "#ffffff")};
  color: ${(props) => (props.$active ? "#0066cc" : "#334155")};

  &:hover {
    border-color: #0066cc;
    color: #0066cc;
    transform: translateY(-1px);
  }
`;

export const PreviewPlayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: linear-gradient(135deg, #091e3a 0%, #030d1d 100%);
  border-radius: 14px;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 102, 204, 0.15);
  border: 1px solid rgba(0, 102, 204, 0.3);
`;

export const TrackInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const PlayButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0066cc;
  color: #ffffff;
  border: none;
  cursor: pointer;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #0080ff;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
