import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    input: {
      target: `http://localhost:3000/api-json`,
    },
    output: {
      mode: "tags-split",
      target: "./api/petstore.ts",
      schemas: "./api/models",
      client: "react-query",
      clean: true,
    },
  },
});
