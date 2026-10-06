import { clients } from '@/data/clients'
import { sampleClients } from '@/data/fixtures/clients.sample'
import { SAMPLES_ENABLED } from '@/lib/samples'

/*
 * Client logos. Real list if it has entries; otherwise neutral placeholders in development
 * only; otherwise [] — and an empty list means the clients section is not rendered.
 */
export const getClients = () => {
  if (clients.length) return clients
  if (SAMPLES_ENABLED) return sampleClients
  return []
}

export const hasClients = () => getClients().length > 0

export const isUsingSampleClients = () => getClients().some((client) => client.sample)
