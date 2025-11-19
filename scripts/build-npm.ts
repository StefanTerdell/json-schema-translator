import { build, emptyDir } from "@deno/dnt";

const denoPackage = readDenoJson();

await emptyDir("./npm");

await build({
  entryPoints: ["./src/lib.ts"],
  outDir: "./npm",
  shims: {},
  test: false,
  package: {
    ...denoPackage,
    name: stripOrganisation(denoPackage.name),
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    const original = readText("README.md");
    const changed = stripOrganisation(original);
    writeText("npm/README.md", changed);
  },
});

function readText(path: string): string {
  const content = Deno.readFileSync(path);
  const decoder = new TextDecoder();
  return decoder.decode(content);
}

function writeText(path: string, text: string) {
  const encoder = new TextEncoder();
  const content = encoder.encode(text);
  Deno.writeFileSync(path, content);
}

function stripOrganisation(string: string): string {
  return string.replaceAll("@stefan/", "");
}

function readDenoJson() {
  const text = readText("deno.json");
  const data: unknown = JSON.parse(text);

  if (typeof data !== "object" || data === null) {
    throw new Error(
      `Expected data to be an object and not null, got ${text}`,
    );
  }

  if (!("name" in data) || typeof data.name !== "string") {
    throw new Error(`Expected string 'name' in data, got ${text}`);
  }

  if (!("version" in data) || typeof data.version !== "string") {
    throw new Error(`Expected string 'version' in data, got ${text}`);
  }

  if (!("description" in data) || typeof data.description !== "string") {
    throw new Error(`Expected string 'description' in data, got ${text}`);
  }

  if (!("license" in data) || typeof data.license !== "string") {
    throw new Error(`Expected string 'license' in data, got ${text}`);
  }

  if (
    !("repository" in data) ||
    typeof data.repository !== "object" || data.repository === null
  ) {
    throw new Error(`Expected object 'repositiory' in data, got ${text}`);
  }

  if (!("type" in data.repository) || data.repository.type !== "git") {
    throw new Error(`Expected 'git' in 'data.repository.type', got ${text}`);
  }

  if (!("url" in data.repository) || typeof data.repository.url !== "string") {
    throw new Error(`Expected string 'url' in 'data.repository', got ${text}`);
  }

  if (!data.name.startsWith("@") || data.name.indexOf("/") === -1) {
    throw new Error(
      `Expected 'name' to start with '@' and contain '/', got "${data.name}"`,
    );
  }

  if (!data.version) {
    throw new Error(`Expected 'version' to not be empty`);
  }

  if (!data.description) {
    throw new Error(`Expected 'description' to not be empty`);
  }

  if (!data.license) {
    throw new Error(`Expected 'license' to not be empty`);
  }

  return {
    name: data.name,
    version: data.version,
    description: data.description,
    license: data.license,
    repository: data.repository,
  };
}
