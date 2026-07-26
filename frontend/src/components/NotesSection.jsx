import {useRef, useState} from 'react'
import {useCheckoutStore} from '../store/checkoutStore'
import {uploadVoiceNote} from '../api/uploads'

function NotesSection() {
    const [tab, setTab] = useState('text') // 'text' | 'voice'
    const [isRecording, setIsRecording] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploading, setUploading] = useState(false)

    const mediaRecorderRef = useRef(null)
    const chunksRef = useRef([])

    const notesText = useCheckoutStore((s) => s.notesText)
    const setNotesText = useCheckoutStore((s) => s.setNotesText)
    const voiceNoteUrl = useCheckoutStore((s) => s.voiceNoteUrl)
    const setVoiceNoteUrl = useCheckoutStore((s) => s.setVoiceNoteUrl)
    const clearVoiceNote = useCheckoutStore((s) => s.clearVoiceNote)

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true})
        const recorder = new MediaRecorder(stream)
        chunksRef.current = []

        recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {type: 'audio/webm'})
            setRecordedBlob(blob)
            setPreviewUrl(URL.createObjectURL(blob))
            stream.getTracks().forEach((t) => t.stop())
        }

        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop()
        setIsRecording(false)
    }

    const discardRecording = () => {
        setRecordedBlob(null)
        setPreviewUrl(null)
        clearVoiceNote()
    }

    const sendVoiceNote = async () => {
        if (!recordedBlob) return
        setUploading(true)
        try {
            const url = await uploadVoiceNote(recordedBlob)
            setVoiceNoteUrl(url)
        } catch (err) {
            console.error('Voice note upload failed', err)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div dir="rtl" className="mt-4">
            <div className="text-center text-sm font-bold mb-2">أصناف اضافيه وملاحظات</div>

            <div className="flex justify-center gap-6 text-xs mb-3">
                <button
                    onClick={() => setTab('text')}
                    className={tab === 'text' ? 'font-bold text-gray-900' : 'text-gray-400'}
                >
                    رسالة نصية
                </button>
                <button
                    onClick={() => setTab('voice')}
                    className={tab === 'voice' ? 'font-bold text-gray-900' : 'text-gray-400'}
                >
                    تسجيل صوتي
                </button>
            </div>

            {tab === 'text' && (
                <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="اكتب ملاحظاتك هنا..."
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-[70px]"
                />
            )}

            {tab === 'voice' && (
                <div>
                    {!previewUrl && !isRecording && (
                        <button
                            onClick={startRecording}
                            className="w-full h-11 rounded-lg border border-red-500 text-red-600 font-bold text-sm"
                        >
                            🎙 ابدأ التسجيل
                        </button>
                    )}

                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="w-full h-11 rounded-lg bg-red-600 text-white font-bold text-sm animate-pulse"
                        >
                            ⏹ إيقاف التسجيل
                        </button>
                    )}

                    {previewUrl && !voiceNoteUrl && (
                        <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 mt-2">
                            <button onClick={discardRecording} className="text-red-500">🗑</button>
                            <audio src={previewUrl} controls className="flex-1 h-8"/>
                            <button
                                onClick={sendVoiceNote}
                                disabled={uploading}
                                className="text-green-700 font-bold text-xs whitespace-nowrap"
                            >
                                {uploading ? 'جاري الإرسال...' : 'إرسال رسالة صوتية'}
                            </button>
                        </div>
                    )}

                    {voiceNoteUrl && (
                        <div
                            className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between mt-2">
                            <span className="text-green-700 text-xs font-bold">✓ تم إرسال الرسالة الصوتية</span>
                            <button onClick={discardRecording} className="text-red-500 text-xs">حذف</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotesSection