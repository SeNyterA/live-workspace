const { hostname, protocol } = window.location

console.log({ hahahaha: window.location })

export const baseURL =
  import.meta.env.VITE_API || `${protocol}//${hostname}/api`
