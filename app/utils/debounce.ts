// Simple reusable debounce helper
// Usage: const fn = debounce(() => { ... }, 300)
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
