// src/app/(private)/vacations/components/VacationPaymentTable.tsx
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import type { Vacation, VacationStatus } from "../types";
import { useEmployees } from "../../employees/hooks/useEmployees";
import { employeeMat } from "@/lib/employees-utils";

const months = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function StatusBadge({ status }: { status: VacationStatus }) {
  const map: Record<VacationStatus, { label: string; variant: "default"|"outline"|"secondary" }> = {
    scheduled: { label: "Programado", variant: "outline" },
    approved:  { label: "Aprovado",   variant: "default" },
    taken:     { label: "Realizado",  variant: "secondary" },
  };
  const s = map[status];
  return <Badge variant={s.variant} className="text-xs">{s.label}</Badge>;
}

interface Props {
  vacations: Vacation[];
  type?: "thirteenth" | "abono";
  employeeName: (employeeId: number) => string;
}

export function VacationPaymentTable({ vacations, type = "thirteenth", employeeName }: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // >>> employees para fallback de cálculo
  const employeesQ = useEmployees();
  const employees = employeesQ.data ?? [];

  // helper para calcular valores de exibição quando a API tiver zeros
  const computeForDisplay = (v: Vacation) => {
    const emp: any = employees.find((e: any) => Number(e.id) === Number(v.employeeId));
    const sal = Number(emp?.salary ?? v.baseSalary ?? 0);
    const dangerPay = Boolean(emp?.dangerPay);
    const baseSalary = (v.baseSalary && v.baseSalary > 0) ? v.baseSalary : (dangerPay ? sal * 1.3 : sal);
    const overtimeAverage = Number(emp?.overtimeAverage ?? v.overtimeAverage ?? 0);
    const totalBase = baseSalary + overtimeAverage;

    const vacDaily = totalBase / 30;
    const vacationValue = v.vacationValue || vacDaily * (v.vacationDays || 0);
    const onethirdValue = v.onethirdValue || vacationValue / 3;

    const abonoDaily = totalBase / 30;
    const abonoValue = v.abonoValue || abonoDaily * (v.abonoDays || 0);
    const abonoOnethirdValue = v.abonoOnethirdValue || abonoValue / 3;

    const thirteenthSalary = v.thirteenthAdvance ? baseSalary * 0.5 : 0;

    return { baseSalary, overtimeAverage, vacationValue, onethirdValue, abonoValue, abonoOnethirdValue, thirteenthSalary };
  };

  const total = vacations.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = vacations.slice(start, start + pageSize);

  const getPaymentMonth = (v: Vacation) => v.month || 1;

  if (type === "thirteenth") {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold w-16">Mat</TableHead>
              <TableHead className="font-semibold min-w-[150px]">Funcionário</TableHead>
              <TableHead className="font-semibold w-24">Mês</TableHead>
              <TableHead className="font-semibold w-20">Dias</TableHead>
              <TableHead className="font-semibold text-right w-32">13º Salário</TableHead>
              <TableHead className="font-semibold w-24">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((v) => {
              const calc = computeForDisplay(v);
              return (
                <TableRow key={v.id} className="hover:bg-gray-50">
                  <TableCell className="font-mono text-sm">{employeeMat(employees, v.employeeId)}</TableCell>
                  <TableCell className="font-medium text-sm">{employeeName(v.employeeId)}</TableCell>
                  <TableCell className="text-sm">{months[getPaymentMonth(v) - 1]}</TableCell>
                  <TableCell className="text-sm">{v.vacationDays}</TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    R$ {calc.thirteenthSalary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell><StatusBadge status={v.status} /></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {total > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && setPage(page - 1)}
                    className={page === 1 ? "cursor-pointer pointer-events-none opacity-50" : ""}
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
      </div>
    );
  }

  // Tabela para abono
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold w-16">Mat</TableHead>
            <TableHead className="font-semibold min-w-[150px]">Funcionário</TableHead>
            <TableHead className="font-semibold w-24">Mês</TableHead>
            <TableHead className="font-semibold w-20">Dias</TableHead>
            <TableHead className="font-semibold text-right w-28">Férias</TableHead>
            <TableHead className="font-semibold text-right w-28">1/3 Férias</TableHead>
            <TableHead className="font-semibold text-right w-28">Abono</TableHead>
            <TableHead className="font-semibold text-right w-28">1/3 Abono</TableHead>
            <TableHead className="font-semibold text-right w-32">Total Férias</TableHead>
            <TableHead className="font-semibold text-right w-32">Total Abono</TableHead>
            <TableHead className="font-bold text-right w-32">Total Geral</TableHead>
            <TableHead className="font-semibold w-24">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((v) => {
            const c = computeForDisplay(v);
            const totalFerias = c.vacationValue + c.onethirdValue;
            const totalAbono  = c.abonoValue + c.abonoOnethirdValue;
            const totalGeral  = totalFerias + totalAbono;

            return (
              <TableRow key={v.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">{employeeMat(employees, v.employeeId)}</TableCell>
                <TableCell className="font-medium text-sm">{employeeName(v.employeeId)}</TableCell>
                <TableCell className="text-sm">{months[getPaymentMonth(v) - 1]}</TableCell>
                <TableCell className="text-sm">{v.vacationDays}</TableCell>
                <TableCell className="text-right text-sm">R$ {c.vacationValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right text-sm">R$ {c.onethirdValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right text-sm">R$ {c.abonoValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right text-sm">R$ {c.abonoOnethirdValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right text-sm font-medium">R$ {totalFerias.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right text-sm font-medium">R$ {totalAbono.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right font-bold text-sm bg-gray-50">R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell><StatusBadge status={v.status} /></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {total > 0 && (
        <div className="mt-4 flex justify-center">
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
                      aria-current={active ? "page" : undefined}
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
    </div>
  );
}