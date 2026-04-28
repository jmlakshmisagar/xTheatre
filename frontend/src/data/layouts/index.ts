// All available theatre layouts
export interface LayoutOption {
  id: string
  name: string
  file: string
  seats: number
}

export const AVAILABLE_LAYOUTS: LayoutOption[] = [
  {
    id: 'imax-standard-01',
    name: 'IMAX Standard',
    file: 'imax-standard.json',
    seats: 15
  },
  {
    id: 'imax-large-01',
    name: 'IMAX Large Format',
    file: 'imax-large.json',
    seats: 28
  },
  {
    id: 'pvr-standard-01',
    name: 'PVR Standard Cinema',
    file: 'pvr-standard.json',
    seats: 18
  },
  {
    id: 'recliner-premium-01',
    name: 'Recliner Premium',
    file: 'recliner-premium.json',
    seats: 20
  }
]

export const getLayoutPath = (layoutId: string): string => {
  const layout = AVAILABLE_LAYOUTS.find(l => l.id === layoutId)
  return layout ? `/src/data/layouts/${layout.file}` : '/src/data/layouts/imax-standard.json'
}

export const getLayoutById = (layoutId: string): LayoutOption | undefined => {
  return AVAILABLE_LAYOUTS.find(l => l.id === layoutId)
}
