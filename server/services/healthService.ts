import { getDbTime } from '../models/healthModel.js';

export const checkHealth = async () => {
  const dbTime = await getDbTime();
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbConnected: !!dbTime,
    dbTime: dbTime?.now
  };
};
