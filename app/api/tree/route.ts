import { NextResponse } from 'next/server';
import { mockMembers } from '@/lib/mock-data';

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return NextResponse.json(mockMembers);
}
