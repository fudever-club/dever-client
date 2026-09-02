import React from "react";

interface SocialIconProps {
  platform?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const getSocialPlatformKey = (rawKey?: string): string => {
  if (!rawKey) return "UNKNOWN";
  const upper = rawKey.toUpperCase();
  if (upper.includes("FACEBOOK") || upper.includes("FB.COM")) return "FACEBOOK";
  if (upper.includes("GITHUB")) return "GITHUB";
  if (upper.includes("INSTAGRAM") || upper.includes("INSTA")) return "INSTAGRAM";
  if (upper.includes("LINKEDIN")) return "LINKEDIN";
  if (upper.includes("YOUTUBE") || upper.includes("YT")) return "YOUTUBE";
  if (upper.includes("LEETCODE")) return "LEETCODE";
  if (upper.includes("TIKTOK")) return "TIKTOK";
  if (upper.includes("TWITTER") || upper === "X") return "TWITTER";
  return "UNKNOWN";
};

export const SocialBrandIcon: React.FC<SocialIconProps> = ({
  platform = "UNKNOWN",
  size = 40,
  className = "",
  style = {},
}) => {
  const key = getSocialPlatformKey(platform);

  switch (key) {
    case "FACEBOOK":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#1877F2" />
          <path
            d="M29.5 25.1L30.2 20.3H25.6V17.2C25.6 15.9 26.2 14.6 28.3 14.6H30.4V10.5C29.1 10.3 27.8 10.2 26.5 10.2C22.6 10.2 20 12.6 20 16.9V20.3H16V25.1H20V37.2C20.9 37.3 21.8 37.4 22.8 37.4C23.8 37.4 24.7 37.3 25.6 37.2V25.1H29.5Z"
            fill="white"
          />
        </svg>
      );

    case "GITHUB":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#24292F" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 10C16.27 10 10 16.27 10 24C10 30.19 14.02 35.43 19.59 37.28C20.29 37.41 20.55 36.98 20.55 36.61C20.55 36.29 20.54 35.24 20.53 34.12C16.63 34.97 15.81 32.48 15.81 32.48C15.18 30.87 14.26 30.44 14.26 30.44C12.99 29.57 14.36 29.59 14.36 29.59C15.77 29.69 16.51 31.04 16.51 31.04C17.76 33.18 19.79 32.56 20.59 32.21C20.72 31.3 21.08 30.68 21.48 30.33C18.37 29.98 15.1 28.77 15.1 23.41C15.1 21.88 15.65 20.63 16.54 19.65C16.4 19.3 15.91 17.88 16.68 15.96C16.68 15.96 17.85 15.59 20.51 17.39C21.62 17.08 22.81 16.93 24 16.92C25.19 16.93 26.38 17.08 27.49 17.39C30.15 15.59 31.32 15.96 31.32 15.96C32.09 17.88 31.6 19.3 31.46 19.65C32.36 20.63 32.89 21.88 32.89 23.41C32.89 28.79 29.61 29.97 26.49 30.32C26.99 30.76 27.45 31.62 27.45 32.93C27.45 34.81 27.43 36.33 27.43 36.61C27.43 36.98 27.68 37.42 28.4 37.28C33.97 35.43 38 30.18 38 24C38 16.27 31.73 10 24 10Z"
            fill="white"
          />
        </svg>
      );

