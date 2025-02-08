import * as R from 'ramda'
import { ReferenceStorage } from './types/reference-storage'
import * as ObjectPath from 'object-path'


export abstract class Reference {
  static from($ref: string | string[]): Reference {
    if (typeof $ref === 'string') {
      if ($ref.startsWith('#')) return new RelativeReference($ref.split('/').slice(1))
      return new AbsoluteReference($ref)
    }

    return new RelativeReference($ref)
  }

  abstract toString(): string
  abstract set<T>(storage: ReferenceStorage<T>, value: T): void
  abstract get<T>(storage: ReferenceStorage<T>): T | undefined
  abstract equals(ref: Reference): boolean
}

export class RelativeReference extends Reference {
  constructor(private paths: string[]) {
    super()
  }

  async resolve<T>(object: object): Promise<T | undefined> {
    return R.pathOr(undefined, this.paths, object)
  }

  toString(): string {
    return `#/${this.paths.join('/')}`
  }

  set<T>(storage: ReferenceStorage<T>, value: T): void {
    ObjectPath.set(storage, this.paths, value)
  }

  get<T>(storage: ReferenceStorage<T>): T | undefined {
    return R.path(this.paths, storage)
  }

  equals(ref: Reference): boolean {
    if (!(ref instanceof RelativeReference)) return false
    return R.equals(this.paths, ref.paths)
  }
}

export class AbsoluteReference extends Reference {
  constructor(private address: string) {
    super()
  }

  async resolve<T>(): Promise<T | undefined> {
    throw new Error('Not implemented')
  }

  toString(): string {
    return this.address
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  set<T>(storage: ReferenceStorage<T>, value: T): void {
    throw new Error('AbsoluteReference is not supported')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get<T>(storage: ReferenceStorage<T>): T | undefined {
    throw new Error('AbsoluteReference is not supported')
  }

  equals(ref: Reference): boolean {
    if (!(ref instanceof AbsoluteReference)) return false
    return this.address === ref.address
  }
}
