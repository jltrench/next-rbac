import { api } from '@/http/api-client'

interface GetProjectDetailsResponse {
  project: {
    description: string
    slug: string
    id: string
    name: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
  }
}

export async function getProjectDetails(org: string, projectSlug: string) {
  const result = await api
    .get(`organizations/${org}/projects/${projectSlug}`)
    .json<GetProjectDetailsResponse>()

  return result
}
