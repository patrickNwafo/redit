import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const adminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_STUDIO_TOKEN,
})  