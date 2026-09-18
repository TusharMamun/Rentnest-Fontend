import { getMe } from '@/lib/api';
import DashboardLayoutClient from '@/Ui/Shaird_Ui/DashboardLayoutClient';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getMe();

  return (
    <DashboardLayoutClient user={userData}>
      {children}
    </DashboardLayoutClient>
  );
}