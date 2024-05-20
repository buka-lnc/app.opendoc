# @opendoc/nestjs

## Install

```bash
npm install @opendoc/register
```

## Usage

```typescript
import { register } from "@opendoc/register";

// 准备好Swagger数据
const doc = {
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

// 注册至Opendoc服务
register({
  server: "http://your_opendoc_host",

  application: {
    code: "your_application_code",
    title: "Your Application Title",
  },

  apiDocuments: [
    {
      type: "openapi",
      title: "Http",
      code: "http",
      order: 1,
      file: JSON.stringify(doc),
    },
  ],
});
```
