import { JsonObject } from "../index.ts";

Deno.test(() => {
  type Options = {
    foo: string;
    path: string;
    path2: string;
    json: boolean;
  };

  type Strict<O extends Options> = {
    foo?: O["foo"];
    children?: { [key: string]: Dyn<O> };
  };

  type Dyn<O extends Options> = {
    [Key in
      | keyof Strict<O>
      | O["path"]
      | O["path2"]]?: Key extends keyof Strict<O>
      ? Strict<O>[Key]
      : Key extends O["path"]
        ? 123
        : Key extends O["path2"]
          ? "2"
          : never;
  } & (O["json"] extends true ? JsonObject : unknown);

  const options = {
    foo: "bar" as const,
    path: "bax" as const,
    path2: "baz" as const,
    json: true,
  } satisfies Options;

  const strict: Strict<typeof options> = {
    foo: "bar",
    children: {},
  };

  const dyn: Dyn<typeof options> = {
    foo: "bar",
    bax: 123,
    json: "laksjdlaksjd",
    baz: "2",
    children: {
      son: {
        children: {},
        foo: "bar",
        bax: 123,
      },
    },
  };
});
