import { JsonSchemaDraft4 } from "./draft4.ts";
import { JsonSchemaDraft2020_12 } from "./draft2020_12.ts";

const mySchema2020: JsonSchemaDraft2020_12 = {
  type: "array",
  items: {
    type: "object",
    properties: {
      xbox: {
        type: "number",
        exclusiveMaximum: 123,
      },
    },
  },
};

const mySchema4: JsonSchemaDraft4 = {
  type: "array",
  items: {
    type: "object",
    properties: {
      xbox: {
        type: "number",
        maximum: 123,
        exclusiveMaximum: true,
      },
    },
  },
};