    case "INSTAGRAM":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <defs>
            <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFDC80" />
              <stop offset="30%" stopColor="#F77737" />
              <stop offset="60%" stopColor="#FD1D1D" />
              <stop offset="100%" stopColor="#C13584" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="24" fill="url(#instaGrad)" />
          <path
            d="M28.8 14H19.2C16.33 14 14 16.33 14 19.2V28.8C14 31.67 16.33 34 19.2 34H28.8C31.67 34 34 31.67 34 28.8V19.2C34 16.33 31.67 14 28.8 14ZM31.6 28.8C31.6 30.34 30.34 31.6 28.8 31.6H19.2C17.66 31.6 16.4 30.34 16.4 28.8V19.2C16.4 17.66 17.66 16.4 19.2 16.4H28.8C30.34 16.4 31.6 17.66 31.6 19.2V28.8Z"
            fill="white"
          />
          <path
            d="M24 18.8C21.13 18.8 18.8 21.13 18.8 24C18.8 26.87 21.13 29.2 24 29.2C26.87 29.2 29.2 26.87 29.2 24C29.2 21.13 26.87 18.8 24 18.8ZM24 26.8C22.46 26.8 21.2 25.54 21.2 24C21.2 22.46 22.46 21.2 24 21.2C25.54 21.2 26.8 22.46 26.8 24C26.8 25.54 25.54 26.8 24 26.8Z"
            fill="white"
          />
          <circle cx="29.4" cy="18.6" r="1.4" fill="white" />
        </svg>
      );

    case "LINKEDIN":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#0A66C2" />
          <path
            d="M17.4 15.2C17.4 16.4 16.5 17.4 15.2 17.4C13.9 17.4 13 16.4 13 15.2C13 14 13.9 13 15.2 13C16.5 13 17.4 14 17.4 15.2ZM13.2 19.2H17.2V32H13.2V19.2ZM23.6 19.2H27.4V21H27.5C28 20 29.3 18.9 31.2 18.9C35.2 18.9 36 21.5 36 25V32H32V25.7C32 24.2 32 22.3 29.9 22.3C27.8 22.3 27.5 23.9 27.5 25.6V32H23.5L23.6 19.2Z"
            fill="white"
          />
        </svg>
      );

    case "YOUTUBE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#FF0000" />
          <path
            d="M33.4 18.2C33.1 16.9 32.1 15.9 30.8 15.6C28.5 15 24 15 24 15C24 15 19.5 15 17.2 15.6C15.9 15.9 14.9 16.9 14.6 18.2C14 20.5 14 24 14 24C14 24 14 27.5 14.6 29.8C14.9 31.1 15.9 32.1 17.2 32.4C19.5 33 24 33 24 33C24 33 28.5 33 30.8 32.4C32.1 32.1 33.1 31.1 33.4 29.8C34 27.5 34 24 34 24C34 24 34 20.5 33.4 18.2ZM22 28V20L28 24L22 28Z"
            fill="white"
          />
        </svg>
      );

    case "LEETCODE":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#282828" />
          <path
            d="M26.4 13.5L29.6 16.7C30.3 17.4 30.3 18.5 29.6 19.2L24.8 24L29.6 28.8C30.3 29.5 30.3 30.6 29.6 31.3L26.4 34.5C25.7 35.2 24.6 35.2 23.9 34.5L16.2 26.8C14.6 25.2 14.6 22.8 16.2 21.2L23.9 13.5C24.6 12.8 25.7 12.8 26.4 13.5Z"
            fill="#FFA116"
          />
          <path
            d="M22.5 23.2H33.5C34.3 23.2 35 23.9 35 24.7C35 25.5 34.3 26.2 33.5 26.2H22.5C21.7 26.2 21 25.5 21 24.7C21 23.9 21.7 23.2 22.5 23.2Z"
            fill="white"
          />
        </svg>
      );

    case "TIKTOK":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#010101" />
          <path
            d="M29.5 14C28.8 16.1 27.1 17.7 25 18.1V27.5C25 30.5 22.5 33 19.5 33C16.5 33 14 30.5 14 27.5C14 24.5 16.5 22 19.5 22C20.1 22 20.7 22.1 21.2 22.3V25.6C20.7 25.3 20.1 25.1 19.5 25.1C18.1 25.1 17 26.2 17 27.6C17 29 18.1 30.1 19.5 30.1C20.9 30.1 22 29 22 27.6V14H25.3C25.5 15.6 26.8 16.9 28.4 17.1V14H29.5Z"
            fill="white"
          />
        </svg>
      );

    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          className={className}
          style={{ borderRadius: "50%", flexShrink: 0, ...style }}
        >
          <circle cx="24" cy="24" r="24" fill="#0066CC" />
          <path
            d="M24 13C17.9 13 13 17.9 13 24C13 30.1 17.9 35 24 35C30.1 35 35 30.1 35 24C35 17.9 30.1 13 24 13ZM31.9 23H27.9C27.8 20.5 27.2 18.2 26.3 16.3C28.8 17.4 30.8 19.9 31.9 23ZM24 15.1C25.1 17.2 25.8 19.9 25.9 23H22.1C22.2 19.9 22.9 17.2 24 15.1ZM16.1 25H20.1C20.2 27.5 20.8 29.8 21.7 31.7C19.2 30.6 17.2 28.1 16.1 25ZM20.1 23H16.1C17.2 19.9 19.2 17.4 21.7 16.3C20.8 18.2 20.2 20.5 20.1 23ZM24 32.9C22.9 30.8 22.2 28.1 22.1 25H25.9C25.8 28.1 25.1 30.8 24 32.9ZM26.3 31.7C27.2 29.8 27.8 27.5 27.9 25H31.9C30.8 28.1 28.8 30.6 26.3 31.7Z"
            fill="white"
          />
        </svg>
      );
  }
};
