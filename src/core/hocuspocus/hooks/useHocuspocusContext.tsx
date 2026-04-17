import { useContext } from "react"
import { HocuspocusContext as HocuspocusContextWrapper } from "../contexts/hocuspocusContext"

export const useHocuspocusContext = () => useContext(HocuspocusContextWrapper)
