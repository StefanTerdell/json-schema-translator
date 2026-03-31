# Json Schema Translator

Translate JSON Schemas between draft versions and vendor formats -- type-safe in, type-safe out.

```typescript
import { translateJsonSchema } from "json-schema-translator";

// Draft 7 in, Draft 2020-12 out. That's it.
const result = translateJsonSchema(mySchema, "draft7", "draft2020_12");
```

Keywords are automatically converted where possible (`items` array becomes `prefixItems`, `definitions` becomes `$defs`, boolean `exclusiveMinimum` becomes numeric, `nullable` becomes a `"null"` type union, and so on). Keywords that can't be represented in the target spec are dropped -- and you can find out which ones with the `droppedKeys` option.

## Installation

```bash
deno add jsr:@stefan/json-schema-translator
```

```bash
npm install json-schema-translator
```

## Bundled specifications

Comes with specifications and inferred schema types for:

| Name                       | String key                 | Type                           |
| -------------------------- | -------------------------- | ------------------------------ |
| JSON Schema Draft 4        | `"draft4"`                 | `JsonSchemaDraft4`             |
| JSON Schema Draft 6        | `"draft6"`                 | `JsonSchemaDraft6`             |
| JSON Schema Draft 7        | `"draft7"`                 | `JsonSchemaDraft7`             |
| JSON Schema Draft 2019-09  | `"draft2019_09"`           | `JsonSchemaDraft2019_09`       |
| JSON Schema Draft 2020-12  | `"draft2020_12"`           | `JsonSchemaDraft2020_12`       |
| OpenAI Structured Output   | `"openAiStructuredOutput"` | `OpenAiStructuredOutputSchema` |
| Google AI                  | `"googleAi"`               | `GoogleAiJsonSchema`           |
| OpenAPI 3.0                | `"openApi3_0"`             | `OpenApi3_0Schema`             |

