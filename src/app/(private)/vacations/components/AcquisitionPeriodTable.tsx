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
import { Edit, Lock, Trash2, Unlock } from "lucide-react";

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: 'UTC' });
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
  onDelete: (id: string) => void;
  onClose: (id: string) => void;
  onReopen: (p: AcquisitionPeriod) => void;

  // paginação
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function AcquisitionPeriodTable({
  periods, employeeName, onEdit, onDelete, onClose, onReopen,
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
            <TableHead className="font-bold">Funcionário</TableHead>
            <TableHead className="font-bold">Ano</TableHead>
            <TableHead className="font-bold">Início</TableHead>
            <TableHead className="font-bold">Fim</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="py-1 font-medium">
                {p.employee?.name ?? employeeName(p.employeeId)}
              </TableCell>
              <TableCell className="py-1">{p.year}</TableCell>
              <TableCell className="py-1">{fmt(p.startDate)}</TableCell>
              <TableCell className="py-1">{fmt(p.endDate)}</TableCell>
              <TableCell className="py-1"><StatusBadge status={p.status} /></TableCell>
              <TableCell className="py-1 text-center">
                <div className="inline-flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(p)} className="cursor-pointer"><Edit /></Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(p.id)} className="cursor-pointer"><Trash2 /></Button>

                  {p.status === "open" ? (
                    <Button size="sm" variant="outline" className=" text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
                      onClick={() => onClose(p.id)}>
                      <Unlock />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                      onClick={() => onReopen(p)}>
                      <Lock />
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
                <PaginationItem key={n} className={active ? "cursor-pointer list-none" : ""}>
                  <PaginationLink
                    className="cursor-pointer"
                    onClick={() => onPageChange(n)}
                    {...(active && { "aria-current": "page" })}
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