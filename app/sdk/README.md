# @opendoc/sdk

将 openapi@3/swagger@3/asyncapi@3 编译成 Typescript 代码。

## compile(compileOptions)

```typescript
import { compile, FileNamingStyle, Compiler } from "@opendoc/sdk";

const swagger = {
  openapi: "3.0.0",
  info: {
    title: "Untitled",
    version: "1.0.0",
  },
  paths: {
    // ...
  },
  components: {
    // ...
  },
};

compile({
  strict: false,
  outdir: "./api",
  fileNamingStyle: FileNamingStyle.snakeCase,
  moduleName: "test",
  compiler: Compiler.openapiCore,
  project: false,
  document: swagger,
});
```

### compileOptions

| option          | default                     | description                      |
| :-------------- | :-------------------------- | :------------------------------- |
| strict          | `false`                     | 是否清除 outdir 已存在的其他文件 |
| outdir          | `"./api"`                   | 输出编译结果的文件夹             |
| fileNamingStyle | `FileNamingStyle.snakeCase` | 文件名的明明风格                 |
| moduleName      | -                           | 模块名称                         |
| compiler        | -                           | 编译器，需要与文档的类型一致     |
| document        | -                           | 文档内容                         |
| project         | false                       | 是否将编译结果作为一个独立的项目 |

### FileNamingStyle

| enum                           | example       |
| :----------------------------- | :------------ |
| `FileNamingStyle.camelCase`    | `"twoWords"`  |
| `FileNamingStyle.capitalCase`  | `"Two Words"` |
| `FileNamingStyle.constantCase` | `"TWO_WORDS"` |
| `FileNamingStyle.dotCase`      | `"two.words"` |
| `FileNamingStyle.headerCase`   | `"Tow-Words"` |
| `FileNamingStyle.noCase`       | `"two words"` |
| `FileNamingStyle.paramCase`    | `"two-words"` |
| `FileNamingStyle.pascalCase`   | `"TwoWords"`  |
| `FileNamingStyle.pathCase`     | `"two/words"` |
| `FileNamingStyle.sentenceCase` | `"Two words"` |
| `FileNamingStyle.snakeCase`    | `"two_words"` |

### Compiler

| enum                    | description                                              |
| :---------------------- | :------------------------------------------------------- |
| `Compiler.openapiCore`  | openapi@3/swagger@3 编译器。输出通用的 Typescript 代码。 |
| `Compiler.openapiReact` | openapi@3/swagger@3 编译器。输出 React Hooks 代码        |
| `Compiler.asyncapiCore` | asyncapi@3 编译器。输出通用的 Typescript 代码。          |
