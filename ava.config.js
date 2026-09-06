const config = {
  files: ["src/**/*.test.ts"],
  extensions: ["ts"],
  nodeArguments: ["--import=tsx"],
  environmentVariables: {
    TESTING: "true",
  },
};

export default config;
