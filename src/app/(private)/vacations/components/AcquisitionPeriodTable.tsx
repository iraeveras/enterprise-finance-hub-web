// FILE: src/app/(private)/vacations/components/AcquisitionPeriodTable.tsx
"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import type { AcquisitionPeriod } from "../types";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

function StatusBadge({ status }: { status: AcquisitionPeriod["status"] }) {
  if (status === "open") return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
  if (status === "used") return <Badge variant="outline">Utilizado</Badge>;
  return <Badge variant="secondary">Fechado</Badge>;
}

export interface AcquisitionPeriodTableProps {
  periods: AcquisitionPeriod[];
  // mapeamento de funcionário (caso o backend não envie no objeto)
  employeeName: (employeeId: number) => string;
  // ações
  onEdit: (p: AcquisitionPeriod) => void;
  onClose: (id: string) => void;
  onReopen: (p: AcquisitionPeriod) => void;

  // paginação
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function AcquisitionPeriodTable({
  periods, employeeName, onEdit, onClose, onReopen,
  page, pageSize, total, onPageChange,
}: AcquisitionPeriodTableProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Ano</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                {p.employee?.name ?? employeeName(p.employeeId)}
              </TableCell>
              <TableCell>{p.year}</TableCell>
              <TableCell>{fmt(p.startDate)}</TableCell>
              <TableCell>{fmt(p.endDate)}</TableCell>
              <TableCell><StatusBadge status={p.status} /></TableCell>
              <TableCell className="text-center">
                <div className="inline-flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(p)}>Editar</Button>

                  {p.status === "open" ? (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => onClose(p.id)}>
                      Fechar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => onReopen(p)}>
                      Reabrir
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {canPrev ? (
                <PaginationPrevious onClick={() => onPageChange(page - 1)} />
              ) : (
                <span aria-disabled className="pointer-events-none opacity-50">
                  <PaginationPrevious />
                </span>
              )}
            </PaginationItem>

            {Array.from({ length: pageCount }).map((_, i) => {
              const n = i + 1;
              const active = n === page;
              return (
                <PaginationItem key={n}>
                  <PaginationLink
                    onClick={() => onPageChange(n)}
                    aria-current={active ? "page" : undefined}
                    className={active ? "bg-primary text-primary-foreground" : ""}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              {canNext ? (
                <PaginationNext onClick={() => onPageChange(page + 1)} />
              ) : (
                <span aria-disabled className="pointer-events-none opacity-50">
                  <PaginationNext />
                </span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}