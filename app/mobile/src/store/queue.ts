import { create } from 'zustand';

export interface QueuedUpload {
  id: string;
  uri: string;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
  createdAt: number;
}

interface QueueStore {
  queue: QueuedUpload[];
  addToQueue: (uri: string) => string;
  updateStatus: (id: string, status: QueuedUpload['status'], error?: string) => void;
  removeFromQueue: (id: string) => void;
  clearCompleted: () => void;
  getPendingCount: () => number;
}

export const useQueueStore = create<QueueStore>((set, get) => ({
  queue: [],
  
  addToQueue: (uri: string) => {
    const id = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUpload: QueuedUpload = {
      id,
      uri,
      status: 'pending',
      createdAt: Date.now(),
    };
    
    set((state) => ({
      queue: [...state.queue, newUpload],
    }));
    
    return id;
  },
  
  updateStatus: (id: string, status: QueuedUpload['status'], error?: string) => {
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, status, error } : item
      ),
    }));
  },
  
  removeFromQueue: (id: string) => {
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    }));
  },
  
  clearCompleted: () => {
    set((state) => ({
      queue: state.queue.filter((item) => item.status !== 'completed'),
    }));
  },
  
  getPendingCount: () => {
    const state = get();
    return state.queue.filter((item) => item.status === 'pending').length;
  },
}));
