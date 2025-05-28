import { type JsonSchema } from "../JsonSchema.ts";
import { type NonEmptyArray } from "../utils.ts";
import { type Mutator } from "./Mutator.ts";
import { translateSchema } from "./schema.ts";

export const translateObjectKeywords: Mutator = (ctx) => {
  translateBasicObjectKeywords(ctx);
  translateObjectPropertyKeywords(ctx);
  translateObjectDependencyKeywords(ctx);
};

const translateBasicObjectKeywords: Mutator = ({
  input,
  output,
  handledKeys,
}) => {
  if (input.settings.minProperties) {
    if (
      output.settings.minProperties &&
      input.schema.minProperties !== undefined
    ) {
      output.schema.minProperties = input.schema.minProperties;
    }

    handledKeys.add("minProperties");
  }

  if (input.settings.maxProperties) {
    if (
      output.settings.maxProperties &&
      input.schema.maxProperties !== undefined
    ) {
      output.schema.maxProperties = input.schema.maxProperties;
    }

    handledKeys.add("maxProperties");
  }

  if (output.settings.propertyOrdering) {
    if (input.settings.propertyOrdering && input.schema.propertyOrdering) {
      output.schema.propertyOrdering = input.schema.propertyOrdering;
    } else if (input.schema.properties) {
      output.schema.propertyOrdering = Object.keys(input.schema.properties);
    }

    handledKeys.add("propertyOrdering");
  }
};

const translateObjectPropertyKeywords: Mutator = (ctx) => {
  if (ctx.input.schema.properties) {
    const { properties, required } = Object.keys(
      ctx.input.schema.properties,
    ).reduce(
      (
        acc: {
          properties: Record<string, JsonSchema<typeof ctx.output.settings>>;
          required: string[];
        },
        key,
      ) => {
        const schema = translateSchema({
          ...ctx,
          input: {
            ...ctx.input,
            schema: ctx.input.schema.properties![key],
          },
          path: [...ctx.path, "properties", key],
          forceAllowBooleanSchema: false,
        });

        const explicitlyRequired = Boolean(
          ctx.input.schema.required?.includes(key),
        );

        if (
          !explicitlyRequired &&
          ctx.output.settings.null &&
          ctx.output.settings.addNullTypeToOptionalProperties &&
          (typeof schema !== "object" ||
            schema.type !== "null" ||
            (Array.isArray(schema.type) && !schema.type.includes("null")))
        ) {
          if (typeof schema === "object") {
            if (Array.isArray(schema.type)) {
              schema.type.push("null" as (typeof schema.type)[number]);
            } else if (schema.type) {
              schema.type = [schema.type, "null" as typeof schema.type];
            } else {
              schema.type = "null" as typeof schema.type;
            }

            if (schema.enum && !schema.enum.includes(null)) {
              schema.enum.push(null);
            }

            if (schema.const && schema.const !== null) {
              if (!schema.enum) {
                schema.enum = [schema.const, null];
              } else {
                schema.enum.push(schema.const, null);
              }

              delete schema.const;
            }
          }
        }

        if (
          !explicitlyRequired &&
          ctx.output.settings.nullable &&
          ctx.output.settings.setOptionalPropertiesToNullable
        ) {
          if (typeof schema === "object") {
            schema.nullable = true;
          }
        }

        if (ctx.output.settings.allPropertiesRequired) {
          acc.required.push(key);
        } else {
          const isOptionalByNullable =
            ctx.output.settings.nullable &&
            ctx.output.settings.treatNullablePropertiesAsOptional &&
            typeof schema === "object" &&
            schema.nullable === true;

          const isOptionalByNullType =
            ctx.output.settings.null &&
            ctx.output.settings.treatPropertiesWithNullTypeAsOptional &&
            typeof schema === "object" &&
            (schema.type === "null" ||
              (Array.isArray(schema.type) &&
                schema.type.includes("null" as (typeof schema.type)[number])));

          if (
            explicitlyRequired &&
            !isOptionalByNullable &&
            !isOptionalByNullType
          ) {
            acc.required.push(key);
          }
        }

        acc.properties[key] = schema;

        return acc;
      },
      { properties: {}, required: [] },
    );

    if (Object.keys(properties).length > 0) {
      ctx.output.schema.properties = properties;

      if (required.length > 0 || !ctx.output.settings.nonEmptyRequired) {
        ctx.output.schema.required = required as NonEmptyArray<string>;
      }
    }

    ctx.handledKeys.add("required");
  }

  ctx.handledKeys.add("properties");

  if (
    (ctx.output.schema.type === "object" ||
      (Array.isArray(ctx.output.schema.type) &&
        ctx.output.schema.type.includes("object"))) &&
    ctx.output.settings.additionalProperties &&
    ctx.output.settings.forceAdditionalProperties !== undefined
  ) {
    ctx.output.schema.additionalProperties =
      ctx.output.settings.forceAdditionalProperties;

    ctx.handledKeys.add("additionalProperties");
  } else if (ctx.input.settings.additionalProperties) {
    if (
      ctx.output.settings.additionalProperties &&
      ctx.input.schema.additionalProperties !== undefined
    ) {
      // @ts-expect-error forceAdditionalProperties causes issues here
      ctx.output.schema.additionalProperties = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          // @ts-expect-error forceAdditionalProperties causes issues here
          schema: ctx.input.schema.additionalProperties,
        },
        path: [...ctx.path, "additionalProperties"],
        forceAllowBooleanSchema: true,
      });
    }

    ctx.handledKeys.add("additionalProperties");
  }

  if (ctx.input.settings.patternProperties) {
    if (
      ctx.output.settings.patternProperties &&
      ctx.input.schema.patternProperties !== undefined
    ) {
      ctx.output.schema.patternProperties = Object.keys(
        ctx.input.schema.patternProperties,
      ).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
          acc[key] = translateSchema({
            ...ctx,
            input: {
              ...ctx.input,
              schema: ctx.input.schema.patternProperties![key],
            },
            path: [...ctx.path, "patternProperties", key],
            forceAllowBooleanSchema: false,
          });

          return acc;
        },
        {},
      );
    }

    ctx.handledKeys.add("patternProperties");
  }

  if (ctx.input.settings.unevaluatedProperties) {
    if (
      ctx.output.settings.unevaluatedProperties &&
      ctx.input.schema.unevaluatedProperties != undefined
    ) {
      ctx.output.schema.unevaluatedProperties = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.unevaluatedProperties,
        },
        path: [...ctx.path, "unevaluatedProperties"],
        forceAllowBooleanSchema: false,
      });
    }

    ctx.handledKeys.add("unevaluatedProperties");
  }

  if (ctx.input.settings.propertyNames) {
    if (
      ctx.output.settings.propertyNames &&
      ctx.input.schema.propertyNames != undefined
    ) {
      const propertyNames = translateSchema({
        ...ctx,
        input: {
          ...ctx.input,
          schema: ctx.input.schema.propertyNames,
        },
        path: [...ctx.path, "propertyNames"],
        forceAllowBooleanSchema: false,
      });

      if (typeof propertyNames === "object" && "type" in propertyNames) {
        delete propertyNames.type;
      }

      ctx.output.schema.propertyNames = propertyNames;
    }

    ctx.handledKeys.add("propertyNames");
  }
};

