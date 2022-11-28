// api.data.ts
// a file ending with data.(j|t)s will be evaluated in Node.js
import fs from 'fs'
import path from 'path'
import type { MultiSidebarConfig } from '@vue/theme/src/vitepress/config'
import { sidebar } from '../../.vitepress/config'

interface APIHeader {
  anchor: string
  text: string
}

export interface APIGroup {
  text: string
  anchor: string
  items: {
    text: string
    link: string
    headers: APIHeader[]
  }[]
}

// declare resolved data type
export declare const data: APIGroup[]

export default {
  // declare files that should trigger HMR
  watch: './*.md',
  // read from fs and generate the data
  load(): APIGroup[] {
    return (sidebar as MultiSidebarConfig)['/api/'].map((group) => ({
      text: group.text,
      anchor: slugify(group.text),
      items: group.items.map((item) => ({
        ...item,
        headers: parsePageHeaders(item.link)
      }))
    }))
  }
}

const headersCache = new Map<
  string,
  {
    headers: APIHeader[]
    timestamp: number
  }
>()

function parsePageHeaders(link: string) {
  const fullPath = path.join(__dirname, '../', link) + '.md'
  const timestamp = fs.statSync(fullPath).mtimeMs

  const cached = headersCache.get(fullPath)
  if (cached && timestamp === cached.timestamp) {
    return cached.headers
  }

  const src = fs.readFileSync(fullPath, 'utf-8')
  const h2s = src.match(/^## [^\n]+/gm)
  let headers: APIHeader[] = []
  if (h2s) {
    const anchorRE = /\{#([^}]+)\}/
    headers = h2s.map((h) => {
      const text = h
        .slice(2)
        .replace(/<sup class=.*/, '')
        .replace(/\\</g, '<')
        .replace(/`([^`]+)`/g, '$1')
        .replace(anchorRE, '') // hidden anchor tag
        .trim()
      const anchor = h.match(anchorRE)?.[1] ?? slugify(text)
      return { text, anchor }
    })
  }
  headersCache.set(fullPath, {
    timestamp,
    headers
  })
  return headers
}

// same as vitepress' slugify logic
function slugify(text: string): string {
  return (
    text
      // Replace special characters
      .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g, '-')
      // Remove continuous separators
      .replace(/\-{2,}/g, '-')
      // Remove prefixing and trailing separators
      .replace(/^\-+|\-+$/g, '')
      // ensure it doesn't start with a number (#121)
      .replace(/^(\d)/, '_$1')
      // lowercase
      .toLowerCase()
  )
}
