import { JsonSchema } from "../JsonSchema.ts";
import { NonEmptyArray } from "../utils.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchemaInternal.ts";
import { Mutator } from "./Mutator.ts";

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
  if (input.schema.maxProperties !== undefined) {
    output.schema.maxProperties = input.schema.maxProperties;
  }

  handledKeys.add("maxProperties");

  if (input.schema.minProperties !== undefined) {
    output.schema.minProperties = input.schema.minProperties;
  }

  handledKeys.add("minProperties");
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
        const schema = translateJsonSchemaInternal({
          ...ctx,
          input: {
            ...ctx.input,

            schema: ctx.input.schema.properties![key],
          },
          path: [...ctx.path, "properties", key],
          forceAllowBooleanSchema: false,
        });

        if (ctx.output.settings.addAllOptionalToRequired) {
          acc.required.push(key);
        } else {
          const isOptionalByNullable =
            ctx.output.settings.nullable &&
            ctx.output.settings.addNullableToOptional &&
            typeof schema === "object" &&
            schema.nullable === true;

          const isOptionalByNullType =
            ctx.output.settings.nullType &&
            ctx.output.settings.addNullTypeToOptional &&
            typeof schema === "object" &&
            (schema.type === "null" ||
              (Array.isArray(schema.type) && schema.type.includes("null")));

          if (
            ctx.input.schema.required?.includes(key) &&
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

  if (ctx.input.schema.additionalProperties !== undefined) {
    ctx.output.schema.additionalProperties = translateJsonSchemaInternal({
      ...ctx,
      input: {
        ...ctx.input,
        schema: ctx.input.schema.additionalProperties,
      },
      path: [...ctx.path, "additionalProperties"],
      forceAllowBooleanSchema: true,
    });
  }

  ctx.handledKeys.add("additionalProperties");

  if (ctx.input.schema.patternProperties !== undefined) {
    ctx.output.schema.patternProperties = Object.keys(
      ctx.input.schema.patternProperties,
    ).reduce(
      (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
        acc[key] = translateJsonSchemaInternal({
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

  if (ctx.input.settings.unevaluatedProperties) {
    if (
      ctx.output.settings.unevaluatedProperties &&
      ctx.input.schema.unevaluatedProperties != undefined
    ) {
      ctx.output.schema.unevaluatedProperties = translateJsonSchemaInternal({
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
      const propertyNames = translateJsonSchemaInternal({
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
  const dependentRequired = ctx.input.settings.dependentRequiredAndSchemas
    ? (ctx.input.schema.dependentRequired ?? {})
    : Object.keys(ctx.input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, NonEmptyArray<string>>, key) => {
          const required = ctx.input.schema.dependencies?.[key];

          if (
            Array.isArray(required) &&
            (required.length || !ctx.output.settings.nonEmptyDependencies)
          ) {
            acc[key] = required as NonEmptyArray<string>;
          }

          return acc;
        },
        {},
      );

  const dependentSchemas = ctx.input.settings.dependentRequiredAndSchemas
    ? Object.keys(ctx.input.schema.dependentSchemas ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
          // @ts-expect-error: god damnit
          const schema = ctx.input.schema.dependentSchemas[key] as JsonSchema<
            typeof ctx.input.settings
          >;

          acc[key] = translateJsonSchemaInternal({
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
    : Object.keys(ctx.input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof ctx.output.settings>>, key) => {
          const schema = ctx.input.schema.dependencies![key];

          if (!Array.isArray(schema)) {
            acc[key] = translateJsonSchemaInternal({
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

  if (ctx.input.settings.dependentRequiredAndSchemas) {
    ctx.handledKeys.add("dependentRequired");
    ctx.handledKeys.add("dependentSchemas");
  } else {
    ctx.handledKeys.add("dependencies");
  }

  if (ctx.output.settings.dependentRequiredAndSchemas) {
    if (Object.keys(dependentRequired).length) {
      ctx.output.schema.dependentRequired = dependentRequired;
    }

    if (Object.keys(dependentSchemas).length) {
      ctx.output.schema.dependentSchemas = dependentSchemas;
    }
  } else {
    const dependencies = {
      ...dependentRequired,
      ...dependentSchemas,
    };

    if (Object.keys(dependencies).length) {
      ctx.output.schema.dependencies = dependencies;
    }
  }
};
