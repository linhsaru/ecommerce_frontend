import { apiService } from './api';

export const apiGetDemo = (rqBody) => {
  const url = `/api/dashboard/information`;
  return apiService.post(url, rqBody);
};
