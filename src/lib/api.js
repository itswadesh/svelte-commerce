import { host, api_url } from './../config'
import Cookie from 'cookie-universal'
const cookies = Cookie()
let tkn = cookies.get('token')
async function send({ method, path, params, data, token, cookie }) {
  const fetch = process.browser ? window.fetch : require('node-fetch').default
  const opts = {
    method,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      Cache: 'no-cache',
      cookie: cookie,
    },
    // credentials: 'include', // Blocks cors requests. Need to enable proxy if uncommented
    mode: 'cors',
  }

  if (data) {
    // opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data)
  }

  let tkn = cookies.get('token')
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`
  } else if (tkn) {
    opts.headers['Authorization'] = `Bearer ${tkn}`
  }
  let url = new URL(`${api_url}/api/${path}`)
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    )
  }
  try {
    let response = await fetch(url, opts)
    let json = await response.text()
    if (!response.ok) {
      throw json
    }
    try {
      return JSON.parse(json)
    } catch (e) {
      return json
    }
  } catch (e) {
    throw e
  }
}

function get(path, params, token, cookie) {
  // let token = tkn || auth.token
  return send({ method: 'GET', path, params, token, cookie })
}

function del(path, token) {
  return send({ method: 'DELETE', path, token })
}

function post(path, data, token) {
  return send({ method: 'POST', path, data, token })
}

function put(path, data, token) {
  return send({ method: 'PUT', path, data, token })
}

export { get, del, post, put }
