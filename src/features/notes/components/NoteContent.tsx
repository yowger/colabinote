type NoteContentProps = {
    content: string
}

export default function NoteContent({ content }: NoteContentProps) {
    return <div className="p-2 flex-1">{content}</div>
}
