// FILE: src/app/(private)/companies/components/CompanySelector.tsx
"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Check } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { formatCNPJ } from "@/lib/formatCnpj";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Props = {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
};

export default function CompanySelector({
    isOpen,
    onClose,
    title = "Selecionar Empresa",
    description = "Escolha a empresa para continuar",
}: Props) {
    const { companies, selectedCompany, setSelectedCompany, isLoading, isCompanySelected } = useCompany();
    const { logout } = useAuth();
    const router = useRouter();

    const activeCompanies = companies.filter((c) => c.status === "active");

    const handleSelect = (c: any) => {
        setSelectedCompany(c);
        onClose?.();
    };

    const handleCancel = async () => {
        // Se não há empresa selecionada ainda (primeiro acesso), cancelar deve encerrar a sessão
        if (!isCompanySelected) {
            const ok = window.confirm(
                "Você está cancelando a escolha da empresa. Isso encerrará seu acesso. Deseja realmente sair?"
            );
            if (ok) {
                try {
                    await logout(); // seu logout já limpa cookies; o cookie da empresa também é cookie
                } finally {
                    router.push("/login");
                }
            }
            return;
        }

        // Já existe empresa (troca no meio da sessão): apenas fechar
        onClose?.();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-xl font-bold">{title}</DialogTitle>
                    <p className="text-center text-gray-600">{description}</p>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">Carregando empresas…</div>
                ) : (
                    <>
                        <div className="grid gap-2 py-1">
                            {activeCompanies.map((company) => {
                                const selected = selectedCompany && String(selectedCompany.id) === String(company.id);
                                return (
                                    <Card
                                        key={company.id}
                                        className={`cursor-pointer transition-all hover:shadow-md rounded-none p-2 ${selected ? " ring-2 ring-ring ring-offset-2 ring-offset-background" : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelect(company)}
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-none bg-gradient-to-br from-primary to-primary/60">
                                                        <Building className="h-6 w-6 text-secondary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold">{company.tradeName}</h3>
                                                        <p className="text-xs text-gray-600">{company.corporateName}</p>
                                                        <p className="text-xs text-gray-500">{formatCNPJ(company.cnpj)}</p>
                                                    </div>
                                                </div>
                                                {selected && (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
                                                        <Check className="h-5 w-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {activeCompanies.length === 0 && (
                            <div className="py-8 text-center">
                                <Building className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma empresa ativa encontrada</h3>
                                <p className="text-gray-600">Cadastre uma empresa para continuar.</p>
                            </div>
                        )}

                        <div className="flex justify-center pt-4">
                            <Button onClick={handleCancel} variant="outline" className="w-32 cursor-pointer">
                                Cancelar
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}