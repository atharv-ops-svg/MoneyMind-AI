export const isDesktopApp =
  typeof window !== 'undefined' &&
  Boolean(
    (window as Window & {
      electronAPI?: unknown
    }).electronAPI,
  )