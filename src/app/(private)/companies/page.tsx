// FILE: src/app/(private)/companies/page.tsx
"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Search, Download, Filter, Building } from "lucide-react";
import { CompanyForm } from "./components/CompanyForm";
import type { Company } from "./types";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { useCompanies } from "./hooks/useCompanies";
import { useCompanyUpdate } from "./hooks/useCompanyUpdate";
import { useCompanyCreate, CreateCompanyInput } from "./hooks/useCompanyCreate";
import { useCompanyDelete } from "./hooks/useCompanyDelete";
import { formatCNPJ } from "@/lib/formatCnpj";
import { CompanyTable, CompanyTableProps } from "./components/CompanyTable";


export default function CompanyManager() {
    const companiesQuery = useCompanies();
    const createMutation = useCompanyCreate();
    const updateMutation = useCompanyUpdate();
    const deleteMutation = useCompanyDelete();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [page, setPage] = useState(1)
    const pageSize = 10

    const companies = companiesQuery.data ?? [];
    const isLoading = companiesQuery.isLoading;

    const all = companiesQuery.data ?? []
    const filteredCompanies = companies.filter(company =>
        company.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.corporateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.cnpj.includes(searchTerm)
    );

    const pageCount = Math.ceil(filteredCompanies.length / pageSize)
    const paged = filteredCompanies.slice((page-1)*pageSize, page*pageSize)

    const openNew = () => {
        setSelectedCompany(null);
        setShowForm(true);
    }

    const openEdit = (company: Company) => {
        setSelectedCompany(company);
        setShowForm(true);
    }

    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir esta empresa?")) {
            deleteMutation.mutate(id)
        }
    }

    const onSave = (data: CreateCompanyInput) => {
        if (selectedCompany) {
            updateMutation.mutate({ id: selectedCompany.id, ...data })
        } else {
            createMutation.mutate(data);
        }
        setShowForm(false);
    }

    return (
        <ProtectedPage>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestão de Empresas</h1>
                        <p className="text-gray-600 mt-1">Cadastro e controle de empresas do sistema</p>
                    </div>
                    <Button className="cursor-pointer" onClick={openNew} disabled={createMutation.status === "pending"}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Empresa
                    </Button>
                </div>

                {/* Filtros e Busca */}
                <Card className="rounded-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome fantasia, razão social ou CNPJ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                </Button>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Empresas */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>
                            Empresas Cadastradas 
                            ({filteredCompanies.length}) 
                            {isLoading && <span className="ml-2 text-xs text-gray-400">Carregando...</span>} 
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <CompanyTable
                                data={paged}
                                isLoading={companiesQuery.isLoading}
                                page={page}
                                pageCount={pageCount}
                                onPageChange={setPage}
                                onEdit={openEdit}
                                onDelete={onDelete}
                            />
                            {/* <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-3 font-medium">CNPJ</th>
                                        <th className="text-left p-3 font-medium">Razão Social</th>
                                        <th className="text-left p-3 font-medium">Nome Fantasia</th>
                                        <th className="text-center p-3 font-medium">Status</th>
                                        <th className="text-left p-3 font-medium">Criado em</th>
                                        <th className="text-center p-3 font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCompanies.map((company) => (
                                        <tr key={company.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-mono">{formatCNPJ(company.cnpj)}</td>
                                            <td className="p-3 font-medium">{company.corporateName}</td>
                                            <td className="p-3">{company.tradeName}</td>
                                            <td className="p-3 text-center">
                                                <Badge  
                                                    className={company.status==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}
                                                >
                                                    {company.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </td>
                                            <td className="p-3">{new Date(company.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td className="p-3 text-center">
                                                <Button
                                                    className="cursor-pointer"
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => openEdit(company)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(company.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Modal de Cadastro/Edição */}
                {showForm && (
                    <CompanyForm
                        company={selectedCompany}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    );
};