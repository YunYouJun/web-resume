const UPSTREAM_ORIGIN = 'https://drive.yunle.fun'
const UPSTREAM_PREFIX = '/api/v1/web-resume'

const ROUTES = [
  { method: 'POST', pattern: /^\/session\/login$/ },
  { method: 'GET', pattern: /^\/session$/ },
  { method: 'DELETE', pattern: /^\/session$/ },
  { method: 'GET', pattern: /^\/session\/csrf$/ },
  { method: 'GET', pattern: /^\/documents$/ },
  { method: 'POST', pattern: /^\/documents\/save$/ },
  { method: 'GET', pattern: /^\/documents\/doc_[\w-]{16,60}$/ },
  { method: 'PATCH', pattern: /^\/documents\/doc_[\w-]{16,60}$/ },
  { method: 'DELETE', pattern: /^\/documents\/doc_[\w-]{16,60}$/ },
  { method: 'POST', pattern: /^\/documents\/doc_[\w-]{16,60}\/restore$/ },
  { method: 'POST', pattern: /^\/uploads\/resume_[\w-]{16,60}\/complete$/ },
]

export async function onRequest(context) {
  const incomingUrl = new URL(context.request.url)
  const path = incomingUrl.pathname.replace(/^\/api/, '') || '/'
  const isSessionRoute = path === '/session' || path.startsWith('/session/')
  const enabled = isSessionRoute
    ? (context.env.YLF_LOGIN_API_ENABLED ?? context.env.YLF_CLOUD_API_ENABLED) === 'true'
    : context.env.YLF_CLOUD_API_ENABLED === 'true'
  if (!enabled)
    return jsonError(404, isSessionRoute ? 'Account login is unavailable' : 'Cloud sync is unavailable')
  if (!ROUTES.some(route => route.method === context.request.method && route.pattern.test(path)))
    return jsonError(404, 'Cloud API route was not found')

  if (isMutation(context.request.method)) {
    const origin = context.request.headers.get('origin')
    if (origin !== incomingUrl.origin)
      return jsonError(403, 'Request origin is not allowed')
  }

  const upstreamUrl = new URL(`${UPSTREAM_PREFIX}${path}`, UPSTREAM_ORIGIN)
  upstreamUrl.search = incomingUrl.search
  const headers = new Headers()
  copyRequestHeader(context.request.headers, headers, 'accept')
  copyRequestHeader(context.request.headers, headers, 'content-type')
  copyRequestHeader(context.request.headers, headers, 'cookie')
  copyRequestHeader(context.request.headers, headers, 'origin')
  copyRequestHeader(context.request.headers, headers, 'user-agent')
  copyRequestHeader(context.request.headers, headers, 'x-csrf-token')
  const connectingIp = context.request.headers.get('cf-connecting-ip')
  if (connectingIp)
    headers.set('x-forwarded-for', connectingIp)

  try {
    const upstream = await fetch(upstreamUrl, {
      body: ['GET', 'HEAD'].includes(context.request.method) ? undefined : context.request.body,
      headers,
      method: context.request.method,
      redirect: 'manual',
    })
    const responseHeaders = new Headers({
      'cache-control': 'no-store',
      'content-security-policy': 'default-src \'none\'; frame-ancestors \'none\'',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
    })
    copyResponseHeader(upstream.headers, responseHeaders, 'content-type')
    copyResponseHeader(upstream.headers, responseHeaders, 'set-cookie')
    return new Response(upstream.body, {
      headers: responseHeaders,
      status: upstream.status,
      statusText: upstream.statusText,
    })
  }
  catch {
    return jsonError(503, 'Cloud sync service is unavailable')
  }
}

function copyRequestHeader(source, target, name) {
  const value = source.get(name)
  if (value)
    target.set(name, value)
}

function copyResponseHeader(source, target, name) {
  const value = source.get(name)
  if (value)
    target.set(name, value)
}

function isMutation(method) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method)
}

function jsonError(status, statusMessage) {
  return Response.json({ statusCode: status, statusMessage }, {
    headers: {
      'cache-control': 'no-store',
      'content-security-policy': 'default-src \'none\'; frame-ancestors \'none\'',
      'referrer-policy': 'no-referrer',
      'x-content-type-options': 'nosniff',
    },
    status,
  })
}
