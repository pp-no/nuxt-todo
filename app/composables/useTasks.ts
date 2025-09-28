import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  doc,
  serverTimestamp,
  getDoc,
  deleteDoc
} from 'firebase/firestore'
import type { Task } from '../types/task'

const COL = 'tasks'

export const useTasks = () => {
  const { $db } = useNuxtApp()

  // 初回チラつき防止のため loading 初期値は true
  const tasks = useState<Task[]>('tasks', () => [])
  const loading = useState<boolean>('tasksLoading', () => true)
  const error = useState<unknown>('tasksError', () => null)

  const mapSnap = (s: any): Task => {
    const data = s.data() as any
    return {
      id: s.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() ?? undefined,
      updatedAt: data?.updatedAt?.toDate?.() ?? undefined
    }
  }

  const sortByCreatedDesc = (list: Task[]) =>
    list.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0))

  const fetchAll = async () => {
    loading.value = true
    try {
      console.log('[useTasks] fetchAll start')
      const snap = await getDocs(query(collection($db, COL)))
      console.log('[useTasks] fetchAll size:', snap.size)
      const list = snap.docs.map(mapSnap)
      tasks.value = sortByCreatedDesc(list)
      error.value = null
    } catch (e) {
      console.error('[useTasks] fetchAll error:', e)
      error.value = e
    } finally {
      loading.value = false
      console.log('[useTasks] fetchAll done, loading =', loading.value)
    }
  }

  let unsub: null | (() => void) = null
  const watchAll = () => {
    unsub?.()
    loading.value = true
    console.log('[useTasks] watchAll start')
    const q = query(collection($db, COL))
    unsub = onSnapshot(
      q,
      (snap) => {
        console.log('[useTasks] snapshot size:', snap.size)
        const list = snap.docs.map(mapSnap)
        tasks.value = sortByCreatedDesc(list)
        error.value = null
        loading.value = false
      },
      (err) => {
        console.error('[useTasks] onSnapshot error:', err)
        error.value = err
        loading.value = false
      }
    )
  }

  const getById = async (id: string): Promise<Task | null> => {
    const ref = doc($db, COL, id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return mapSnap(snap)
  }

  const create = async (payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addDoc(collection($db, COL), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
  }

  const update = async (id: string, patch: Partial<Task>) => {
    await updateDoc(doc($db, COL, id), { ...patch, updatedAt: serverTimestamp() })
  }

  const remove = async (id: string) => {
    await deleteDoc(doc($db, COL, id))
  }

  onUnmounted(() => unsub?.())

  return { tasks, loading, error, fetchAll, watchAll, getById, create, update, remove }
}
