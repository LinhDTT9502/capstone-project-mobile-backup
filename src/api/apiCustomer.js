import axios from "axios";

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Customer';

export const getCustomerLoyalPoints = (userId) => {
  return axios.get(`/get-loyal-points`, {
    params: { userId },
  });
};
