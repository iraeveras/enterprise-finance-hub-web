// FILE: src/app/(private)/costcenters/page.tsx
"use client"

import React, { useState, ChangeEvent } from "react"
import { ProtectedPage } from "@/components/layout/ProtectedPage"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Download, Filter } from "lucide-react"

import { CostCenterForm } from "./components/CostCenterForm"
import { useCostCenters } from "./hooks/useCostCenters"
import { useCostCenterCreate } from "./hooks/useCostCenterCreate"
import { useCostCenterUpdate } from "./hooks/useCostCenterUpdate"
import { useCostCenterDelete } from "./hooks/useCostCenterDelete"

import { useCompanies } from "../companies/hooks/useCompanies"
import { useDepartments } from "../departments/hooks/useDepartments"
import { useSectors } from "../sectors/hooks/useSectors"
import type { CostCenter, CreateCostCenterInput, UpdateCostCenterInput } from "./types";

export default function CostCenterManager() {
    const costCenterQ    = useCostCenters()
    const createCostCenter = useCostCenterCreate()
    const updateCostCenter = useCostCenterUpdate()
    const deleteCostCenter    = useCostCenterDelete()

    const compQ  = useCompanies()
    const deptQ  = useDepartments()
    const sectQ  = useSectors()

    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<CostCenter | null>(null)
    const [search, setSearch]     = useState("")

    if (costCenterQ.isLoading || compQ.isLoading || deptQ.isLoading || sectQ.isLoading) {
        return <p>Carregando...</p>
    }
    if (costCenterQ.error || compQ.error || deptQ.error || sectQ.error) {
        return <p>Erro ao carregar dados</p>
    }

    const costcenters = costCenterQ.data!
    const companies   = compQ.data!
    const departments = deptQ.data!
    const sectors     = sectQ.data!

    const filtered = costcenters.filter(cc =>
        cc.name.toLowerCase().includes(search.toLowerCase()) ||
        cc.code.toLowerCase().includes(search.toLowerCase())
    )
    
    const openNew = () => {
        setSelected(null);
        setShowForm(true);
    }

    const openEdit = (cc: CostCenter) => {
        setSelected(cc);
        setShowForm(true);
    }

    const onSave = (data: CreateCostCenterInput | UpdateCostCenterInput) => {
        if (selected && selected.id) {
            updateCostCenter.mutate({id: selected, ...data} as UpdateCostCenterInput)
        } else {
            createCostCenter.mutate(data as CreateCostCenterInput)
        }
        setShowForm(false)
    }

    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este centro de custo?")) {
            deleteCostCenter.mutate(id)
        }
    }

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Centros de Custo</h1>
                        <p className="text-gray-600">Gerencie seus centros de custo</p>
                    </div>
                    <Button className="cursor-pointer" onClick={openNew}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Centro de Custo
                    </Button>
                </div>

                {/* Busca */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome ou código..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button className="cursor-pointer" variant="outline" disabled><Filter /> Filtros</Button>
                            <Button className="cursor-pointer" variant="outline" disabled><Download /> Exportar</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            Centro de custo Cadastrados: ({filtered.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-3 text-left">Código</th>
                                        <th className="p-3 text-left">Nome</th>
                                        <th className="p-3 text-left">Empresa</th>
                                        <th className="p-3 text-left">Departamento</th>
                                        <th className="p-3 text-left">Setor</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((cc) => (
                                        <tr key={cc.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-mono">{cc.code}</td>
                                            <td className="p-3 font-medium">{cc.name}</td>
                                            <td className="p-3">
                                                {companies.find((c) => Number(c.id) === cc.companyId)?.corporateName}
                                            </td>
                                            <td className="p-3">
                                                {departments.find((d) => Number(d.id) === cc.departmentId)?.name}
                                            </td>
                                            <td className="p-3">
                                                {sectors.find((s) => Number(s.id) === cc.sectorId)?.name}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge variant={cc.status==="active"?"default":"secondary"}>
                                                    {cc.status==="active"?"Ativo":"Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <Button
                                                    className="cursor-pointer"
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => openEdit(cc)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    className="cursor-pointer"
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => onDelete(cc.id)}
                                                >
                                                    Excluir
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {showForm && (
                    <CostCenterForm
                        costCenter={selected}
                        companies={companies.map(c => ({ id: c.id, corporateName: c.corporateName }))}
                        departments={departments.map(d => ({ id: d.id, name: d.name }))}
                        sectors={sectors.map(s => ({ id: s.id, name: s.name }))}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    )
}