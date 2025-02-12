# @opendoc/openapi-shaking

This packages is used to **remove operation and orphaned components** of openapi document.

## Usage

I prepared an openapi document for demonstration:

```typescript
const doc = {
  openapi: "3.0.0",
  info: {
    title: "Untitled",
    version: "1.0.0",
  },
  paths: {
    "/users/{id}/pets": {
      get: {
        parameters: [{ $ref: "#/components/parameters/id" }],
        responses: {
          "200": {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Pet" },
                },
              },
            },
          },
        },
      },
    },
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
          "200": {
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

      Pet: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
        },
      },

      // This component is orphaned
      Orphaned: {
        type: "string",
      },
    },
  },
};
```

### `openapiShaking(openapiDocument, filter)`

The filter is a function that determines which operation to keep.
All filtered operation and unused components will be deleted

```typescript
import { openapiShaking } from "@opendoc/openapi-shaking";

const result = openapiShaking(doc, (path, method, operation) => {
  // Only "PUT /users/{id}" and its associated components will be retained
  return path === "/users/{id}" && method === "put";
});
```

The Result will be:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Untitled",
    "version": "1.0.0"
  },
  "paths": {
    "/users/{id}": {
      "put": {
        "parameters": [{ "$ref": "#/components/parameters/id" }],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/User" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/User"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "parameters": {
      "id": {
        "name": "id",
        "required": true,
        "in": "path",
        "schema": { "type": "string" }
      }
    },

    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "friends": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/User" }
          },
          "address": {
            "$ref": "#/components/schemas/Address"
          }
        }
      },
      "Address": {
        "type": "object",
        "properties": {
          "province": {
            "type": "string"
          },
          "street": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

### `openapiShakingOrphanedComponents(openapiDocument)`

Delete components that are not used by any operation.

```typescript
import { openapiShakingOrphanedComponents } from "@opendoc/openapi-shaking";

// `/#/components/schemas/Orphaned will be removed
const result = openapiShaking(doc);
```
