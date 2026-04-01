import { useRef, useEffect } from "react"
// import { useDebounceCallback, useOnClickOutside } from "usehooks-ts"
import { useNoteUiStateStore } from "../../features/interactions/stores/useNoteUiStateStore"

type NoteHeaderProps = {
    noteId: string
}

// const MAX_HEIGHT = 200
// const MAX_LENGTH = 200

// const focusAtEnd = (element: HTMLTextAreaElement | null) => {
//     if (!element) return
//     element.focus()
//     const length = element.value.length
//     element.setSelectionRange(length, length)
// }

export default function NoteHeader({ noteId }: NoteHeaderProps) {
    const ref = useRef<HTMLDivElement>(null)
    // const textareaRef = useRef<HTMLTextAreaElement>(null)
    // const [localEditing, setLocalEditing] = useState(false)

    const selectedNoteId = useNoteUiStateStore((store) => store.selectedNoteId)
    // const updateNote = useNotesStore((store) => store.updateNote)

    // const debouncedUpdate = useDebounceCallback((value: string) => {
    //     updateNote(noteId, { title: value })
    // }, 400)

    const isEditing = selectedNoteId === noteId

    // const autoResize = () => {
    //     const element = textareaRef.current
    //     if (!element) return

    //     element.style.height = "auto"
    //     const newHeight = Math.min(element.scrollHeight, MAX_HEIGHT)
    //     element.style.height = newHeight + "px"

    //     element.style.overflowY =
    //         element.scrollHeight > MAX_HEIGHT ? "auto" : "hidden"
    // }

    // useEffect(() => {
    //     if (isEditing) {
    //         autoResize()
    //         textareaRef.current?.focus()
    //     }
    // }, [isEditing])

    // const handleClickOutside = () => {
    //     if (isEditing) {
    //         setLocalEditing(false)
    //     }
    // }
    // useOnClickOutside(ref as RefObject<HTMLElement>, handleClickOutside)

    // const handleDoubleClick = () => {
    //     if (selectedNoteId !== noteId || isEditing) return
    //     setLocalEditing(true)
    // }

    // const handleChange = (value: string) => {
    //     const trimmedValue = value.slice(0, MAX_LENGTH)
    //     debouncedUpdate(trimmedValue)
    //     autoResize()
    // }

    useEffect(() => {
        if (!isEditing) return

        requestAnimationFrame(() => {
            // const textAreaElement = textareaRef.current
            // autoResize()
            // focusAtEnd(textAreaElement)
        })
    }, [isEditing])

    return (
        <div
            ref={ref}
            // data-no-pan={isEditing}
            data-no-pan={true}
            // className={`h-12 bg-black/5 ${
            //     isEditing
            //         ? "cursor-text"
            //         : "note-drag-handle cursor-move select-none"
            // }`}

            className={`h-12 bg-black/5 note-drag-handle cursor-move select-none"
            `}
        >
            {/* {isEditing ? (
                <textarea
                    ref={textareaRef}
                    autoFocus
                    defaultValue={title}
                    rows={1}
                    maxLength={MAX_LENGTH}
                    className="w-full text-xl resize-none outline-none wrap-break-word whitespace-pre-wrap leading-tight"
                    onInput={() => autoResize()}
                    onChange={(onChangeEvent) =>
                        handleChange(onChangeEvent.target.value)
                    }
                    onKeyDown={(keyEvent) => {
                        if (
                            keyEvent.key === "Escape" ||
                            keyEvent.key === "Enter"
                        ) {
                            keyEvent.preventDefault()
                            setLocalEditing(false)
                        }
                    }}
                />
            ) : (
                <div
                    onDoubleClick={handleDoubleClick}
                    className="wrap-break-word"
                    data-no-pan={true}
                >
                    {title}
                </div>
            )} */}
        </div>
    )
}
