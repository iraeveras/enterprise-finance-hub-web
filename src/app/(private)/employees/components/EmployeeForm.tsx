// FILE: src/app/(private)/employees/components/EmployeeForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { Employee, CreateEmployeeInput, UpdateEmployeeInput } from "../types";
import type { Company } from "@/app/(private)/companies/types";
import type { Department } from "@/app/(private)/departments/types";
import type { Sector } from "@/app/(private)/sectors/types";
import type { CostCenter } from "@/app/(private)/costcenters/types";
import type { Team } from "@/app/(private)/teams/types";

interface EmployeeFormProps {
    employee?: Employee | null;
    companies: Company[];
    departments: Department[];
    sectors: Sector[];
    costCenters: CostCenter[];
    teams: Team[];
    onClose: () => void;
    onSave: (data: any) => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
    employee,
    companies,
    departments,
    sectors,
    costCenters,
    teams,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState({
        id: employee?.id,
        matricula: employee?.matricula || "",
        name: employee?.name || "",
        admission: employee?.admission ? employee.admission.slice(0, 10) : "",
        position: employee?.position || "",
        salary: employee?.salary || 0,
        dangerPay: employee?.dangerPay || false,
        monthlyHours: employee?.monthlyHours ?? null,
        workSchedule: employee?.workSchedule ?? "",
        companyId: employee && employee.companyId ? Number(employee?.companyId) : null,
        departmentId: employee && employee?.departmentId ? Number(employee.departmentId) : null,
        sectorId: employee && employee?.sectorId ? Number(employee.sectorId) : null,
        costCenterId: employee && employee?.costCenterId ? Number(employee.costCenterId) : null,
        teams: employee?.teams?.map(Number) || [],
        status: employee?.status || "active",
    });

    useEffect(() => {
        if (employee?.teams && Array.isArray(employee.teams)) {
            setFormData(prev => ({ ...prev, teams: employee.teams }));
        }
    }, [employee]);

    const calculateTotalSalary = () => {
        const base = Number(formData.salary) || 0;
        return formData.dangerPay ? base * 1.3 : base;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // converte IDs para number
        const payload = {
            ...formData,
            admission: new Date(formData.admission).toISOString(),
            companyId: String(formData.companyId) === "null" || formData.companyId === null ? null : Number(formData.companyId),
            departmentId: String(formData.departmentId) === "null" || formData.departmentId === null ? null : Number(formData.departmentId),
            sectorId: String(formData.sectorId) === "null" || formData.sectorId === null ? null : Number(formData.sectorId),
            costCenterId: String(formData.costCenterId) === "null" || formData.costCenterId === null ? null : Number(formData.costCenterId),
            teams: formData.teams,
            salary: Number(formData.salary),
            monthlyHours:
                formData.monthlyHours === null || formData.monthlyHours === ("" as any)
                    ? null
                    : Number(formData.monthlyHours),
            workSchedule:
                !formData.workSchedule || String(formData.workSchedule).trim() === ""
                    ? null
                    : String(formData.workSchedule).trim(),
        } as any;
        onSave(payload);
    };

    const handleTeamToggle = (teamId: number) => {
        setFormData(prev => ({
            ...prev,
            teams: prev.teams.includes(teamId)
                ? prev.teams.filter(id => id !== teamId)
                : [...prev.teams, teamId],
        }));
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-sm md:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {employee ? "Editar Funcionário" : "Novo Funcionário"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Matrícula & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="matricula">Matrícula</Label>
                            <Input
                                id="matricula"
                                placeholder="Informar matricula"
                                value={formData.matricula}
                                onChange={(e) =>
                                    setFormData({ ...formData, matricula: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, status: value as 'active' | 'inactive' | 'vacation' | 'leave' })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Inativo</SelectItem>
                                    <SelectItem value="vacation">Férias</SelectItem>
                                    <SelectItem value="leave">Afastado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Nome */}
                    <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            placeholder="Informar nome"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                        />
                    </div>

                    {/* Admissão & Cargo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="admission">Data de Admissão</Label>
                            <Input
                                id="admission"
                                type="date"
                                value={formData.admission}
                                onChange={(e) =>
                                    setFormData({ ...formData, admission: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="position">Cargo</Label>
                            <Input
                                id="position"
                                placeholder="Informar cargo"
                                value={formData.position}
                                onChange={(e) =>
                                    setFormData({ ...formData, position: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* Salário & Periculosidade */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="salary">Salário Base (R$)</Label>
                            <Input
                                id="salary"
                                type="number"
                                step="0.01"
                                value={String(formData.salary)}
                                onChange={(e) =>
                                    setFormData({ ...formData, salary: Number(e.target.value) })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="dangerPay"
                                    checked={formData.dangerPay}
                                    onCheckedChange={(chk) =>
                                        setFormData({ ...formData, dangerPay: chk })
                                    }
                                />
                                <Label htmlFor="dangerPay">
                                    Adicional de Periculosidade (30%)
                                </Label>
                            </div>
                            {formData.dangerPay && (
                                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                    Salário Total: R${" "}
                                    {calculateTotalSalary().toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* >>> NOVA SEÇÃO: Jornada & Horas Mensais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="workSchedule">Jornada de trabalho</Label>
                            <Input
                                id="workSchedule"
                                placeholder='Ex.: "44h/semana" ou "220h/mês"'
                                value={formData.workSchedule ?? ""}
                                onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="monthlyHours">Horas Mensais</Label>
                            <Input
                                id="monthlyHours"
                                type="number"
                                step="1"
                                min="0"
                                placeholder="Ex.: 220"
                                value={formData.monthlyHours ?? ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        monthlyHours: e.target.value === "" ? null : Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Relações (empresa, departamento, setor, CC, equipe) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="companyId">Empresa *</Label>
                            <Select
                                value={String(formData.companyId)}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, companyId: Number(value) })
                                }
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a empresa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">— Selecionar empresa —</SelectItem>
                                    {companies.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.corporateName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="departmentId">Departamento</Label>
                            <Select
                                value={String(formData.departmentId)}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, departmentId: Number(value) })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">— Selecionar departamento —</SelectItem>
                                    {departments.map((d) => (
                                        <SelectItem key={d.id} value={String(d.id)}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="sectorId">Setor</Label>
                            <Select
                                value={String(formData.sectorId)}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, sectorId: Number(value) })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o setor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">— Selecionar setor —</SelectItem>
                                    {sectors.map((s) => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="costCenterId">Centro de Custo</Label>
                            <Select
                                value={String(formData.costCenterId)}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, costCenterId: Number(value) })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o CC" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">— Selecionar c.custo —</SelectItem>
                                    {costCenters.map((cc) => (
                                        <SelectItem key={cc.id} value={String(cc.id)}>
                                            {cc.code} – {cc.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <div>
                                <Label htmlFor="teams">Equipe(s)</Label>
                                <div className="flex flex-col space-y-2">
                                    {teams.map((team) => (
                                        <label key={team.id} className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 border-gray-300 rounded"
                                                value={team.id}
                                                checked={formData.teams.includes(Number(team.id))}
                                                onChange={() => handleTeamToggle(Number(team.id))}
                                            />
                                            <span className="ml-2">{team.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto cursor-pointer">
                            {employee ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};