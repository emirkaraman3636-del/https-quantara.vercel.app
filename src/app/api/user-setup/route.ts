import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get user from DB
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { organization: { include: { workspaces: true } } }
    });

    // If user doesn't exist in DB, create default org, workspace, and user
    if (!dbUser) {
      const fullName = user.user_metadata?.full_name;
      const orgName = fullName ? `${fullName}'s Organization` : `${user.email?.split('@')[0]}'s Organization`;
      
      const newOrg = await prisma.organization.create({
        data: {
          name: orgName,
          workspaces: {
            create: {
              name: 'Default Workspace'
            }
          }
        },
        include: { workspaces: true }
      });

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: fullName || null,
          orgId: newOrg.id,
          role: 'ADMIN'
        },
        include: { organization: { include: { workspaces: true } } }
      });
    }

    return NextResponse.json({ user: dbUser });
  } catch (error: unknown) {
    console.error('Error fetching/creating user setup:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) || 'Failed to setup user' }, { status: 500 });
  }
}
