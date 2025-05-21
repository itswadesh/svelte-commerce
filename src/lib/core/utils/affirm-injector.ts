export async function injectAffirm(publicApiKey?: string, isTest?: boolean) {
  if (!publicApiKey) throw 'Affirm Public API key is required'
  if (isTest === undefined) throw 'Affirm isTest is required'

  if (document.getElementById('affirm_pay_script')) {
    console.log('Skipping affirmjs, already injected')
    return
  }

  const affirmPayScript = document.createElement('script')
  affirmPayScript.id = 'affirm_pay_script'
  const affirmScriptText = document.createTextNode(`
  console.log("Injecting Affirm");

  const _affirm_config = {
		public_api_key: "${publicApiKey}", /* replace with public api key */
		script: "${isTest ? 'https://cdn1-sandbox.affirm.com/js/v2/affirm.js' : 'https://cdn1.affirm.com/js/v2/affirm.js'}",
		locale: "en_US",
		country_code: "USA",
	};

(function(m,g,n,d,a,e,h,c){var b=m[n]||{},k=document.createElement(e),p=document.getElementsByTagName(e)[0],l=function(a,b,c){return function(){a[b]._.push([c,arguments])}};b[d]=l(b,d,"set");var f=b[d];b[a]={};b[a]._=[];f._=[];b._=[];b[a][h]=l(b,a,h);b[c]=function(){b._.push([h,arguments])};a=0;for(c="set add save post open empty reset on off trigger ready setProduct".split(" ");a<c.length;a++)f[c[a]]=l(b,d,c[a]);a=0;for(c=["get","token","url","items"];a<c.length;a++)f[c[a]]=function(){};k.async=
  !0;k.src=g[e];p.parentNode.insertBefore(k,p);delete g[e];f(g);m[n]=b})(window,_affirm_config,"affirm","checkout","ui","script","ready","jsReady");
`)
  affirmPayScript.appendChild(affirmScriptText)
  document.head.appendChild(affirmPayScript)
}
