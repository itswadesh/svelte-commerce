import { goto } from '$app/navigation'
import { page } from '$app/state'
import Fuse from 'fuse.js'
import { formatPrice } from '../utils'

const searchParamAsNumber = (name: string) => {
  const param = page.url.searchParams.get(name)
  if (param) return Number(param)
  return false
}

class DesktopFilterState {
  static _instance: DesktopFilterState

  // Variables from outside code
  showFilter = $state(false)
  selectedSort = $state()
  menuItemsBase: { id: string; label: string }[] = []
  selectedSection = $state<string>('')
  searchQuery = $state('')
  selectedDiscount = $state('any')
  discountOptions = [
    { label: 'Any', value: 'any' },
    { label: '10% and above', value: '10' },
    { label: '20% and above', value: '20' },
    { label: '30% and above', value: '30' },
    { label: '40% and above', value: '40' },
    { label: '50% and above', value: '50' },
    { label: '60% and above', value: '60' }
  ]
  showSortByDrawer = $state(false)

  selectedGeneralFilters: Record<string, string[]> = $state({})
  categories: Record<string, string>[] = $derived(page?.data?.products?.facets?.categories)
  priceStat: { min: number; max: number; default?: boolean } = $derived(page?.data?.products?.facets?.priceStat)
  tags: Record<string, string>[] = $derived(page?.data?.products?.facets?.tags)
  allFilters: Record<string, any> = $derived(page?.data?.products?.facets?.allFilters)

  showCategorySearch = $state(false)
  showTagSearch = $state(false)
  categoryFuse = $derived(new Fuse(this.categories, {
    keys: ['name']
  }))
  tagsFuse = $derived(new Fuse(this.tags, {
    keys: ['name']
  }))
  categorySearchQuery = $state('')
  tagSearchQuery = $state('')

  filteredCategories = $derived.by(() => {
    if (this.categoryFuse && this.categorySearchQuery) {
      return this.categoryFuse.search(this.categorySearchQuery).map((result) => result.item)
    } else {
      return this.categories
    }
  })
  filteredTags = $derived.by(() => {
    if (this.tagsFuse && this.tagSearchQuery) {
      return this.tagsFuse.search(this.tagSearchQuery).map((result) => result.item)
    } else {
      return this.tags
    }
  })

  selectedTags: Record<string, string>[] = $state([])

  minPrice = $state(searchParamAsNumber('priceFrom') || page?.data?.products?.facets?.priceStat?.min)
  maxPrice = $state(searchParamAsNumber('priceTo') || page?.data?.products?.facets?.priceStat?.max)
  minPossiblePrice = $derived(page?.data?.products?.facets?.priceStat?.min)
  maxPossiblePrice = $derived(page.data?.products?.facets?.priceStat?.max)
  priceSliderLeftPercentage = $derived(((this.minPrice - this.minPossiblePrice) / (this.maxPossiblePrice - this.minPossiblePrice)) * 100)
  priceSliderRightPercentage = $derived(100 - ((this.maxPrice - this.minPossiblePrice) / (this.maxPossiblePrice - this.minPossiblePrice)) * 100)
  priceRange = $derived.by(() => {
    if (this.minPrice >= 0 && this.maxPrice >= 0) {
      return `${formatPrice(this.minPrice, page.data?.store?.currency?.code)} - ${formatPrice(this.maxPrice, page.data?.store?.currency?.code)}`
    }
    return ''
  })

  container: Element | undefined = $state()
  containerTop = $derived(this.container?.getBoundingClientRect?.()?.top)

  showMoreCategories = $state(false)
  showMoreTags = $state(false)
  showMoreGeneralFilters: boolean[] = $state([])

  ignoreFilters = [
    'groupedSku',
    'categories.category.name',
    'categories.category.slug',
    'price',
    'tags.name',
    'status',
    'styleCode',
    'manageInventory',
    'storeId',
    'stock'
  ]

  processedFilters = $derived.by(() => {
    if (this.allFilters) {
      const keys = Object.keys(this.allFilters)?.filter((f: string) => !this.ignoreFilters?.includes(f))
      const filtersMap: Record<string, string[]> = {}
      for (const k of keys) {
        if (this.allFilters[k] && Object.keys(this.allFilters[k]).length > 0) {
          filtersMap[k] = Object.keys(this.allFilters[k])
        }
      }
      return filtersMap
    }
  })

  // Computed properties
  menuItems = $derived.by(() => {
    let base = this.menuItemsBase
    if (!this.tags.length) {
      base = base.filter((item) => item.id !== 'tags')
    }

    if (this.processedFilters && Object.keys(this.processedFilters).length > 0) {
      return [...base, ...Object.keys(this.processedFilters).map((key, idx) => ({ id: key, label: key }))]
    }
    return base
  })

