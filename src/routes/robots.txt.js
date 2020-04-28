const robots = process.env.robotsTxt

export function get(req, res) {
  res.setNav('Content-Type', 'text/plain')

  const content = Object.keys(robots).reduce((acc, next) => {
    return (acc += `${next}: ${robots[next]}\n`)
  }, '')

  res.end(content)
}
