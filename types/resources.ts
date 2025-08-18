export interface ResourceMeta {
  date: string
  author: string
  pages?: number
  duration?: string
  external?: boolean
}

export interface Resource {
  id: number
  title: string
  description: string
  type: 'pdf' | 'doc' | 'xls' | 'video' | 'external' | 'other'
  url: string
  tags?: string[]
  meta: ResourceMeta
}

export interface ResourceCategory {
  id: number
  slug: string
  title: string
  description: string
  icon: string
  color: string
  count: number
}
