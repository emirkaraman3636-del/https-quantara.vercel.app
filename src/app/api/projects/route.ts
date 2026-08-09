import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkTenantAccess } from '../../../lib/auth-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json({ error: 'workspaceId is required' }, { status: 400 });
    }

    const authCheck = await checkTenantAccess({ workspaceId });
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { datasets: true } } }
    });

    return NextResponse.json({ projects });
  } catch (error: unknown) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, workspaceId } = body;

    const authCheck = await checkTenantAccess({ workspaceId });
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId
      }
    });

    return NextResponse.json({ project });
  } catch (error: unknown) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) || 'Failed to create project' }, { status: 500 });
  }
}
