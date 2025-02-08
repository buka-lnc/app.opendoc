# @opendoc/sdk

Get the dependencies of reference in openapi.

## Usage

```typescript
import { OpenapiReferenceParser } from "@opendoc/openapi-reference-parser";

const parser = new OpenapiReferenceParser({
  openapi: "3.0.0",
  info: {
    title: "Untitled",
    version: "1.0.0",
  },
  paths: {
    "/users/{id}": {
      put: {
        parameters: [{ $ref: "#/components/parameters/id" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        responses: {
          200: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    parameters: {
      id: {
        name: "id",
        required: true,
        in: "path",
        schema: { type: "string" },
      },
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          friends: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
          address: {
            $ref: "#/components/schemas/Address",
          },
        },
      },
      Address: {
        type: "object",
        properties: {
          province: {
            type: "string",
          },
          street: {
            type: "string",
          },
        },
      },
    },
  },
});

const result = parser.parse();
```

The Result:

```json
{
  "paths": {
    "/users/{id}": {
      "put": {
        "dependencies": [
          "#/components/parameters/id",
          "#/components/schemas/User",
          "#/components/schemas/Address"
        ],
        "directDependencies": [
          "#/components/parameters/id",
          "#/components/schemas/User"
        ],
        "transitiveDependencies": ["#/components/schemas/Address"]
      }
    }
  },
  "components": {
    "parameters": {
      "id": {
        "dependencies": [],
        "directDependencies": [],
        "transitiveDependencies": []
      }
    },
    "schemas": {
      "User": {
        "dependencies": ["#/components/schemas/Address"],
        "directDependencies": ["#/components/schemas/Address"],
        "transitiveDependencies": []
      },
      "Address": {
        "dependencies": [],
        "directDependencies": [],
        "transitiveDependencies": []
      }
    }
  }
}
```
