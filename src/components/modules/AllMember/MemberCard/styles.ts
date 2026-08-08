import styled from "styled-components";
import { Image, Select as SelectFromAntd } from "antd";

export const ComponentsWrapper = styled.div<{ $interactive: boolean }>`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  padding: 10px 0px 20px 0px;  
  
  transition: 300ms;
  
  cursor: ${(props) => (props.$interactive ? "pointer" : "default")};
  
  &:hover{
    ${(props) => props.$interactive && "scale: 1.02;"}
  }

  &:focus-visible {
    outline: ${(props) => (props.$interactive ? "3px solid #0066cc" : "none")};
    outline-offset: 4px;
    border-radius: 12px;
  }

  &:active {
    ${(props) => props.$interactive && "scale: 0.98;"}
  }
`;

export const ItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const CustomImage = styled.div`
    width: 100%;
    height: 220px;
    border-radius: 12px !important;
    overflow: hidden;
`;

export const Gen = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  
  font-size: 20px;
  font-weight: 600;
  color: white;
  background-color: ${(props) => props?.theme?.colors.primaryOpacity} !important; 

  padding: 0px 16px;
  border-radius: 10px;

  display: flex;
  align-items: center;
`;

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column; 
    text-align: center;
`;

export const ProfileUnavailable = styled.span`
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.4;
`;
