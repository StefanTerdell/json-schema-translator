# Json Schema Translator

Json Schema Translator translates one version of Json Schema to another in an externally type-safe manner.

The heart of the external type API is the JsonSchemaSpecification-type. Types representing the Json schemas defined by specifications satisfying this type are then inferred from the settings defined in them.

It comes bundled with specifications (and schema types) for many popular Json Schema variants:

- Json Schema Draft 4
- Json Schema Draft 6
- Json Schema Draft 7
- Json Schema Draft 2019-09
- Json Schema Draft 2020-12
- Open AI structued output
- Google AI
- Open API 3.0

Converting between the included schemas is as simple as this:

```typescript
const myGoogleAiSchema: GoogleAiJsonSchema = translateJsonSchema(
  myDraft7Schema,
  "draft7",
  "googleAi",
);
```

See the [Custom Specifications](#custom-specifications) section for how to define your own.

## Example

Lets have a look at a simple example, where we will be translating a Json Schema Draft 6 schema into Json Schema Draft 2020-12.

### The input schema

The Draft 6 schema below describes the following example values:

```json
[{ "b64": "asdf", "any": null }, 123]
```

```json
[{ "b64": "fdsa" }, "Hello, world!"]
```

Lets use one of the included Json Schema types to define it.

```typescript
import { type JsonSchemaDraft6 } from "./src/index.ts";

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

To translate this Json Schema Draft 6 schema into Draft 2020_12, simply feed the schema to the `translateJsonSchema` function, supply a matching input specification, and the target output specification.

Hint: To see which specifications are included by default see the [Introduction](#json-schema-translator) section of the readme. For how to define your own, see the [Custom Specifications](#custom-specifications) section

```typescript
import { translateJsonSchema } from "./src/index.ts";

const translationResult = translateJsonSchema(
  myTupleSchema,
  "draft6",
  "draft2020_12",
);
```

### Expected output

Let's have a look a the expected result:

```typescript
import { type JsonSchemaDraft2020_12 } from "./src/index.ts";

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

You can also create a translator - this is especially useful if you find yourself reusing the same type of translation across your project, or want to define options and custom specification in a single place.

```typescript
import { jsonSchemaTranslator } from "./src/index.ts";

const translator = jsonSchemaTranslator("draft6", "draft2020_12");

const translatorResult: JsonSchemaDraft2020_12 = translator(myTupleSchema);
```

## Custom specifications

You can easily define your own specification and derive a type from it. In the example below we will be basing the specification on draft 4. For a full list of options, reference the files in the `./src/specifications`-directory, or the definition of the root type itself in `./src/JsonSchemaSpecification.ts`.

```typescript
import {
  jsonSchemaDraft4Specification,
  type JsonSchemaSpecification,
  type JsonSchema,
} from "./src/index.ts";

const myCustomSchemaSpecification = {
  ...jsonSchemaDraft4Specification,
  arbitraryJson: false,
  addNullTypeToOptionalProperties: true,
  // Important! Use the `satisfies` keyword instead of defining a value of the type itself.
  // If you don't the inference will not work:
} satisfies JsonSchemaSpecification;

type MyCustomSchemaType = JsonSchema<typeof myCustomSchemaSpecification>;
```

The specification can then be used directly as an input specification

```typescript
const customInputResult: JsonSchemaDraft6 = translateJsonSchema(
  someInputSchema,
  myCustomSchemaSpecification,
  "draft6",
);
```

... or as an output specification

```typescript
const customOutputResult: MyCustomSchemaType = translateJsonSchema(
  customInputResult,
  "draft6",
  myCustomSchemaSpecification,
);
```

... or as part of a `specifications`-option value, and referenced by name for either purpose

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
