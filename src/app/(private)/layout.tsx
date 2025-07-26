// FILE: src/app/(private)/layout.tsx
import ClientLayout from "@/components/layout/ClientLayout";
import { ProtectedPage } from "@/components/layout/ProtectedPage";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClientLayout>
            <ProtectedPage>
                {children}
            </ProtectedPage>
        </ClientLayout>
    );
}