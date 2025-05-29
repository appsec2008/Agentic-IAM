import { redirect } from 'next/navigation';

// This page is now effectively /dashboard due to folder structure and the root page redirect.
// If you want a separate component for dashboard, you'd create src/app/(app)/dashboard/page.tsx
// For now, this acts as the dashboard.
export default function DashboardPage() {
  redirect('/dashboard');
  return null; // Or loading state
}
