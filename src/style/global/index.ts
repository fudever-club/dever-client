import { createGlobalStyle, css } from "styled-components";
import { themes } from "../themes";

export const calculateLetterSpacing = (
  fontSize: string,
  percent: number = 0.02
) => {
  const fontSizeNumber = parseFloat(fontSize);
  return `${fontSizeNumber * percent}px`;
};

const reset = css`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    line-height: 1.5;
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #1E293B;
    background-color: #F8FCFF;
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1.3;
    font-weight: 700;
    margin: 0;
  }

  p {
    line-height: 1.5;
    margin: 0;
  }

  img, svg {
    display: inline-block;
    vertical-align: middle;
  }

  a {
    text-decoration: none;
    color: ${themes?.default?.colors?.primary || "#0066CC"};
    transition: color 0.2s ease;
  }

  .cursor-pointer {
    cursor: pointer;
  }
`;

const scrollApp = css`
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #CBD5E1;
    border-radius: 9999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #94A3B8;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${reset}
  ${scrollApp}
`;

export default GlobalStyle;
