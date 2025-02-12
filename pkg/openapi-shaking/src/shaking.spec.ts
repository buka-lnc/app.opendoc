import { expect, test } from '@jest/globals'
import { OpenAPIV3 } from 'openapi-types'
import { openapiShaking } from './shaking'

const origin: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Untitled',
    version: '1.0.0',
  },
  paths: {
    '/users/{id}/pets': {
      get: {
        parameters: [
          { $ref: '#/components/parameters/id' },
        ],
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Pet' },
                },
              },
            },
          },
        },
      },
    },
    '/users/{id}': {
      put: {
        parameters: [
          { $ref: '#/components/parameters/id' },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
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
        name: 'id',
        required: true,
        in: 'path',
        schema: { type: 'string' },
      },
    },

    schemas: {
      User: {
        type: 'object',
        properties: {
          friends: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
          address: {
            $ref: '#/components/schemas/Address',
          },
        },
      },
      Address: {
        type: 'object',
        properties: {
          province: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
        },
      },

      Pet: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
        },
      },

      // This component is orphaned
      Orphaned: {
        type: 'string',
      },
    },
  },

}

const target: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Untitled',
    version: '1.0.0',
  },
  paths: {
    '/users/{id}': {
      put: {
        parameters: [
          { $ref: '#/components/parameters/id' },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' },
            },
          },
        },
        responses: {
          200: {
            description: '',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User',
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
        name: 'id',
        required: true,
        in: 'path',
        schema: { type: 'string' },
      },
    },

    schemas: {
      User: {
        type: 'object',
        properties: {
          friends: {
            type: 'array',
            items: { $ref: '#/components/schemas/User' },
          },
          address: {
            $ref: '#/components/schemas/Address',
          },
        },
      },
      Address: {
        type: 'object',
        properties: {
          province: {
            type: 'string',
          },
          street: {
            type: 'string',
          },
        },
      },
    },
  },

}

test('openapiShaking', async () => {
  const reuslt = await openapiShaking(origin, (path, method) => path === '/users/{id}' && method === 'put')

  expect(reuslt).toEqual(target)
})
