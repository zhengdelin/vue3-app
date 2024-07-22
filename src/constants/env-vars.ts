const env = import.meta.env;
export default {
  env: env,
  isDev: env.DEV,
  isProd: env.PROD,
  mode: env.MODE,
  globSetting: {
    title: env.VITE_APP_TITLE,
    apiURL: env.VITE_APP_API_URL,
  },
} as const;
