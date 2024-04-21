import { Readable } from "stream"

export interface StandardStorageService {
  writeFile(filepath: string, content: Buffer): Promise<void>
  readFile(filepath: string): Promise<Buffer>
  createStream(filepath: string): Promise<Readable>
  removeFile(filepath: string): Promise<void>
}
