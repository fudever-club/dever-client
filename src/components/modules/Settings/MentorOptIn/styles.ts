import styled from "styled-components";

export const ContainerWrapper = styled.section`
  padding-top: 16px;

  .mentor-optin-card {
    border: 1px solid #d9e9fb;
    border-radius: 12px;
    background: linear-gradient(145deg, #ffffff 0%, #f6faff 100%);
  }

  .ant-card-body {
    padding: 20px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .ant-typography {
    margin-bottom: 0;
  }
`;

export const HeadingRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  h3 {
    margin: 0;
  }
`;

export const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  color: #ffffff;
  background: #0066cc;
  border-radius: 10px;
  font-size: 18px;
`;

export const SwitchRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  gap: 12px;
  padding: 10px 12px;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:hover {
    border-color: #66b5ff;
  }

  &:focus-within {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
  }
`;

export const SwitchText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const SwitchTitle = styled.strong`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
`;

export const SwitchDesc = styled.span`
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
`;

export const SwitchHitArea = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  flex-shrink: 0;
`;

export const TopicsLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

export const LiveRegion = styled.span`
  color: #475569;
  font-size: 13px;
`;
