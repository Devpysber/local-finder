import * as leadModel from '../models/leadModel.js';

export const submitLead = async (
  businessId: string,
  userName: string,
  userPhone: string,
  message: string
) => {
  // Pass data to the model layer to create the lead
  const newLead = await leadModel.createLead(businessId, userName, userPhone, message);
  return newLead;
};
