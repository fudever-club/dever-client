const prefixAuth: string = "/core";
const prefixBase: string = "/api/v1";
const prefixOther: string = "/api/core";

const prefixApiAuth: string = `/api/core`;

const endpointAuth = {
  SIGN_IN: `${prefixBase}/auth/login/`,
  VERIFY_TOKEN: `${prefixBase}/verifyToken`,
};

const endpointAllMember = {
  GET_ALL_MEMBERS: `${prefixBase}/users/`,
  GET_ALL_DEPARTMENTS: `${prefixBase}/department`,
  GET_ALL_POSITION: `${prefixBase}/position`,
  GET_ALL_MAJOR: `${prefixBase}/major`,
};

const endpointSettings = {
  GET_PROFILE: `${prefixBase}/users/{id}`,
  EDIT_PROFILE: `${prefixBase}/edit-profile`,
  SOCIAL_ENUMS: `${prefixBase}/social`,
  POSITION_ENUMS: `${prefixBase}/position`,
  DEPARTMENT_ENUMS: `${prefixBase}/department`,
  MAJOR_ENUMS: `${prefixBase}/major`,
  CHANGE_PASSWORD: `${prefixBase}/edit-profile/change-password`,
};

const endpointProfile = {
  GET_PROFILE_BY_ID: `${prefixBase}/users/{id}`,
  GET_PROFILE_BY_SLUG: `${prefixBase}/users/slug/{name}`,
};

const endpointLeetcode = {
  GET_LEADERBOARD: `${prefixBase}/leetcode/`,
  SUBCRIBE_LEADERBOARD: `${prefixBase}/leetcode/subcribe`,
  UPDATE: `${prefixBase}/leetcode/update`,
};

const endpointEcosystem = {
  EVENTS: `${prefixBase}/events`,
  RESOURCES: `${prefixBase}/resources`,
  BLOGS: `${prefixBase}/blogs`,
  PROJECT_LAB: `${prefixBase}/project-lab`,
};

const endpointGamification = {
  MY_STATS: `${prefixBase}/gamification/my-stats`,
  DAILY_CHECKIN: `${prefixBase}/gamification/daily-checkin`,
  HALL_OF_FAME: `${prefixBase}/gamification/hall-of-fame`,
};

const endpointOther = {};

export {
  endpointAuth,
  endpointOther,
  endpointAllMember,
  endpointSettings,
  endpointProfile,
  endpointLeetcode,
  endpointEcosystem,
  endpointGamification,
};
