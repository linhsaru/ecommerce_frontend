import apiConfig from './axiosConfig';

export const apiGetDemo = (rqBody) => {
  const url = `/api/dashboard/information`;
  return apiConfig.post(url, rqBody);
};
