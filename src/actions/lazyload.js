export function lazyload(node) {
  let options = {
    root: null,
    rootMargin: '0px',
    threshold: 0,
  }
  let fetchImage = (url) => {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.src = url
      // image.class = "loading";
      image.setAttribute('lazy', 'loading')
      image.onload = resolve
      image.onerror = reject
    })
  }
  let loadImage = (image) => {
    let src = image.dataset.src
    fetchImage(src).then(() => {
      image.setAttribute('lazy', 'loaded')
      // image.class = "loaded";
      image.src = src
    })
  }
  let handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target)
      }
    })
  }

  let io = new IntersectionObserver(handleIntersection, options)

  io.observe(node)

  return {
    destroy() {
      io.unobserve(node)
    },
  }
}