You can also [define your own](#custom-specifications).

## Quick examples

### One-shot translation

```typescript
const draft4Schema = translateJsonSchema(myDraft7Schema, "draft7", "draft4");
```

### Reusable translator

```typescript
import { jsonSchemaTranslator } from "json-schema-translator";
const toGoogleAi = jsonSchemaTranslator("draft7", "googleAi");

const schema1 = toGoogleAi(myFirstSchema);
const schema2 = toGoogleAi(mySecondSchema);
```

### Tracking dropped keywords

```typescript
const dropped = new Map();

const result = translateJsonSchema(mySchema, "draft7", "googleAi", {
  droppedKeys: dropped,
});

// Each entry maps a path to { keyword, value }:
for (const [path, { keyword, value }] of dropped) {
  console.log(`${path.join(".")}: ${keyword} = ${JSON.stringify(value)}`);
}
// "if: if = {\"type\":\"string\"}"
// "properties.x.minLength: minLength = 3"
```

## Detailed example

Let's look at a more involved example, translating a JSON Schema Draft 6 schema into Draft 2020-12.

### The input schema

The Draft 6 schema below describes the following example values:

```json
[{ "b64": "asdf", "any": null }, 123]
```

```json
[{ "b64": "fdsa" }, "Hello, world!"]
```

```typescript
import { type JsonSchemaDraft6 } from "json-schema-translator";

const myTupleSchema: JsonSchemaDraft6 = {
  type: "array",
  // The `item` keyword below defines a "tuple" - an array of fixed
  // length where each index is confined to a specific type.
  items: [
    // In this particular case the first item must be an object.
    {
      type: "object",
      required: ["b64"],
      properties: {
        // The object must contain a base64 string in the `b64` key:
        b64: {
          type: "string",
          media: {
            binaryEncoding: "base64",
          },
        },
        // It may also contain arbitrary Json in the `any` key:
        any: {},
      },
      // No other properties are allowed.
      additionalProperties: false,
    },
    // The second item must be either a string or a number.
    {
      type: ["number", "string"],
    },
  ],
  // No other items are allowed.
  additionalItems: false,
};
```

### Basic translation

To translate this Draft 6 schema into Draft 2020-12, feed it to `translateJsonSchema` with the matching input and output specification names.

```typescript
const translationResult = translateJsonSchema(
  myTupleSchema,
  "draft6",
  "draft2020_12",
);
```

### Expected output

```typescript
import { type JsonSchemaDraft2020_12 } from "json-schema-translator";

const myTranslatedTupleSchema: JsonSchemaDraft2020_12 = {
  type: "array",
  // Here we can see the keyword has changed from `items`
  // to `prefixItems`, as the `items` keyword contained an
  // array of schemas, which is no longer strictly supported
  // in Json Schema Draft 2020-12:
  prefixItems: [
    {
      type: "object",
      required: ["b64"],
      properties: {
        b64: {
          type: "string",
          // The `binaryEncoding` value of the `media` keyword
          // has been moved to the `contentEncoding` keyword
          contentEncoding: "base64",
        },
        // Draft 2020-12 supports boolean schemas anywhere in
        // the schema tree, not just in `additionalProperties` and
        // `additionalItems`. Equivalent schemas are collapsed into
        // booleans: `{}` translates to `true`, while `{ not: {} }`
        // translates into `false`.
        any: true,
      },
      additionalProperties: false,
    },
    // The second item schema remains unchanged.
    {
      type: ["number", "string"],
    },
  ],
  // In conjunction with `prefixItems`, the `items` keyword now
  // fills the role of the `additionalItems` keyword:
  items: false,
};
```


### Creating a reusable translator function

You can also create a translator -- this is especially useful if you find yourself reusing the same type of translation across your project, or want to define options and custom specifications in a single place.

```typescript
const translator = jsonSchemaTranslator("draft6", "draft2020_12");

const translatorResult: JsonSchemaDraft2020_12 = translator(myTupleSchema);
```


## Options

Both `translateJsonSchema` and `jsonSchemaTranslator` accept an options object as the last argument. `jsonSchemaTranslator` returns a function that also accepts option overrides per call.

```typescript
translateJsonSchema(schema, "draft7", "googleAi", options);

const translate = jsonSchemaTranslator("draft7", "googleAi", options);
translate(schema, optionOverrides);
```

### `droppedKeys`

Controls what happens when a keyword exists in the source
schema but isn't supported by the target specification and
can't be converted to an equivalent. Each entry in the map
is `{ keyword, value }` -- the keyword name and its original
value from the source schema.

| Value            | Behavior                                                         |
| ---------------- | ---------------------------------------------------------------- |
| `"ignore"`       | Silent (default)                                                 |
| `"warn"`         | `console.warn` with the dropped keys map                         |
| `"throw"`        | Throws an error listing all dropped keys and their paths         |
| `Map`            | Populates the provided Map with `[path, { keyword, value }]` entries |
| `(map) => void`  | Calls your function with the populated Map after translation     |

```typescript
// Throw on any data loss
translateJsonSchema(schema, "draft7", "googleAi", {
  droppedKeys: "throw",
});

// Collect and inspect
const dropped = new Map();
translateJsonSchema(schema, "draft7", "googleAi", {
  droppedKeys: dropped,
});
for (const [path, { keyword, value }] of dropped) {
  console.log(`${path.join(".")}: ${keyword} = ${JSON.stringify(value)}`);
}
```

### `unhandledKeys`

Controls what happens when the source schema contains
non-standard properties (arbitrary JSON) that can't be
copied to the target. Same option values as `droppedKeys`.
Default: `"ignore"`. Each entry in the map is
`{ keyword, value, reason }`.

The two reasons an arbitrary key can be unhandled:
- **`"disallowed"`**: The target spec doesn't allow arbitrary JSON properties
- **`"conflict"`**: The key already exists in the translated output

### `copyJson`

Controls how JSON values are copied during translation.

| Value                 | Behavior                                                      |
| --------------------- | ------------------------------------------------------------- |
| `"stringifyAndParse"` | Deep copy via `JSON.parse(JSON.stringify(...))` (default)     |
| `"shallow"`           | Shallow spread copy (faster, but nested objects share references) |
| `(value) => value`    | Custom copy function                                          |

### `specifications`

Register custom specifications that can be referenced by string name. See [Custom Specifications](#custom-specifications).

## Custom specifications

You can define your own specification and derive a type from it. In the example below we will be basing the specification on Draft 4.

For a full list of options, reference the files in `./src/specifications/` or the `JsonSchemaSpecification` type definition.

### Extending an existing specification

```typescript
import {
  type JsonSchema,
  jsonSchemaDraft4Specification,
  type JsonSchemaSpecification,
} from "json-schema-translator";

const myCustomSchemaSpecification = {
  ...jsonSchemaDraft4Specification,
  arbitraryJson: false,
  addNullTypeToOptionalProperties: true,
  // Important! Use the `satisfies` keyword instead of defining
  // a value of the type itself. If you don't, inference won't work:
} satisfies JsonSchemaSpecification;

type MyCustomSchemaType = JsonSchema<typeof myCustomSchemaSpecification>;
```

### Using the specification

The specification can be used directly as an input specification:

```typescript
const customInputResult: JsonSchemaDraft6 = translateJsonSchema(
  {},
  myCustomSchemaSpecification,
  "draft6",
);
```

... or as an output specification:

```typescript
const customOutputResult: MyCustomSchemaType = translateJsonSchema(
  customInputResult,
  "draft6",
  myCustomSchemaSpecification,
);
```

... or registered by name via the `specifications` option and referenced by string:

```typescript
const specifications = {
  myCustomSchemaSpecification,
};

const optionsResult: JsonSchemaDraft6 = translateJsonSchema(
  customOutputResult,
  "myCustomSchemaSpecification",
  "draft6",
  { specifications },
);
```

This also works with `jsonSchemaTranslator`:

```typescript
const customTranslator = jsonSchemaTranslator(
  "draft6",
  "myCustomSchemaSpecification",
  { specifications },
);

const myTranslatorResult: MyCustomSchemaType = customTranslator(optionsResult);

myTranslatorResult;
```
