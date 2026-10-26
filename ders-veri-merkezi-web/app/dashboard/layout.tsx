import OturumKorumasi from '@/components/OturumKorumasi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <OturumKorumasi rol="ACADEMICIAN">{children}</OturumKorumasi>;
}