import { match } from "../../utils/contextUtils.ts";
import { Mutator } from "../Mutator.ts";

export const translateAnnotationKeywords: Mutator = (ctx) => {
  translateDefaultAnnotationKeywords(ctx);
  translateControlledAnnotationKeywords(ctx);
  translate$schemaKeyword(ctx);
};

const translateDefaultAnnotationKeywords: Mutator = ({
  from: input,
  into: output,
  handledKeys,
}) => {
  if (input.schema.title !== undefined) {
    output.schema.title = input.schema.title;
  }

  handledKeys.add("title");

  if (input.schema.description !== undefined) {
    output.schema.description = input.schema.description;
  }

  handledKeys.add("description");

  if (input.schema.markdownDescription !== undefined) {
    if (output.settings.markdownDescription) {
      output.schema.markdownDescription = input.schema.markdownDescription;
    } else if (output.schema.description === undefined) {
      output.schema.description = input.schema.markdownDescription;
    }

    handledKeys.add("markdownDescription");
  }

  if (input.schema.default !== undefined) {
    output.schema.default = input.schema.default;
  }

  handledKeys.add("default");
};

const translateControlledAnnotationKeywords: Mutator = (ctx) => {
  match(
    ctx,
    { $comment: true },
    {
      from(ctx) {
        ctx.handledKeys.add("$comment");
      },
      both(ctx) {
        ctx.into.schema.$comment = ctx.from.schema.$comment;
        ctx.handledKeys.add("$comment");
      },
    },
  );

  const { from: input, into: output, handledKeys } = ctx;

  if (input.settings.$comment) {
    if (output.settings.$comment && input.schema.$comment !== undefined) {
      output.schema.$comment = input.schema.$comment;
    }

    handledKeys.add("$comment");
  }

  if (input.settings.deprecated) {
    if (output.settings.deprecated && input.schema.deprecated !== undefined) {
      output.schema.deprecated = input.schema.deprecated;
    }

    handledKeys.add("deprecated");
  }

  if (input.settings.examples) {
    if (output.settings.examples && input.schema.examples !== undefined) {
      output.schema.examples = input.schema.examples;
    }

    handledKeys.add("examples");
  }

  if (input.settings.$vocabulary) {
    if (output.settings.$vocabulary && input.schema.$vocabulary !== undefined) {
      output.schema.$vocabulary = input.schema.$vocabulary;
    }

    handledKeys.add("$vocabulary");
  }

  if (input.settings.readOnly) {
    if (output.settings.readOnly && input.schema.readOnly !== undefined) {
      output.schema.readOnly = input.schema.readOnly;
    }

    handledKeys.add("readOnly");
  }

  if (input.settings.writeOnly) {
    if (output.settings.writeOnly && input.schema.writeOnly !== undefined) {
      output.schema.writeOnly = input.schema.writeOnly;
    }

    handledKeys.add("writeOnly");
  }
};

const translate$schemaKeyword: Mutator = ({
  from: input,
  into: output,
  handledKeys,
}) => {
  if (input.settings.$schema !== undefined) {
    if (
      output.settings.$schema !== undefined &&
      input.schema.$schema === input.settings.$schema
    ) {
      output.schema.$schema = output.settings.$schema;
    }

    handledKeys.add("$schema");
  }
};
