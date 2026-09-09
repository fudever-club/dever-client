import { Content } from "antd/es/layout/layout";
import styled from "styled-components";

export const PageWrapper = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  gap: 16px;

`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;

  .ant-typography {
    margin: 0 !important;
    font-size: 1.5rem !important;
    @media ${(props) => props.theme.breakpoints.smMax} {
      font-size: 1.25rem !important;
    }
  }
`;

export const CustomContent = styled(Content)`
  background: transparent;
  border-radius: 16px;

  display: flex;
  flex-direction: row;
  gap: 20px;

  @media ${(props) => props.theme.breakpoints.xlMax} {
    flex-direction: column;
    gap: 16px;
  }
`;

export const Gallery = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  overflow: visible;

  gap: 16px;

  @media ${(props) => props.theme.breakpoints.xlMax} {
    gap: 16px;
  }
`;

export const LGalleryCol = styled.div`
  flex: 40%;
  max-width: 40%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${(props) => props.theme.breakpoints.xlMax} {
    flex: 100%;
    max-width: 100%;
  }

  @media ${(props) => props.theme.breakpoints.lgMax} {
    flex: 100%;
    max-width: 100%;
  }
`;

export const RGalleryCol = styled.div`
  flex: 60%;
  max-width: 60%;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media ${(props) => props.theme.breakpoints.xlMax} {
    flex: 100%;
    max-width: 100%;
    padding-left: 0;
  }

  @media ${(props) => props.theme.breakpoints.lgMax} {
    flex: 100%;
    max-width: 100%;
    padding-left: 0;
  }
`;

export const AvatarEditorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