  appliedFiltersCountByKey = $derived.by(() => {
    const appliedFiltersCountByKey: Record<string, number> = {}

    if (this.selectedTags.length > 0) {
      appliedFiltersCountByKey.tags = this.selectedTags.length
    }

    if (this.selectedGeneralFilters) {
      for (const key in this.selectedGeneralFilters) {
        if (key !== 'sort' && this.selectedGeneralFilters[key]?.length) {
          appliedFiltersCountByKey[key] = this.selectedGeneralFilters[key].length
        }
      }
    }

    return appliedFiltersCountByKey
  })

  handleApply = () => {
    const url = new URL(page.url)
    if (this.searchQuery) {
      url.searchParams.set('search', this.searchQuery)
    } else {
      url.searchParams.delete('search')
    }

    if (this.selectedTags.length > 0) {
      url.searchParams.delete('tags')
      url.searchParams.set('tags', this.selectedTags.map((tag: Record<string, string>) => tag.slug || tag.name).join(','))
    } else {
      url.searchParams.delete('tags')
    }

    if (this.maxPrice >= 0 && this.maxPrice !== this.priceStat.max) {
      url.searchParams.set('priceTo', this.maxPrice.toString())
    } else {
      url.searchParams.delete('priceTo')
    }

    if (this.minPrice >= 0 && this.minPrice !== this.priceStat.min) {
      url.searchParams.set('priceFrom', this.minPrice.toString())
    } else {
      url.searchParams.delete('priceFrom')
    }

    if (this.selectedGeneralFilters) {
      for (const key in this.selectedGeneralFilters) {
        if (this.selectedGeneralFilters[key]?.length) {
          url.searchParams.delete(key)
          url.searchParams.set(key, encodeURIComponent(this.selectedGeneralFilters[key].join(',')))
        } else {
          url.searchParams.delete(key)
        }
      }
    }

    goto(url, { replaceState: true })
    this.showFilter = false
  }

  handleGeneralFiltersChange = ({ key, value, checked }: { key: string; value: string; checked: boolean }) => {
    let processedKey = key
    if (key.startsWith('attributes.')) {
      processedKey = `attributes.${key.split('.')[1]}`
    } else if (key.startsWith('option.')) {
      processedKey = `option.${key.split('.')[1]}`
    }

    if (checked) {
      this.selectedGeneralFilters = {
        ...this.selectedGeneralFilters,
        [processedKey]: [...(this.selectedGeneralFilters[processedKey] || []), value]
      }
    } else {
      this.selectedGeneralFilters = {
        ...this.selectedGeneralFilters,
        [processedKey]: (this.selectedGeneralFilters[processedKey] || []).filter((v) => v !== value)
      }
    }

    const url = new URL(page.url)

    if (this.selectedGeneralFilters) {
      for (const key in this.selectedGeneralFilters) {
        if (this.selectedGeneralFilters[key]?.length) {
          url.searchParams.delete(key)
          url.searchParams.set(key, encodeURIComponent(this.selectedGeneralFilters[key].join(',')))
        } else {
          url.searchParams.delete(key)
        }
      }
    }

    if (this.selectedGeneralFilters[key]?.length === 0) {
      delete this.selectedGeneralFilters[key]
    }

    goto(url, { replaceState: true })
  }

  handleTagChange = async (detail: { tag: Record<string, string>; checked: boolean }) => {
    if (detail.checked) {
      this.selectedTags = [...this.selectedTags, detail.tag]
    } else {
      this.selectedTags = this.selectedTags.filter((tag: Record<string, string>) => tag.name !== detail.tag.name || tag.slug !== detail.tag.slug)
    }

    const url = new URL(page.url)
    if (this.selectedTags.length > 0) {
      url.searchParams.delete('tags')
      url.searchParams.set('tags', this.selectedTags.map((tag: Record<string, string>) => tag.slug || tag.name).join(','))

      await goto(url, { replaceState: true })
    } else {
      url.searchParams.delete('tags')
      await goto(url, { replaceState: true })
    }
  }

  handleCategoryClick = (category: Record<string, string>) => {
    this.showFilter = false
    goto(`/${category?.slug || encodeURIComponent(category?.name)}`)
  }

  handleCategorySearchKeyDown = (e: KeyboardEvent) => {
    this.showMoreCategories = false
    if (e.key == 'Enter') this.handleCategoryClick(this.filteredCategories[0])
    else if (e.key == 'Escape') {
      this.showCategorySearch = false
      this.categorySearchQuery = ''
    }
  }

  toggleCategorySearch = () => {
    this.showCategorySearch = !this.showCategorySearch
    if (!this.showCategorySearch) {
      this.categorySearchQuery = ''
    }
  }

  toggleTagSearch = () => {
    this.showTagSearch = !this.showTagSearch
    if (!this.showTagSearch) {
      this.tagSearchQuery = ''
    }
  }

  handleTagSearchKeyDown = (e: KeyboardEvent) => {
    this.showMoreTags = false
    if (e.key == 'Enter') {
      this.handleTagChange({
        tag: this.filteredTags[0],
        checked: this.selectedTags.find((t: any) => t.name === this.filteredTags[0].name) ? false : true
      })
    } else if (e.key == 'Escape') {
      this.showTagSearch = false
      this.tagSearchQuery = ''
    }
  }

