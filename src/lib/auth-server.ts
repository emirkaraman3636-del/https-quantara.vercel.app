import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export async function checkTenantAccess(params: { projectId?: string; orgId?: string; workspaceId?: string }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, error: 'Unauthorized', status: 401 };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, orgId: true, role: true }
  });

  if (!dbUser) {
    return { authorized: false, error: 'User not found in database', status: 401 };
  }

  // Cross-tenant IDOR check
  if (params.orgId && params.orgId !== dbUser.orgId) {
    return { authorized: false, error: 'Forbidden: Organization access denied', status: 403 };
  }

  if (params.workspaceId) {
    const workspace = await prisma.workspace.findUnique({ where: { id: params.workspaceId }});
    if (!workspace) return { authorized: false, error: 'Workspace not found', status: 404 };
    if (workspace.orgId !== dbUser.orgId) return { authorized: false, error: 'Forbidden: Workspace access denied', status: 403 };
  }

  if (params.projectId) {
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
      include: { workspace: true }
    });

    if (!project) {
      return { authorized: false, error: 'Project not found', status: 404 };
    }

    if (project.workspace.orgId !== dbUser.orgId) {
      return { authorized: false, error: 'Forbidden: Project access denied', status: 403 };
    }
  }

  return { authorized: true, user: dbUser, status: 200, supabase };
}
