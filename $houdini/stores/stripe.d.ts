import type { stripe$input, stripe$result } from '$houdini'
import type { MutationStore } from '../runtime/lib/types'

export declare const GQL_stripe: MutationStore<stripe$result | undefined, stripe$input>

export default GQL_stripe
  