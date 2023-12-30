const { hostname, protocol } = window.location

export const baseURL =
  import.meta.env.VITE_API || `${protocol}//${hostname}/api`

export const socketUrl =
  import.meta.env.VITE_SOCKET || `${protocol}//${hostname}`
