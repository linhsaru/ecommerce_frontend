export const getUserInfo = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  return userInfo;
};
