import ClientPage from '@/components/ClientPage';
import CabinetContent from '@/components/cabinet/CabinetContent';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function CabinetPage() {
  return (
    <ClientPage>
      <CabinetContent />
    </ClientPage>
  );
} 