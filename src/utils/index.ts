export const toTitleCase = (s: string) => {
  s = s.replace(/_/g, " ");
  return s.replace(/\w\S*/g, (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
