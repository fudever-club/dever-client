export const createQueryString = (name: string, value: string, resetPage = false) => {
  const params = new URLSearchParams(window?.location?.search);

  value ? params.set(name, value) : params.delete(name);
  if (resetPage) params.delete("page");

  return "?" + params.toString();
};
