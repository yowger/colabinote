import { create } from "zustand"

type RoomStore = {
    roomId: string | null
    setRoomId: (id: string) => void
}

export const useRoomStore = create<RoomStore>((set) => ({
    roomId: null,
    setRoomId: (id) => set({ roomId: id }),
}))
