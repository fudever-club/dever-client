import styled from "styled-components";

export const ContainerWrapper = styled.section`
  padding-top: 16px;

  .privacy-settings-card {
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

export const SectionLabel = styled.strong`
  color: #1f2937;
  font-size: 14px;
`;

export const VisibilityRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  gap: 12px;
  padding: 10px 12px;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 200ms ease, box-shadow 200ms ease;

  &:hover {
    border-color: #66b5ff;
  }

  &:focus-within {
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
  }
`;

export const SensitiveNote = styled.p`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .ant-btn {
    transition: all 200ms ease;
  }

  .ant-btn:active {
    transform: scale(0.98);
  }
`;

export const LiveRegion = styled.span`
  color: #475569;
  font-size: 13px;
`;
