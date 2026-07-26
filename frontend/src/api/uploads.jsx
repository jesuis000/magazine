import { api } from './client'

export async function uploadVoiceNote(blob) {
    const formData = new FormData()
    formData.append('file', blob, 'voice-note.webm')

    const { data } = await api.post('/uploads/voice-notes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.url
}