# OpenDoc

[openapi]: https://www.openapis.org/
[asyncapi]: https://www.asyncapi.com/

[OpenDOC](https://github.com/buka-lnc/app.opendoc) 是一款开源的接口文档平台。支持[OpenAPI][openapi]和[AsyncAPI][asyncapi]规范。接下来我将为你详细介绍 OpenDoc 的核心概念。

## 应用（Application）

Opendoc 的一个应用可以添加多个文档。
应用必须设置唯一的`code`标识，`code`标识在 SDK、应用/文档注册等功能中发挥重要作用。

> 应用`id`由于难以记忆，往往并不会使用。

## 文档（Document）

文档是对于应用的接口/功能的描述性文件。目前支持的格式有：

- OpenAPI（也成为 Swagger）：常被用做描述应用的 Http 接口
- AsyncAPI：常被用于描述应用使用其他中间件实现的接口，例如：Kafka、RabbitMQ 等。
- Markdown：描述应用程序的单个纯文本文件。

文档必须设定一个在应用下唯一的`code`。在 SDK 和文档注册等中也有很重要的作用。

文档并不推荐一次性添加，而是建议采用 Push 或 Pull 模式保持文档与应用的持续更新。

### Pull 模式

当我们将一个文档设定为 Pull 模式并配置**同步地址**后，
OpenDoc 会定期的请求**同步地址**获取最新的文档内容，
一旦文档内容与上一版本文档内容不一致，
OpenDoc 将会自动添加一个新版本的文档。

### Push 模式

Push 模式下，文档的更新来自于*外部程序*调用 OpenDoc 的接口。
当*外部程序*提供的文档数据与上一个版本不一致时，OpenDoc 会添加一个新版本的文档。

OpenDoc 官方提供了`@opendoc/register`包以便 NodeJS 接入 OpenDoc 的 Push 模式：

```typescript
import { registerToOpendoc } from '@opendoc/register'

async function main() {
  await registerToOpendoc({
    // OpenDoc 地址
    server: 'http://localhost:8080',

    // 应用配置，如果应用不存在会自动创建
    application: {
      code: 'my_application_code',
      title?: 'MyApplicationDisplayName'
    },

    // 文档配置
    apiDocuments: [
      {
        // 文档类型 目前支持三种 'asyncapi' | 'openapi' | 'markdown'
        type: 'openapi'
        title?: 'MyDocumentDisplayName'
        code: 'my_document_code',
        // 文档间的排序
        order: 1
        // 文档文件内容
        file: JSON.stringify({
          // Openapi/swagger
        })
      }
    ]
  })
}
```

## License

OpenDoc 遵照 [MIT licensed](https://github.com/buka-lnc/app.opendoc/blob/main/LICENSE).
