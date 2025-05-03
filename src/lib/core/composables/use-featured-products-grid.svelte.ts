import { onMount } from "svelte"

export class FeaturedProductsGrid {
  loadMoreTrigger: HTMLDivElement | null = $state(null)

  constructor({ loadMore, hasMore, loading }: { loadMore: Function, hasMore: boolean, loading: boolean }) {

    onMount(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0]
          if (first.isIntersecting && hasMore && !loading) {
            loadMore()
          }
        },
        { threshold: 0.1 }
      )

      if (this.loadMoreTrigger) {
        observer.observe(this.loadMoreTrigger)
      }

      return () => {
        if (this.loadMoreTrigger) {
          observer.unobserve(this.loadMoreTrigger)
        }
      }
    })
  }
}
