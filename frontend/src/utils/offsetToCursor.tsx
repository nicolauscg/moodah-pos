import { base64 } from './base64'

export default function offsetToCursor(offset: number): string {
  return base64('arrayconnection:' + offset)
}
