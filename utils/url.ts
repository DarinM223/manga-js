import { Adapter } from './manga.ts'
import * as preloaded from './sites/preloaded.ts'

function hostnameFromURL(url: string): string {
  const elem = document.createElement('a')
  elem.href = url
  return elem.hostname
}

type AdapterMap = { readonly [hostname: string]: Adapter }

export const hostnameAdapterMap: AdapterMap = {
  'localhost': preloaded,
  '': preloaded,
} as const

export function adapterFromURL(url: string): Adapter {
  const hostname = hostnameFromURL(url)
  return adapterFromHostname(hostname)
}

export function adapterFromHostname(hostname: string): Adapter {
  return hostnameAdapterMap[hostname]
}

export function validHostname(url: string): boolean {
  const hostname = hostnameFromURL(url)
  return hostname in hostnameAdapterMap
}