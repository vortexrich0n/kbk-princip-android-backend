import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyToken, isAdmin } from '@/lib/auth';

const updateMembershipSchema = z.object({
  active: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
  plan: z.string().optional(),
  type: z.string().optional(),
  paidAt: z.string().datetime().optional(),
  paidAmount: z.number().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    // Verify JWT token
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Allow users to update their own account OR admins to update any account
    const isSelfUpdate = userId === payload.userId;
    const isAdminUpdate = isAdmin(payload);

    if (!isSelfUpdate && !isAdminUpdate) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own account' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const membershipData = updateMembershipSchema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { membership: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Convert string dates to Date objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData = { ...membershipData } as any;
    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt as string);
    }
    if (updateData.paidAt) {
      updateData.paidAt = new Date(updateData.paidAt as string);
    }

    // Update or create membership
    if (user.membership) {
      await prisma.membership.update({
        where: { userId },
        data: updateData,
      });
    } else {
      await prisma.membership.create({
        data: {
          userId,
          ...updateData,
        },
      });
    }

    // Get updated user with membership
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        qrData: true,
        createdAt: true,
        emailVerified: true,
        membership: true,
      },
    });

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Update user membership error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    // Verify JWT token
    const payload = verifyToken(request);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Allow users to delete their own account OR admins to delete any account
    const isSelfDelete = userId === payload.userId;
    const isAdminDelete = isAdmin(payload) && userId !== payload.userId;

    if (!isSelfDelete && !isAdminDelete) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own account' },
        { status: 403 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Log account deletion for audit
    console.log(`User ${payload.userId} is deleting account ${userId}`);

    // Delete user (cascading delete will handle membership and checkins)
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}