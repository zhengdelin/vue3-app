const env = import.meta.env;
export default {
  env,
  isDev: env.DEV,
  isProd: env.PROD,
  mode: env.MODE,
} as const;
