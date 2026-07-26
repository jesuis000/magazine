import {create} from 'zustand'

export const useCheckoutStore = create((set) => ({
    notesText: '',
    voiceNoteUrl: null,

    phone: '',
    name: '',
    area: '',
    address: '',
    email: '',
    rememberMe: true,

    fulfillmentType: 'delivery', // 'delivery' | 'pickup'
    deliverySlot: null, // e.g. 'asap' | 'tomorrow_morning' | 'tomorrow_afternoon' | 'tomorrow_evening' | 'in_2_hours'

    paymentMethod: 'CASH', // 'CASH' | 'CARD' | 'WALLET'
    submitting: false,
    submitError: null,

    setNotesText: (text) => set({notesText: text}),
    setVoiceNoteUrl: (url) => set({voiceNoteUrl: url}),
    clearVoiceNote: () => set({voiceNoteUrl: null}),

    setCustomerField: (field, value) => set({[field]: value}),
    setCustomer: (customer) => set(customer),

    // add to actions
    setFulfillmentType: (type) => set({fulfillmentType: type}),
    setDeliverySlot: (slot) => set({deliverySlot: slot}),

    setPaymentMethod: (method) => set({paymentMethod: method}),
    setSubmitting: (v) => set({submitting: v}),
    setSubmitError: (err) => set({submitError: err}),

    reset: () => set({
        notesText: '', voiceNoteUrl: null,
        phone: '', name: '', area: '', address: '', email: '', rememberMe: true,
        fulfillmentType: 'delivery', deliverySlot: null
    }),
}))