import PrettyError from 'pretty-error'

const prettyError = new PrettyError()


export function pe(err: any): string {
  return prettyError.render(err)
}
