const isProduction = process.env.NODE_ENV === 'production';

const logger = {
  log: (...args: any) => {
    if (!isProduction){ console.log(...args)};
  },
  warn: (...args: any) => {
    if (!isProduction) console.warn(...args);
  },
  error: (...args: any) => {
    console.error(...args); 
  },
};

export default logger