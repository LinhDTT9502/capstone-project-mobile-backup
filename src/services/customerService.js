import { getCustomerLoyalPoints } from "../api/apiCustomer";

export const fetchCustomerLoyalPoints = async (userId) => {
  const response = await getCustomerLoyalPoints(userId);
  return response.data;
};
