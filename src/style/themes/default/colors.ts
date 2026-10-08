const themeColors = {
  primaryDarker: "#003B73",
  primaryDark: "#004C99",
  primary: "#0066CC",
  primaryOpacity: "#0066CCBD",
  primaryLight: "#0080FF",
  primaryLighter: "#61bfff",

  secondary: "#e2e8f0",

  // Neutral text tokens (slate-500 #64748B). Dùng cho chữ xám có nghĩa
  // thay vì slate-400/#94A3B8 để đạt WCAG AA trên nền sáng.
  muted: "#64748B",
  // Chỉ dùng trên nền tối (ví dụ header code editor): #94A3B8 trên nền
  // tối vẫn đạt AA, làm tối hơn sẽ gây tụt tương phản.
  mutedOnDark: "#94A3B8",

  backgroundPrimary: "#fafafa",
  backgroundSecondary: "#ffffff",

  borderPrimary: "#d9d9d9",

  textNormal: "#000",
  textWhite: "#FFF",
};

export default themeColors;
