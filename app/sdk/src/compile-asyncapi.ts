import { CompileAsyncapiOptions } from './interface/compile-asyncapi-options'


export async function compileAsyncapi(options: CompileAsyncapiOptions): Promise<void> {
  console.log('🚀 ~ compileAsyncapi ~ options:', options)
  // sleep 1s
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
