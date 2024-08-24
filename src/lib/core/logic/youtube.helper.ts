const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/

export function getYoutubeId(url: string): string | false {
  const match = url.match(regex)
  return (match && match?.[7]?.length === 11) ? match[7]: false
}
