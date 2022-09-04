/**
 * We use shorter names to reduce the final bundle size
 *
 * Properties:
 * @u = url
 * @t = title
 * @d = description
 * @q = quote
 * @h = hashtags
 * @m = media
 * @tu = twitterUser
 */
const baidu = 'http://cang.baidu.com/do/add?iu=@u&it=@t',
  buffer = 'https://bufferapp.com/add?text=@t&url=@u',
  email = 'mailto:?subject=@t&body=@u%0D%0A@d',
  evernote = 'https://www.evernote.com/clip.action?url=@u&title=@t',
  facebook =
    'https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h',
  twitter = 'https://twitter.com/share?url=@u&text=@t',
  flipboard =
    'https://share.flipboard.com/bookmarklet/popout?v=2&url=@u&title=@t',
  hackernews = 'https://news.ycombinator.com/submitlink?u=@u&t=@t',
  instapaper = 'http://www.instapaper.com/edit?url=@u&title=@t&description=@d',
  line = 'https://social-plugins.line.me/lineit/share?url=@u',
  // linkedin =    'https://www.linkedin.com/shareArticle?mini=true&url=@u&title=@t&summary=@d&source=Frontendfun',
  linkedin = 'https://www.linkedin.com/sharing/share-offsite/?url=@u',
  odnoklassniki =
    'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=@u&st.comments=@t',
  pinterest =
    'https://www.pinterest.com/pin/create/button/?url=@u&media=@m&description=@t',
  pocket = 'https://getpocket.com/save?url=@u&title=@t',
  quora = 'https://www.quora.com/share?url=@u&title=@t',
  reddit = 'https://www.reddit.com/submit?url=@u&title=@t',
  skype = 'https://web.skype.com/share?url=@t%0D%0A@u%0D%0A@d',
  sms = 'sms:?body=@t%0D%0A@u%0D%0A@d',
  stumbleupon = 'https://www.stumbleupon.com/submit?url=@u&title=@t',
  telegram = 'https://t.me/share/url?url=@u&text=@t%0D%0A@d',
  tumblr = 'https://www.tumblr.com/share/link?url=@u&name=@t&description=@d',
  viber = 'viber://forward?text=@t%0D%0A@u%0D%0A@d',
  vk =
    'https://vk.com/share.php?url=@u&title=@t&description=@d&image=@m&noparse=true',
  weibo = 'http://service.weibo.com/share/share.php?url=@u&title=@t&pic=@m',
  whatsapp = 'https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d',
  wordpress = 'https://wordpress.com/press-this.php?u=@u&t=@t&s=@d&i=@m',
  xing = 'https://www.xing.com/app/user?op=share&url=@u&title=@t'

  // let baidu = `http://cang.baidu.com/do/add?iu=${url}&it=${title}`,
  //   buffer = `https://bufferapp.com/add?text=${title}&url=${url}`,
  //   email = `mailto:?subject=${title}&body=${url}%0D%0A${description}`,
  //   evernote = `https://www.evernote.com/clip.action?url=${url}&title=${title}`,
  //   facebook = `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}&description=${description}&quote=${quote}&hashtag=${hashtags}`,
  //   flipboard = `https://share.flipboard.com/bookmarklet/popout?v=2&url=${url}&title=${title}`,
  //   hackernews = `https://news.ycombinator.com/submitlink?u=${url}&t=${title}`,
  //   instapaper = `http://www.instapaper.com/edit?url=${url}&title=${title}&description=${description}`,
  //   line = `http://line.me/R/msg/text/?${title}%0D%0A${url}%0D%0A${description}`,
  //   linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  //   odnoklassniki = `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}&st.comments=${title}`,
  //   pinterest = `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${title}`,
  //   pocket = `https://getpocket.com/save?url=${url}&title=${title}`,
  //   quora = `https://www.quora.com/share?url=${url}&title=${title}`,
  //   reddit = `https://www.reddit.com/submit?url=${url}&title=${title}`,
  //   skype = `https://web.skype.com/share?url=${title}%0D%0A${url}%0D%0A${description}`,
  //   lesms = `sms:?body=${title}%0D%0A${url}%0D%0A${description}`,
  //   stumbleupon = `https://www.stumbleupon.com/submit?url=${url}&title=${title}`,
  //   telegram = `https://t.me/share/url?url=${url}&text=${title}%0D%0A${description}`,
  //   tumblr = `https://www.tumblr.com/share/link?url=${url}&name=${title}&description=${description}`,
  //   twitter = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=${hashtags}${twitterUser}`,
  //   viber = `viber://forward?text=${title}%0D%0A${url}%0D%0A${description}`,
  //   levk = `https://vk.com/share.php?url=${url}&title=${title}&description=${description}&image=${media}&noparse=true`,
  //   weibo = `http://service.weibo.com/share/share.php?url=${url}&title=${title}&pic=${media}`,
  //   whatsapp = `https://api.whatsapp.com/send?text=${title}%0D%0A${url}%0D%0A${description}`,
  //   wordpress = `https://wordpress.com/press-this.php?u=${url}&t=${title}&s=${description}&i=${media}`,
  //   xing = `https://www.xing.com/app/user?op=share&url=${url}&title=${title}`

export default {
  baidu,
  buffer,
  email,
  sms,
  hackernews,
  facebook,
  twitter,
  whatsapp,
  line,
  quora,
  linkedin,
  pinterest,
  reddit,
  tumblr,
}
