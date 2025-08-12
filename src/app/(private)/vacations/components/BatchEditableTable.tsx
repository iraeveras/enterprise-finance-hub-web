// FILE: src/app/(private)/vacations/components/BatchEditableTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export interface EmployeeRow {
    id: string;
    name: string;
    salary: number;
    dangerPay?: boolean;
    overtimeAverage?: number;
}

export interface BatchTableField {
    key: string;
    label: string;
    type: "number" | "text" | "readonly" | "select" | "switch";
    defaultValue?: any;
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
}

interface BatchEditableTableProps {
    employees: EmployeeRow[];
    fields: BatchTableField[];
    onSelectionChange: (selectedEmployees: string[]) => void;
    onDataChange: (employeeId: string, field: string, value: any) => void;
    selectedEmployees: string[];
    employeeData: Record<string, Record<string, any>>;

    // opcional: permite opções por linha (ex.: períodos aquisitivos filtrados por funcionário)
    perRowOptions?: Record<string, (emp: EmployeeRow) => { value: string; label: string }[]>;

    // opcional: callback de cálculo por linha
    calculateValues?: (employee: EmployeeRow, data: Record<string, any>) => Record<string, any>;
    pageSize?: number;
}

export const BatchEditableTable = ({
    employees,
    fields,
    onSelectionChange,
    onDataChange,
    selectedEmployees,
    employeeData,
    calculateValues,
    perRowOptions,
    pageSize = 7,
}: BatchEditableTableProps) => {
    // const [selectAll, setSelectAll] = useState(false);
    const [page, setPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const currentItems = useMemo(() => employees.slice(start, end), [employees, start, end]);

    const isPageFullySelected = currentItems.length > 0 && currentItems.every((e) => selectedEmployees.includes(e.id));

    const handleSelectAllCurrentPage = (checked: boolean) => {
        if (checked) {
            const union = new Set(selectedEmployees);
            currentItems.forEach((e) => union.add(e.id));
            onSelectionChange(Array.from(union));
        } else {
            const filtered = selectedEmployees.filter((id) => !currentItems.some((e) => e.id === id));
            onSelectionChange(filtered);
        }
    };

    const handleEmployeeSelection = (employeeId: string, checked: boolean) => {
        if (checked) onSelectionChange([...selectedEmployees, employeeId]);
        else onSelectionChange(selectedEmployees.filter((id) => id !== employeeId));
    };

    const handleFieldChange = (employeeId: string, fieldKey: string, value: any) => {
        onDataChange(employeeId, fieldKey, value);
    };

    const handleApplyToAll = (fieldKey: string) => {
        const first = selectedEmployees[0];
        if (first && employeeData[first]) {
            const value = employeeData[first][fieldKey];
            selectedEmployees.forEach((id) => {
                if (id !== first) onDataChange(id, fieldKey, value);
            });
        }
    };

    // helper pra páginas (com reticências quando necessário)
    const buildPageList = () => {
        const pages: (number | "…")[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        const add = (n: number) => pages.push(n);
        pages.push(1);
        if (page > 3) pages.push("…");
        const startMid = Math.max(2, page - 1);
        const endMid = Math.min(totalPages - 1, page + 1);
        for (let i = startMid; i <= endMid; i++) add(i);
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
        return pages;
    };

    const pageList = buildPageList();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                <span>Lançamento em Lote - Funcionários</span>
                <span className="text-sm text-muted-foreground">
                    {selectedEmployees.length} de {employees.length} selecionados
                </span>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="rounded-md border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={isPageFullySelected}
                                        onCheckedChange={(checked) => handleSelectAllCurrentPage(!!checked)}
                                    />
                                </TableHead>
                                <TableHead>Funcionário</TableHead>
                                <TableHead>Salário Base</TableHead>

                                {fields.map((field) => (
                                <TableHead key={field.key} className="min-w-32">
                                    <div className="flex items-center gap-2">
                                        {field.label}
                                        {field.type !== "readonly" && selectedEmployees.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-xs"
                                                onClick={() => handleApplyToAll(field.key)}
                                                title="Aplicar valor do primeiro selecionado em todos"
                                            />
                                        )}
                                    </div>
                                </TableHead>
                                ))}

                                {calculateValues && <TableHead>Total Calculado</TableHead>}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.map((emp) => {
                                const isSelected = selectedEmployees.includes(emp.id);
                                const data = employeeData[emp.id] || {};
                                const calc = calculateValues ? calculateValues(emp, data) : {};

                                return (
                                <TableRow key={emp.id} className={isSelected ? "bg-blue-50" : ""}>
                                    <TableCell>
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleEmployeeSelection(emp.id, !!checked)}
                                        />
                                    </TableCell>

                                    <TableCell className="font-medium">
                                        <div>
                                            <div>{emp.name}</div>
                                            {emp.dangerPay && <div className="text-xs text-orange-600">+ Periculosidade</div>}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        R$ {emp.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </TableCell>

                                    {fields.map((field) => {
                                        const rowOptions =
                                            perRowOptions?.[field.key]?.(emp) ?? field.options ?? [];

                                        return (
                                            <TableCell key={field.key}>
                                                {field.type === "readonly" ? (
                                                    <span className="text-sm text-muted-foreground">
                                                        {typeof calc[field.key] === "number"
                                                            ? `R$ ${calc[field.key].toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                                                            : calc[field.key] ?? data[field.key] ?? "-"
                                                        }
                                                    </span>
                                                ) : field.type === "select" ? (
                                                    <Select
                                                        value={data[field.key] ?? field.defaultValue ?? ""}
                                                        onValueChange={(value) => handleFieldChange(emp.id, field.key, value)}
                                                        disabled={!isSelected}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {rowOptions.map((o) => (
                                                            <SelectItem key={o.value} value={o.value}>
                                                                {o.label}
                                                            </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : field.type === "switch" ? (
                                                    <div className="flex items-center justify-center">
                                                    <Switch
                                                        checked={Boolean(data[field.key] ?? field.defaultValue ?? false)}
                                                        onCheckedChange={(v) => handleFieldChange(emp.id, field.key, v)}
                                                        disabled={!isSelected}
                                                    />
                                                    </div>
                                                ) : (
                                                    <Input
                                                        type={field.type}
                                                        value={data[field.key] ?? field.defaultValue ?? ""}
                                                        onChange={(e) => {
                                                            const v = field.type === "number" ? parseFloat(e.target.value || "0") : e.target.value;
                                                            handleFieldChange(emp.id, field.key, v);
                                                        }}
                                                        min={field.min}
                                                        max={field.max}
                                                        step={field.step}
                                                        className="w-16"
                                                        disabled={!isSelected}
                                                        placeholder={field.type === "number" ? "0" : ""}
                                                    />
                                                )}
                                            </TableCell>
                                        );
                                    })}

                                    {calculateValues && (
                                        <TableCell>
                                            <div className="text-sm font-medium text-green-600">
                                            {calc.totalValue 
                                                ? `R$ ${Number(calc.totalValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` 
                                                : "-"}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage((p) => Math.max(1, p - 1));
                                    }}
                                />
                            </PaginationItem>

                            {pageList.map((p, idx) =>
                                p === "…" ? (
                                    <PaginationItem key={`ellipsis-${idx}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={`page-${p}`}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === p}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setPage(Number(p));
                                            }}
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage((p) => Math.min(totalPages, p + 1));
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};