import { getContext, onMount, setContext } from 'svelte'
import { collectionService, type Collection } from '$lib/core/services/index.js'

type RankedCollection = Collection & {
  rank?: number
}

class CollectionState {
  static instance: CollectionState | null = null

  loading = $state(false)
  count = $state(0)
  collections: Collection[] | null = $state(null)

  constructor() {
    onMount(() => {
      this.setState()
    })
  }

  setState = async () => {
    try {
      this.loading = true
      this.count = 0
      const res = await collectionService.list({})
      this.count = res?.data?.length
      this.collections = res?.data
    } catch (e: any) {
      console.error('While fetching collection', e)
    } finally {
      this.loading = false
    }
  }

  getOneById = (id: string) => {
    return this.collections?.find(x => x.id === id)
  }

  getOneByRank = (rank: number) => {
    return (this.collections as RankedCollection[] | null)?.find(x => x.rank === rank)
  }
}

const COLLECTION_KEY = Symbol('COLLECTION')

export function setCollectionState() {
  return setContext(COLLECTION_KEY, new CollectionState())
}

export function getCollectionState() {
  return getContext<ReturnType<typeof setCollectionState>>(COLLECTION_KEY)
}

