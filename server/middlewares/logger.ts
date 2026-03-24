import morgan from 'morgan';

// You can customize the format based on the environment
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const requestLogger = morgan(format);
