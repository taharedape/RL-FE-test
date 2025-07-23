module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
  ],
  parserOptions: {
    ecmaVersion: "latest", // or your preferred version
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    project: ["./tsconfig.json"], // Required for type-aware linting
  },
  ignorePatterns: [
    "dist",
    "node_modules",
    "components.json",
    "tailwind.config.js",
    "tsconfig.json",
    "tsconfig.node.json",
    "postcss.config.js",
    ".eslintrc.cjs",
    "vite.config.ts",
    "netlify.toml",
    "vercel.json",
    "vercel.json",
    ".vscode",
    ".idea",
  ],
  plugins: ["react", "react-refresh", "@typescript-eslint"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": "off"
  },
  settings: {
    react: {
      version: "detect", // Automatically detect React version
    },
  },
}
