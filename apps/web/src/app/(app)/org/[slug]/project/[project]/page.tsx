import { getProjectDetails } from '@/http/get-project-details'

interface ProjectPageProps {
  params: {
    slug: string
    project: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug: orgSlug, project: projectSlug } = params
  const { project } = await getProjectDetails(orgSlug, projectSlug)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Project: {project.name}</h1>
      <pre>{JSON.stringify(project, null, 2)}</pre>
    </div>
  )
}
