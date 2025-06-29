import { JsonSchema } from "../../JsonSchema.ts";
import { isAnySchema, isNeverSchema } from "../../utils/schemaUtils.ts";
import { NonEmptyArray } from "../../utils/UtilityTypes.ts";
import { Mutator } from "../Mutator.ts";
import { translateSchema } from "../translateSchema.ts";

export const translateObjectKeywords: Mutator = (ctx) => {
  translateBasicObjectKeywords(ctx);
  translateObjectPropertyKeywords(ctx);
  translateObjectDependencyKeywords(ctx);
};

const translateBasicObjectKeywords: Mutator = ({
  from: input,
  into: output,
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
  if (ctx.from.schema.properties) {
    const { properties, required } = Object.keys(
      ctx.from.schema.properties,
    ).reduce(
      (
        acc: {
          properties: Record<string, JsonSchema<typeof ctx.into.settings>>;
          required: string[];
        },
        key,
      ) => {
        const schema = translateSchema({
          ...ctx,
          from: {
            ...ctx.from,
            schema: ctx.from.schema.properties![key],
          },
          path: [...ctx.path, "properties", key],
          forceAllowBooleanSchema: false,
        });

        const isNever = isNeverSchema(schema, ctx.into.settings);

        if (ctx.into.settings.excludeNeverProperties && isNever) {
          return acc;
        }

        const explicitlyRequired = Boolean(
          ctx.from.schema.required?.includes(key),
        );

        if (
          !explicitlyRequired &&
          ctx.into.settings.type.includes("null") &&
          ctx.into.settings.addNullTypeToOptionalProperties &&
          (typeof schema !== "object" ||
            schema.type !== "null" ||
            (Array.isArray(schema.type) && !schema.type.includes("null")))
        ) {
          if (typeof schema === "object") {
            if (Array.isArray(schema.type)) {
              schema.type.push("null" as (typeof schema.type)[number]);
            } else if (schema.type) {
              if (!ctx.into.settings.singleType) {
                // @ts-expect-error :p
                schema.type = [schema.type, "null" as typeof schema.type];
              }
            } else if (
              schema.anyOf &&
              // @ts-expect-error:
              !schema.anyOf.some(
                // @ts-expect-error:
                (subSchema) =>
                  typeof subSchema === "object" &&
                  (Array.isArray(subSchema.type)
                    ? subSchema.type.includes("null")
                    : subSchema.type === "null"),
              )
            ) {
              // @ts-expect-error:
              schema.anyOf.push({ type: "null" } as typeof schema);
            } else if (
              schema.oneOf &&
              // @ts-expect-error:
              !schema.oneOf.some(
                // @ts-expect-error:
                (subSchema) =>
                  typeof subSchema === "object" &&
                  (Array.isArray(subSchema.type)
                    ? subSchema.type.includes("null")
                    : subSchema.type === "null"),
              )
            ) {
              // @ts-expect-error:
              schema.oneOf.push({ type: "null" } as typeof schema);
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
          ctx.into.settings.nullable &&
          ctx.into.settings.setOptionalPropertiesToNullable
        ) {
          if (typeof schema === "object") {
            schema.nullable = true;
          }
        }

        if (ctx.into.settings.allPropertiesRequired) {
          acc.required.push(key);
        } else {
          const isOptionalByNullable =
            ctx.into.settings.nullable &&
            ctx.into.settings.treatNullablePropertiesAsOptional &&
            typeof schema === "object" &&
            schema.nullable === true;

          const isOptionalByNullType =
            ctx.into.settings.type.includes("null") &&
            ctx.into.settings.treatPropertiesWithNullTypeAsOptional &&
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
      ctx.into.schema.properties = properties;

      if (required.length > 0 || !ctx.into.settings.nonEmptyRequired) {
        ctx.into.schema.required = required as NonEmptyArray<string>;
      }
    }

    ctx.handledKeys.add("required");
  }

  ctx.handledKeys.add("properties");

  if (
    (ctx.into.schema.type === "object" ||
      (Array.isArray(ctx.into.schema.type) &&
        ctx.into.schema.type.includes("object"))) &&
    ctx.into.settings.additionalProperties &&
    ctx.into.settings.forceAdditionalProperties !== undefined
  ) {
    ctx.into.schema.additionalProperties =
      ctx.into.settings.forceAdditionalProperties;

    ctx.handledKeys.add("additionalProperties");
  } else if (ctx.from.settings.additionalProperties) {
    if (
      ctx.into.settings.additionalProperties &&
      ctx.from.schema.additionalProperties !== undefined
    ) {
      // @ts-expect-error forceAdditionalProperties causes issues here
      ctx.into.schema.additionalProperties = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          // @ts-expect-error forceAdditionalProperties causes issues here
          schema: ctx.from.schema.additionalProperties,
        },
        path: [...ctx.path, "additionalProperties"],
        forceAllowBooleanSchema: true,
      });
    }

    ctx.handledKeys.add("additionalProperties");
  }

  if (ctx.from.settings.patternProperties) {
    if (
      ctx.into.settings.patternProperties &&
      ctx.from.schema.patternProperties !== undefined
    ) {
      ctx.into.schema.patternProperties = Object.keys(
        ctx.from.schema.patternProperties,
      ).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.into.settings>>, key) => {
          acc[key] = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
              schema: ctx.from.schema.patternProperties![key],
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

  if (ctx.from.settings.unevaluatedProperties) {
    if (
      (ctx.into.settings.unevaluatedProperties ||
        ctx.into.settings.additionalProperties) &&
      ctx.from.schema.unevaluatedProperties != undefined
    ) {
      const unevaluatedProperties = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema: ctx.from.schema.unevaluatedProperties,
        },
        path: [...ctx.path, "unevaluatedProperties"],
        forceAllowBooleanSchema: false,
      });

      if (ctx.into.settings.unevaluatedProperties) {
        ctx.into.schema.unevaluatedProperties = unevaluatedProperties;
      } else if (ctx.into.schema.additionalProperties === undefined) {
        // @ts-expect-error :p
        ctx.into.schema.additionalProperties = unevaluatedProperties;
      } else if (
        isAnySchema(ctx.into.schema.additionalProperties, ctx.into.settings)
      ) {
        // @ts-expect-error :p
        ctx.into.schema.additionalProperties = unevaluatedProperties;
      }
    }

    ctx.handledKeys.add("unevaluatedProperties");
  }

  if (ctx.from.settings.propertyNames) {
    if (
      ctx.into.settings.propertyNames &&
      ctx.from.schema.propertyNames != undefined
    ) {
      const propertyNames = translateSchema({
        ...ctx,
        from: {
          ...ctx.from,
          schema: ctx.from.schema.propertyNames,
        },
        path: [...ctx.path, "propertyNames"],
        forceAllowBooleanSchema: false,
      });

      if (typeof propertyNames === "object" && "type" in propertyNames) {
        delete propertyNames.type;
      }

      ctx.into.schema.propertyNames = propertyNames;
    }

    ctx.handledKeys.add("propertyNames");
  }
};

const translateObjectDependencyKeywords: Mutator = (ctx) => {
  const dependentRequired = ctx.from.settings.dependentRequired
    ? (ctx.from.schema.dependentRequired ?? {})
    : Object.keys(
        (ctx.from.settings.dependencies && ctx.from.schema.dependencies) || {},
      ).reduce((acc: Record<string, NonEmptyArray<string>>, key) => {
        // @ts-expect-error Narrowing :p
        const required = ctx.from.schema.dependencies?.[key];

        if (
          Array.isArray(required) &&
          (required.length || !ctx.into.settings.nonEmptyDependencies)
        ) {
          acc[key] = required as NonEmptyArray<string>;
        }

        return acc;
      }, {});

  const dependentSchemas = ctx.from.settings.dependentSchemas
    ? Object.keys(ctx.from.schema.dependentSchemas ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.into.settings>>, key) => {
          // @ts-expect-error: god damnit
          const schema = ctx.from.schema.dependentSchemas[key] as JsonSchema<
            typeof ctx.from.settings
          >;

          acc[key] = translateSchema({
            ...ctx,
            from: {
              ...ctx.from,
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
        (ctx.from.settings.dependencies && ctx.from.schema.dependencies) || {},
      ).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.into.settings>>, key) => {
          // @ts-expect-error Narrowing :p
          const schema = ctx.from.schema.dependencies[key];

          if (!Array.isArray(schema)) {
            acc[key] = translateSchema({
              ...ctx,
              from: {
                ...ctx.from,
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
    if (ctx.into.settings.dependentRequired) {
      ctx.into.schema.dependentRequired = dependentRequired;
    } else if (ctx.into.settings.dependencies) {
      if (typeof ctx.into.schema.dependencies === "object") {
        ctx.into.schema.dependencies = {
          ...ctx.into.schema.dependencies,
          ...dependentRequired,
        };
      } else {
        ctx.into.schema.dependencies = dependentRequired;
      }
    }
  }

  if (Object.keys(dependentSchemas).length) {
    if (ctx.into.settings.dependentSchemas) {
      ctx.into.schema.dependentSchemas = dependentSchemas;
    } else if (ctx.into.settings.dependencies) {
      if (typeof ctx.into.schema.dependencies === "object") {
        ctx.into.schema.dependencies = {
          ...ctx.into.schema.dependencies,
          ...dependentSchemas,
        };
      } else {
        ctx.into.schema.dependencies = dependentSchemas;
      }
    }
  }

  if (ctx.from.settings.dependentRequired) {
    ctx.handledKeys.add("dependentRequired");
  } else if (ctx.from.settings.dependencies) {
    ctx.handledKeys.add("dependencies");
  }

  if (ctx.from.settings.dependentSchemas) {
    ctx.handledKeys.add("dependentSchemas");
  } else if (ctx.from.settings.dependencies) {
    ctx.handledKeys.add("dependencies");
  }
};
