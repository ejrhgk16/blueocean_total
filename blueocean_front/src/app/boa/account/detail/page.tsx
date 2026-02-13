import AccountDetailClient from './account-detail-client';
import { Suspense } from 'react';

// This export tells Next.js to always render this page dynamically
export const dynamic = 'force-dynamic';

// This is a Server Component shell that wraps the actual client component
export default function AccountDetailPage() {
  return (
    // Suspense is required by Next.js when a child component uses useSearchParams
    <Suspense fallback={<div>Loading...</div>}>
      <AccountDetailClient />
    </Suspense>
  );
} 