const translateObjectDependencyKeywords: Mutator = (ctx) => {
  const dependentRequired = ctx.input.settings.dependentRequired
    ? (ctx.input.schema.dependentRequired ?? {})
    : Object.keys(
        (ctx.input.settings.dependencies && ctx.input.schema.dependencies) ||
          {},
      ).reduce((acc: Record<string, NonEmptyArray<string>>, key) => {
        // @ts-expect-error Narrowing :p
        const required = ctx.input.schema.dependencies?.[key];

        if (
          Array.isArray(required) &&
          (required.length || !ctx.output.settings.nonEmptyDependencies)
        ) {
          acc[key] = required as NonEmptyArray<string>;
        }

        return acc;
      }, {});

  const dependentSchemas = ctx.input.settings.dependentSchemas
    ? Object.keys(ctx.input.schema.dependentSchemas ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
          // @ts-expect-error: god damnit
          const schema = ctx.input.schema.dependentSchemas[key] as JsonSchema<
            typeof ctx.input.settings
          >;

          acc[key] = translateSchema({
            ...ctx,
            input: {
              ...ctx.input,
              schema,
            },
            path: [...ctx.path, "dependentSchemas", Number(key)],
            forceAllowBooleanSchema: false,
          });

          return acc;
        },
        {},
      )
    : Object.keys(
        (ctx.input.settings.dependencies && ctx.input.schema.dependencies) ||
          {},
      ).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
          // @ts-expect-error Narrowing :p
          const schema = ctx.input.schema.dependencies[key];

          if (!Array.isArray(schema)) {
            acc[key] = translateSchema({
              ...ctx,
              input: {
                ...ctx.input,
                schema,
              },
              path: [...ctx.path, "dependencies", Number(key)],
              forceAllowBooleanSchema: false,
            });
          }

          return acc;
        },
        {},
      );

  if (Object.keys(dependentRequired).length) {
    if (ctx.output.settings.dependentRequired) {
      ctx.output.schema.dependentRequired = dependentRequired;
    } else if (ctx.output.settings.dependencies) {
      if (typeof ctx.output.schema.dependencies === "object") {
        ctx.output.schema.dependencies = {
          ...ctx.output.schema.dependencies,
          ...dependentRequired,
        };
      } else {
        ctx.output.schema.dependencies = dependentRequired;
      }
    }
  }

  if (Object.keys(dependentSchemas).length) {
    if (ctx.output.settings.dependentSchemas) {
      ctx.output.schema.dependentSchemas = dependentSchemas;
    } else if (ctx.output.settings.dependencies) {
      if (typeof ctx.output.schema.dependencies === "object") {
        ctx.output.schema.dependencies = {
          ...ctx.output.schema.dependencies,
          ...dependentSchemas,
        };
      } else {
        ctx.output.schema.dependencies = dependentSchemas;
      }
    }
  }

  if (ctx.input.settings.dependentRequired) {
    ctx.handledKeys.add("dependentRequired");
  } else if (ctx.input.settings.dependencies) {
    ctx.handledKeys.add("dependencies");
  }

  if (ctx.input.settings.dependentSchemas) {
    ctx.handledKeys.add("dependentSchemas");
  } else if (ctx.input.settings.dependencies) {
    ctx.handledKeys.add("dependencies");
  }
};
