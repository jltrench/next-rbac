import type { Role } from '@saas/auth'

import { api } from '@/http/api-client'

interface CreateInviteRequest {
  org: string
  email: string
  role: Role
}

type CreateInviteResponse = never

export async function createInvite({
  org,
  email,
  role,
}: CreateInviteRequest): Promise<CreateInviteResponse> {
  const result = await api
    .post(`organizations/${org}/invites`, {
      json: {
        email,
        role,
      },
    })
    .json<CreateInviteResponse>()

  return result
}
