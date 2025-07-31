// FILE: src/app/(private)/companies/components/CompanyForm.tsx
"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Company, CompanyFormData } from "../types";
import { toast } from "sonner";
import { CreateCompanyInput } from "../hooks/useCompanyCreate";
import { UpdateCompanyInput } from "../hooks/useCompanyUpdate";

interface CompanyFormProps {
    company?: Company | null;
    onClose: () => void;
    onSave: (data: CreateCompanyInput | UpdateCompanyInput) => void;
}

export const CompanyForm = ({ company, onClose, onSave }: CompanyFormProps) => {
    const [formData, setFormData] = useState<CompanyFormData>({
        cnpj: company?.cnpj || "",
        corporateName: company?.corporateName || "",
        tradeName: company?.tradeName || "",
        status: company?.status || "active" as "active" | "inactive"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const rawCnpj = formData.cnpj.replace(/\D/g, "");
        const payload = { ...formData, cnpj: rawCnpj };
        
        if (company) {
            onSave({ id: company.id, ...payload }); // UpdateCompanyInput
        } else {
            onSave(payload); // CreateCompanyInput
        }
    };

    const formatCNPJ = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {company ? "Editar Empresa" : "Nova Empresa"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                            id="cnpj"
                            value={formData.cnpj}
                            onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                            placeholder="00.000.000/0000-00"
                            maxLength={18}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="corporateName">Razão Social</Label>
                        <Input
                            id="corporateName"
                            value={formData.corporateName}
                            onChange={(e) => setFormData({ ...formData, corporateName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="tradeName">Nome Fantasia</Label>
                        <Input
                            id="tradeName"
                            value={formData.tradeName}
                            onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="w-full">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer" type="submit">
                            {company ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};