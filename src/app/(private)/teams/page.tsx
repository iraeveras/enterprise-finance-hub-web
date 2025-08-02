// FILE: src/app/(private)/teams/page.tsx
"use client"

import React, { useState, ChangeEvent } from "react"
import { ProtectedPage } from "@/components/layout/ProtectedPage"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Search, Download, Filter, Users as UsersIcon } from "lucide-react"

import { TeamForm } from "./components/TeamForm"
import { useTeams } from "./hooks/useTeams"
import { useTeamCreate } from "./hooks/useTeamCreate"
import { useTeamUpdate } from "./hooks/useTeamUpdade"
import { useTeamDelete } from "./hooks/useTeamDelete"

import { useCompanies } from "../companies/hooks/useCompanies"
import { useSectors } from "../sectors/hooks/useSectors"
import { useUsers } from "../users/hooks/useUsers"

import type { Team, CreateTeamInput, UpdateTeamInput } from "./types"

export default function TeamManager() {
    const teamsQ   = useTeams()
    const create   = useTeamCreate()
    const update   = useTeamUpdate()
    const del      = useTeamDelete()

    const compQ    = useCompanies()
    const sectQ    = useSectors()
    const usersQ   = useUsers()

    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<Team | null>(null)
    const [search, setSearch]     = useState("")

    if (teamsQ.isLoading || compQ.isLoading || sectQ.isLoading || usersQ.isLoading) {
        return <p>Carregando...</p>
    }
    if (teamsQ.error || compQ.error || sectQ.error || usersQ.error) {
        return <p>Erro ao carregar dados</p>
    }

    const teams       = teamsQ.data!
    const companies   = compQ.data!
    const sectors     = sectQ.data!
    const users       = usersQ.data!

    const filtered = teams.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase())
    )

    const onSave = (data: CreateTeamInput | UpdateTeamInput) => {
        if (selected && selected.id) {
            update.mutate({id: selected.id, ...data} as UpdateTeamInput)
        } else {
            create.mutate(data as CreateTeamInput)
        }
        setShowForm(false)
        setSelected(null)
    }

    const openEdit = (team: Team) => {
        setSelected(team);
        setShowForm(true);
    }

    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir esta equipe?")) {
            del.mutate(id)
        }
    }

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Equipes</h1>
                        <p className="text-gray-600">Gerencie suas equipes</p>
                    </div>
                    <Button className="cursor-pointer" onClick={() => { setSelected(null); setShowForm(true) }}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Equipe
                    </Button>
                </div>

                {/* Busca */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Buscar por nome da equipe…"
                                    className="pl-10"
                                    value={search}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" disabled><Filter /> Filtros</Button>
                            <Button variant="outline" disabled><Download /> Exportar</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle>Total: {filtered.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-3 text-left">Nome</th>
                                        <th className="p-3 text-left">Empresa</th>
                                        <th className="p-3 text-left">Setor</th>
                                        <th className="p-3 text-left">Líder</th>
                                        <th className="p-3 text-center">Membros</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((team) => (
                                        <tr key={team.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{team.name}</td>
                                            <td className="p-3">{ companies.find(c => Number(c.id) === team.companyId)?.corporateName }</td>
                                            <td className="p-3">{ sectors.find(s => Number(s.id) === team.sectorId)?.name }</td>
                                            <td className="p-3">{ users.find(u => Number(u.id) === team.leaderId)?.name || "—" }</td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center">
                                                    <UsersIcon className="w-4 h-4 mr-1"/> 
                                                    {team.members?.length != null ? team.members.length : "-"}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge 
                                                    className={team.status==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}
                                                >
                                                    {team.status==="active"?"Ativo":"Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => openEdit(team)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(team.id)}>
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

                {showForm && (
                    <TeamForm
                        team={selected}
                        companies={companies.map(c => ({ id: c.id, corporateName: c.corporateName }))}
                        sectors={sectors.map(s => ({ id: s.id, name: s.name }))}
                        users={users.map(u => ({ id: u.id, name: u.name }))}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    )
}