import { api } from '@/http/api-client'

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = never

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<SignUpResponse>()

  return result
}
