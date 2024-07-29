import { WsAdapter } from '@nestjs/platform-ws'
import { MessageMappingProperties } from '@nestjs/websockets/gateway-metadata-explorer'
import { EMPTY, map, Observable } from 'rxjs'
import * as R from 'ramda'


export class OpendocWsAdapter extends WsAdapter {
  bindMessageHandler(
    buffer: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): Observable<any> {
    try {
      const message = JSON.parse(buffer.data)
      const messageHandler = handlers.find(
        (handler) => handler.message === message.event,
      )

      if (!messageHandler) {
        throw new Error('No handler for such event')
      }

      const { callback } = messageHandler
      // const result = callback(message, message.event)
      return transform(callback(message.data, message.event))
        .pipe(
          map((data) => ({
            ...R.omit(['data'], message),
            data,
          }))
        )
    } catch {
      return EMPTY
    }
  }
}
