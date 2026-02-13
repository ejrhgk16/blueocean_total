import Role233DetailClient from './role233-detail-client';
import { Suspense } from 'react';

// This export tells Next.js to always render this page dynamically
export const dynamic = 'force-dynamic';

// This is a Server Component shell that wraps the actual client component
export default function Role233DetailPage() {
  return (
    // Suspense is required by Next.js when a child component uses useSearchParams
    <Suspense fallback={<div>Loading...</div>}>
      <Role233DetailClient />
    </Suspense>
  );
}