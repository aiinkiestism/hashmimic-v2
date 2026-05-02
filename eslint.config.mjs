import nextConfig from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";

const config = [
  {
    ignores: [
      "dist/**",
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
    ],
  },
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      // r3f's standard pattern is mutating uniforms / refs inside useFrame, which
      // collides with the React 19 compiler immutability checks.
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default config;
