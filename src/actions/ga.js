export const googleAnalytics = (gaID) => {
  window.dataLayer = window.dataLayer || []
  function gtag() {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())

  gtag('config', gaID)

  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaID}`
  document.body.appendChild(script)
}
