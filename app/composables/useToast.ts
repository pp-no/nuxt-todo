type ToastType = 'success' | 'error' | 'info'
type Toast = { id: number; message: string; type: ToastType; timeout?: number }

/** どこからでも呼べる軽量トースト */
export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const push = (message: string, type: ToastType = 'info', timeout = 2500) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type, timeout })
    if (timeout) setTimeout(() => dismiss(id), timeout)
    return id
  }

  const dismiss = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, push, dismiss }
}
