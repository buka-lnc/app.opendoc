# OpenDoc API

[openapi]: https://www.openapis.org/
[asyncapi]: https://www.asyncapi.com/

[OpenDOC](https://github.com/buka-lnc/app.opendoc) 是一款开源的接口文档平台。支持[OpenAPI][openapi]和[AsyncAPI][asyncapi]规范。

```typescript
interface Test {
  t1: string;
  t2: number;
  t3: {
    t4: any;
  }[];
  t5: "a" | "b" | "c";
}
```

## License

OpenDoc 遵照 [MIT licensed](https://github.com/buka-lnc/app.opendoc/blob/main/LICENSE).
