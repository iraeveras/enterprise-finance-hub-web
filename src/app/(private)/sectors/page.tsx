// src/app/(private)/setors/page.tsx
"use client"

import React, { useState, ChangeEvent } from "react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { SectorForm } from "./components/SectorForm";
import { useSectors } from "./hooks/useSectors";
import { useSectorCreate } from "./hooks/useSectorCreate";
import { useSectorUpdate } from "./hooks/useSectorUpdate";
import { useSectorDelete } from "./hooks/useSectorDelete";
import type { CreateSectorInput, Sector, UpdateSectorInput } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Filter, Edit, Trash2 } from "lucide-react";
import { useCompanies } from "../companies/hooks/useCompanies";
import { useDepartments } from "../departments/hooks/useDepartments";

export default function SectorManager() {
    const sectorsQuery = useSectors();
    const companiesQuery = useCompanies();
    const departmentsQuery = useDepartments();
    const createSector = useSectorCreate();
    const updateSector = useSectorUpdate();
    const deleteSector = useSectorDelete();

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
    
    if (sectorsQuery.isLoading || companiesQuery.isLoading || departmentsQuery.isLoading) return <p>Carregando</p>
    if (sectorsQuery.error || companiesQuery.error || companiesQuery.error) return <p>Erro ao carregar dados</p>

    const sectors = sectorsQuery.data!;
    const companies = companiesQuery.data!;
    const departments = departmentsQuery.data!;

    const filteredSectors = sectors.filter((s) => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openNew = () => {
        setSelectedSector(null);
        setShowForm(true);
    };

    const openEdit = (s: Sector) => {
        setSelectedSector(s);
        setShowForm(true);
    };

    const onSave = (data: CreateSectorInput | UpdateSectorInput) => {
        if (selectedSector && selectedSector.id) {
            updateSector.mutate({id: selectedSector, ...data} as UpdateSectorInput)
        } else {
            createSector.mutate(data as CreateSectorInput);
        }
        setShowForm(false);
    }

    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este setor?")) {
            deleteSector.mutate(id);
        }
    };
    return (
        <ProtectedPage>
            <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Setores</h1>
                <p className="text-gray-600 mt-1">Cadastro e controle de setores por departamento</p>
            </div>
            <Button className="cursor-pointer" onClick={openNew} disabled={createSector.status === "pending"}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Setor
            </Button>
        </div>

        {/* Filtros e Busca */}
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar por nome do setor..."
                            value={searchTerm}
                            onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button className="cursor-pointer" variant="outline">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                        <Button className="cursor-pointer" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Lista de Setores */}
        <Card>
            <CardHeader>
                <CardTitle>Setores Cadastrados ({filteredSectors.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-3 font-medium">Nome</th>
                                <th className="text-left p-3 font-medium">Empresa</th>
                                <th className="text-left p-3 font-medium">Departamento</th>
                                <th className="text-center p-3 font-medium">Status</th>
                                <th className="text-center p-3 font-medium">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSectors.map((sector) => (
                                <tr key={sector.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium">{sector.name}</td>
                                    <td className="p-3">{companies.find((c) => Number(c.id) === sector.companyId)?.corporateName}</td>
                                    <td className="p-3">{departments.find((d) => Number(d.id) === sector.departmentId)?.name}</td>
                                    <td className="p-3 text-center">
                                        <Badge 
                                            className={sector.status==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}
                                        >
                                            {sector.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </Badge>
                                    </td>
                                    <td className="p-3 space-x-2 text-center">
                                        <Button
                                            className="cursor-pointer"
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => openEdit(sector)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            className="cursor-pointer" 
                                            size="sm" 
                                            variant="ghost" 
                                            onClick={() => onDelete(sector.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>

        {/* Modal de Cadastro/Edição */}
        {showForm && (
            <SectorForm
                sector={selectedSector}
                companies={companies.map((c) => ({ id: c.id, corporateName: c.corporateName}))}
                departments={departments.map((d) => ({ id: d.id, name: d.name}))}
                onClose={() => setShowForm(false)}
                onSave={onSave}
            />
        )}
    </div>
        </ProtectedPage>
    )
}