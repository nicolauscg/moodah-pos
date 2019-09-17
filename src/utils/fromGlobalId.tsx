import { unbase64 } from './base64'

type ResolvedGlobalId = {
  type: string
  id: string
}

export default function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = unbase64(globalId)
  const delimiterPos = unbasedGlobalId.indexOf(':')
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  }
}
