import {useCheckoutStore} from '../store/checkoutStore'

function NotesSection() {
    const notesText = useCheckoutStore((s) => s.notesText)
    const setNotesText = useCheckoutStore((s) => s.setNotesText)

    return (
        <div dir="rtl" className="mt-4">
            <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="اكتب ملاحظاتك هنا..."
                className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[70px]"
            />
        </div>
    )
}

export default NotesSection