export const getUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo;
};
