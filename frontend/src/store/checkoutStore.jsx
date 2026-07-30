import {create} from 'zustand'

export const useCheckoutStore = create((set) => ({
    notesText: '',
    voiceNoteUrl: null,

    phone: '',
    name: '',
    area: '',
    address: '',
    rememberMe: true,

    fulfillmentType: 'delivery', // 'delivery' | 'pickup'
    deliverySlot: null, // e.g. 'asap' | 'tomorrow_morning' | 'tomorrow_afternoon' | 'tomorrow_evening' | 'in_2_hours'

    paymentMethod: 'CASH', // 'CASH' | 'CARD' | 'WALLET'
    submitting: false,
    submitError: null,

    orderSubmitted: false,
    lastOrderId: null,

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

    setOrderSubmitted: (orderId) => set({orderSubmitted: true, lastOrderId: orderId}),
    clearOrderSubmitted: () => set({orderSubmitted: false, lastOrderId: null}),

    // NOTE: reset() intentionally does NOT touch orderSubmitted/lastOrderId —
    // it's called right after a successful submit, and we need those to survive
    // until the user closes the success screen (clearOrderSubmitted does that).
    reset: () => set({
        notesText: '', voiceNoteUrl: null,
        phone: '', name: '', area: '', address: '', rememberMe: true,
        fulfillmentType: 'delivery', deliverySlot: null
    }),
}))