  formatFilterOptionName = (key: string) => {
    return key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  formatFilterName = (key: string) => {
    let formattedKey = key
    if (key?.includes?.('.')) {
      const parts = key.split('.')
      formattedKey = parts[parts.length - 1]
    }

    // Capitalisation
    const regex = /[a-z][A-Z][a-z]/
    const index = formattedKey.search(regex)
    if (index < 1) return formattedKey

    return `${formattedKey.slice(0, index + 1)} ${formattedKey.slice(index + 1)}`
  }

  clearFilters = () => {
    const url = new URL(page.url?.href)
    url.searchParams.delete('tags')
    url.searchParams.delete('priceFrom')
    url.searchParams.delete('priceTo')

    for (const key of Object.keys(this.selectedGeneralFilters)) {
      url.searchParams.delete(key)
    }

    this.selectedTags = []
    this.selectedGeneralFilters = {}
    this.minPrice = this.priceStat?.min || 0
    this.maxPrice = this.priceStat?.max || 100000
    this.showFilter = false

    goto(url, { replaceState: true })
  }

  anyFilterApplied = $derived.by(() => {
    const url = new URL(page.url?.href)
    return (
      url.searchParams.has('tags') ||
      url.searchParams.has('priceFrom') ||
      url.searchParams.has('priceTo') ||
      Object.keys(this.selectedGeneralFilters).length > 0
    )
  })

  handleMinPriceChange = () => {
    if (this.maxPrice < this.minPrice)
      this.minPrice = $state.snapshot(this.maxPrice)
    const url = new URL(page.url?.href)
    url.searchParams.set('priceFrom', this.minPrice?.toString())
    goto(url, { replaceState: true })
  }

  handleMaxPriceChange = () => {
    if (this.maxPrice < this.minPrice)
      this.maxPrice = $state.snapshot(this.minPrice)
    const url = new URL(page.url?.href)
    url.searchParams.set('priceTo', this.maxPrice?.toString())
    goto(url, { replaceState: true })
  }

  toggleShowMoreCategories = () => {
    this.showMoreCategories = !this.showMoreCategories
  }

  toggleShowMoreTags = () => {
    this.showMoreTags = !this.showMoreTags
  }

  constructor({
    selectedSort = null,
    onSortChange = (value: string) => { },
    facets = {}
  }: {
    selectedSort?: any
    onSortChange?: (value: string) => void
    facets?: {
      categories?: Record<string, string>[]
      priceStat?: { min: number; max: number; default?: boolean }
      tags?: Record<string, string>[]
      allFilters?: any
    }
  } = {}) {
    // Setup menuItemsBase
    if (this.categories?.length) this.menuItemsBase.push({ id: 'category', label: 'Categories' })
    if (this.tags?.length) this.menuItemsBase.push({ id: 'tags', label: 'Tags' })
    this.menuItemsBase.push({ id: 'price', label: 'Price' })

    this.selectedSection = this.menuItemsBase.length > 0 ? this.menuItemsBase[0].id : ''

    /*
    $effect(() => {
      const url = new URL(page.url)
      const minPriceFromUrl = url.searchParams.get('priceFrom')
      const maxPriceFromUrl = url.searchParams.get('priceTo')

      this.minPrice = minPriceFromUrl ? Number(minPriceFromUrl) : this.priceStat.min
      this.maxPrice = maxPriceFromUrl ? Number(maxPriceFromUrl) : this.priceStat.max
      console.log("changed", this.minPrice, this.maxPrice)
      this.maxPossiblePrice = this.priceStat.max

      this.priceSet = true
    })
    */

    // priceRange is now defined as a $derived property at the class level

    /*
    $effect(() => {
      if (this.minPrice && this.maxPrice) {
        this.minPrice = Math.min(this.minPrice, this.maxPrice)
      }
    })

    $effect(() => {
      if (this.maxPrice && this.minPrice) {
        this.maxPrice = Math.max(this.minPrice, this.maxPrice)
      }
    })
    */

    const url = new URL(page.url)
    const searchParams = url.searchParams

    for (const [key, values] of searchParams.entries()) {
      if (key === 'tags') {
        this.selectedTags =
          decodeURIComponent(values || '')
            ?.split(',')
            ?.map((tag: string) => ({ name: tag })) || []
        continue
      }

      if (key === 'priceFrom' || key === 'priceTo') {
        continue
      }

      this.selectedGeneralFilters = {
        ...this.selectedGeneralFilters,
        [key]: decodeURIComponent(values || '')?.split(',')
      }
    }

    DesktopFilterState._instance = this
  }
}

export function getDesktopFilterState() {
  if (DesktopFilterState._instance)
    return DesktopFilterState._instance
  return new DesktopFilterState({})
}
