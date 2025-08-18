// src/app/(private)/vacations/components/VacationPlanningTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Download, Filter, Edit, Trash2 } from "lucide-react";
import type { Vacation, VacationStatus } from "../types";
import { useEmployees } from "../../employees/hooks/useEmployees";
import { employeeMat } from "@/lib/employees-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

function StatusBadge({ status }: { status: VacationStatus }) {
  const map: Record<VacationStatus, { label: string; variant: "default" | "outline" | "secondary" }> = {
    scheduled: { label: "Programado", variant: "outline" },
    approved: { label: "Aprovado", variant: "default" },
    taken: { label: "Realizado", variant: "secondary" },
  };
  const s = map[status];
  return <Badge variant={s.variant} className="text-xs">{s.label}</Badge>;
}

interface Props {
  vacations: Vacation[];
  onEdit: (vacation: Vacation) => void;
  onDelete: (id: string) => void;
  employeeName: (employeeId: number) => string;
  sectorName?: string;
  periodIsClosed?: boolean; // NOVO
}

export function VacationPlanningTable({
  vacations,
  onEdit,
  onDelete,
  employeeName,
  sectorName,
  periodIsClosed = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | VacationStatus>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const employeesQ = useEmployees();
  const employees = employeesQ.data ?? [];

  const filtered = useMemo(() => {
    return vacations.filter((v) => {
      const matchesName = employeeName(v.employeeId).toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || v.status === status;
      return matchesName && matchesStatus;
    });
  }, [vacations, search, status, employeeName]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-6">
      <Card className="rounded-none">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-lg md:text-xl">
              Programação de Férias{sectorName ? ` — ${sectorName}` : ""} ({total})
            </CardTitle>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar funcionário..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>

            <div>
              <Select
                value={status}
                onValueChange={(e) => { setStatus(e as any); setPage(1); }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="taken">Realizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold w-16">Mat</TableHead>
                  <TableHead className="font-semibold min-w-48 truncate">Funcionário</TableHead>
                  <TableHead className="font-semibold w-28">Período Aquisitivo</TableHead>
                  <TableHead className="font-semibold w-20">Dias</TableHead>
                  <TableHead className="font-semibold w-20">Abono</TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="grid grid-cols-12 gap-1 text-xs">{months.map((m) => <div key={m}>{m}</div>)}</div>
                  </TableHead>
                  <TableHead className="font-semibold w-24">Status</TableHead>
                  <TableHead className="font-semibold w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((v) => (
                  <TableRow key={v.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm py-1">
                      {employeeMat(employees, v.employeeId)}
                    </TableCell>
                    <TableCell className="font-medium text-sm py-1">
                      {employeeName(v.employeeId)}
                    </TableCell>
                    <TableCell className="text-sm py-1">
                      {new Date(v.acquisitionPeriodStart).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      {" - "}
                      {new Date(v.acquisitionPeriodEnd).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-sm py-1">{v.vacationDays}</TableCell>
                    <TableCell className="text-sm py-1">{v.abonoDays || 0}</TableCell>
                    <TableCell className="px-2 py-1">
                      <div className="grid grid-cols-12 gap-1">
                        {months.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-6 w-full rounded text-xs flex items-center justify-center ${v.month === idx + 1 ? "bg-blue-500 text-white font-bold" : "bg-gray-100"}`}
                          >
                            {v.month === idx + 1 ? v.vacationDays : ""}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-1"><StatusBadge status={v.status} /></TableCell>
                    <TableCell className="py-1">
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 cursor-pointer"
                          onClick={() => onEdit(v)}
                          disabled={periodIsClosed}
                          title={periodIsClosed ? "Período fechado" : "Editar"}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 cursor-pointer"
                          onClick={() => onDelete(v.id)}
                          disabled={periodIsClosed}
                          title={periodIsClosed ? "Período fechado" : "Excluir"}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {total > 0 && (
            <div className="mt-2 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: pageCount }).map((_, i) => {
                    const n = i + 1;
                    const active = n === page;
                    return (
                      <PaginationItem key={n} className={active ? "cursor-pointer list-none" : ""}>
                        <PaginationLink
                          className="cursor-pointer"
                          onClick={() => setPage(n)}
                          {...(active && { "aria-current": "page" })}
                        >
                          {n}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < pageCount && setPage(page + 1)}
                      className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {total === 0 && (
            <div className="text-center py-8 text-gray-500">Nenhuma programação de férias encontrada.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}