import styled from "styled-components";

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

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const ToolbarTitle = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 18px;
  }
`;

export const TableScroll = styled.div`
  overflow-x: auto;
  border-radius: 12px;
`;
