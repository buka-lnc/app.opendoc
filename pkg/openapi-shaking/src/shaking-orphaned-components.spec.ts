import * as R from 'ramda'
import { expect, test } from '@jest/globals'
import { openapiShakingOrphanedComponents } from './shaking-orphaned-components'
import { OpenAPIV3 } from 'openapi-types'

test('openapiShakingOrphanedComponents', () => {
  const swagger: OpenAPIV3.Document = {
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

        // This component is orphaned
        Orphaned: {
          type: 'string',
        },
      },
    },

  }
  const snapshot = R.clone(swagger)
  const result = openapiShakingOrphanedComponents(swagger)

  // swagger should not be mutated
  expect(swagger).toEqual(snapshot)

  expect(result).toEqual({
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
  })
})
