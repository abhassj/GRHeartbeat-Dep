import { site } from '@/data/site'

export const telHref = (phone = site.phones[0]) => `tel:${phone.tel}`

export const whatsappHref = (message) =>
  `https://wa.me/${site.whatsapp.number}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const mailtoHref = ({ subject, body } = {}) => {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString().replace(/\+/g, '%20')
  return `mailto:${site.email}${query ? `?${query}` : ''}`
}
