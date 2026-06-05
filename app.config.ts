const IS_DEV = process.env.APP_VARIANT === "development";
const ID = "com.solarin.myapp";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return `${ID}.dev`;
  }

  return ID;
};

const getAppName = () => {
  if (IS_DEV) {
    return "[my-app-dev]";
  }

  return "[my-app]";
};

export default ({ config }: { config: any }) => ({
  ...config,
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
