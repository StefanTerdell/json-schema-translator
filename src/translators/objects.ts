import { JsonSchema } from "../JsonSchema.ts";
import { NonEmptyArray } from "../utils.ts";
import { translateJsonSchemaInternal } from "../translateJsonSchema.ts";
import { Mutator } from "./Mutator.ts";

export const translateObjectKeywords: Mutator = (input, output, options) => {
  if (input.schema.properties) {
    const { properties, required } = Object.keys(
      input.schema.properties,
    ).reduce(
      (
        acc: {
          properties: Record<string, JsonSchema<typeof output.settings>>;
          required: string[];
        },
        key,
      ) => {
        const schema = translateJsonSchemaInternal(
          {
            settings: input.settings,
            schema: input.schema.properties![key],
            path: [...input.path, "properties", key],
          },
          {
            settings: output.settings,
            forceAllowBooleanSchema: false,
            unhandledKeys: output.unhandledKeys,
          },
          options,
        );

        if (output.settings.addAllOptionalToRequired) {
          acc.required.push(key);
        } else {
          const isOptionalByNullable =
            output.settings.nullable &&
            output.settings.addNullableToOptional &&
            typeof schema === "object" &&
            schema.nullable === true;

          const isOptionalByNullType =
            output.settings.nullType &&
            output.settings.addNullTypeToOptional &&
            typeof schema === "object" &&
            (schema.type === "null" ||
              (Array.isArray(schema.type) && schema.type.includes("null")));

          if (
            input.schema.required?.includes(key) &&
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
      output.schema.properties = properties;

      if (required.length > 0 || !output.settings.nonEmptyRequired) {
        output.schema.required = required as NonEmptyArray<string>;
      }
    }

    input.handledKeys.add("required");
  }

  input.handledKeys.add("properties");

  if (input.schema.additionalProperties !== undefined) {
    output.schema.additionalProperties = translateJsonSchemaInternal(
      {
        settings: input.settings,
        schema: input.schema.additionalProperties,
        path: [...input.path, "additionalProperties"],
      },
      {
        settings: output.settings,
        forceAllowBooleanSchema: true,
        unhandledKeys: output.unhandledKeys,
      },
      options,
    );
  }

  input.handledKeys.add("additionalProperties");

  if (input.schema.patternProperties !== undefined) {
    output.schema.patternProperties = Object.keys(
      input.schema.patternProperties,
    ).reduce((acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
      acc[key] = translateJsonSchemaInternal(
        {
          settings: input.settings,
          schema: input.schema.patternProperties![key],
          path: [...input.path, "patternProperties", key],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
        options,
      );

      return acc;
    }, {});
  }

  input.handledKeys.add("patternProperties");

  if (input.settings.unevaluatedProperties) {
    if (
      output.settings.unevaluatedProperties &&
      input.schema.unevaluatedProperties !== undefined
    ) {
      output.schema.unevaluatedProperties = translateJsonSchemaInternal(
        {
          settings: input.settings,
          // @ts-expect-error ISSUE: Narrowing :p
          schema: input.schema.unevaluatedProperties,
          path: [...input.path, "unevaluatedProperties"],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
        options,
      );
    }

    input.handledKeys.add("unevaluatedProperties");
  }

  if (input.settings.propertyNames) {
    if (
      output.settings.propertyNames &&
      input.schema.propertyNames !== undefined
    ) {
      const propertyNames = translateJsonSchemaInternal(
        {
          settings: input.settings,
          // @ts-expect-error ISSUE: Narrowing :p
          schema: input.schema.propertyNames,
          path: [...input.path, "propertyNames"],
        },
        {
          settings: output.settings,
          forceAllowBooleanSchema: false,
          unhandledKeys: output.unhandledKeys,
        },
        options,
      );

      if (typeof propertyNames === "object" && "type" in propertyNames) {
        delete propertyNames.type;
      }

      // @ts-expect-error ISSUE: Messy type not allowing "type" kw
      output.settings.propertyNames = propertyNames;
    }

    input.handledKeys.add("propertyNames");
  }

  if (input.schema.maxProperties !== undefined) {
    output.schema.maxProperties = input.schema.maxProperties;
  }

  input.handledKeys.add("maxProperties");

  if (input.schema.minProperties !== undefined) {
    output.schema.minProperties = input.schema.minProperties;
  }

  input.handledKeys.add("minProperties");

  const dependentRequired = input.settings.dependentRequiredAndSchemas
    ? (input.schema.dependentRequired ?? {})
    : Object.keys(input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, NonEmptyArray<string>>, key) => {
          const required = input.schema.dependencies?.[key];

          if (
            Array.isArray(required) &&
            (required.length || !output.settings.nonEmptyDependencies)
          ) {
            acc[key] = required as NonEmptyArray<string>;
          }

          return acc;
        },
        {},
      );

  const dependentSchemas = input.settings.dependentRequiredAndSchemas
    ? Object.keys(input.schema.dependentSchemas ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
          // @ts-expect-error: god damnit
          const schema = input.schema.dependentSchemas[key] as JsonSchema<
            typeof input.settings
          >;

          acc[key] = translateJsonSchemaInternal(
            {
              settings: input.settings,
              schema,
              path: [...input.path, "dependentSchemas", Number(key)],
            },
            {
              settings: output.settings,
              forceAllowBooleanSchema: false,
              unhandledKeys: output.unhandledKeys,
            },
            options,
          );

          return acc;
        },
        {},
      )
    : Object.keys(input.schema.dependencies ?? {}).reduce(
        (acc: Record<string, JsonSchema<typeof output.settings>>, key) => {
          const schema = input.schema.dependencies![key];

          if (!Array.isArray(schema)) {
            acc[key] = translateJsonSchemaInternal(
              {
                settings: input.settings,
                schema,
                path: [...input.path, "dependencies", Number(key)],
              },
              {
                settings: output.settings,
                forceAllowBooleanSchema: false,
                unhandledKeys: output.unhandledKeys,
              },
              options,
            );
          }

          return acc;
        },
        {},
      );

  if (input.settings.dependentRequiredAndSchemas) {
    input.handledKeys.add("dependentRequired");
    input.handledKeys.add("dependentSchemas");
  } else {
    input.handledKeys.add("dependencies");
  }

  if (output.settings.dependentRequiredAndSchemas) {
    if (Object.keys(dependentRequired).length) {
      output.schema.dependentRequired = dependentRequired;
    }

    if (Object.keys(dependentSchemas).length) {
      output.schema.dependentSchemas = dependentSchemas;
    }
  } else {
    const dependencies = {
      ...dependentRequired,
      ...dependentSchemas,
    };

    if (Object.keys(dependencies).length) {
      output.schema.dependencies = dependencies;
    }
  }
};
