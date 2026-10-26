import OturumKorumasi from '@/components/OturumKorumasi';

export default function TemsilciLayout({ children }: { children: React.ReactNode }) {
  return <OturumKorumasi rol="REPRESENTATIVE">{children}</OturumKorumasi>;
}