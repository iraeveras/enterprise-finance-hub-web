// FILE: src/app/(private)/overtimes/components/OvertimeFormNewTable.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type MonthlyRow = {
    month: number;
    he50Qty: number;
    he100Qty: number;
    holidayDaysQty: number;
    nightHoursQty: number;
    he50Value: number;
    he100Value: number;
    holidayValue: number;
    nightValue: number;
    dsrValue: number;
    dsrNightValue: number;
    totalValue: number;
    previousYearTotal: number;
    variance: number;
};

interface Props {
    rows: MonthlyRow[];
    onChange: (index: number, field: keyof MonthlyRow, value: number) => void;
    getMonthName: (m: number) => string;
    showReadonlyTotals?: boolean;
}

export default function OvertimeFormNewTable({
    rows, onChange, getMonthName, showReadonlyTotals = true,
}: Props) {
    return (
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-12 sm:min-w-16">Mês</TableHead>
                        <TableHead className="min-w-16 sm:min-w-24">HE 50%</TableHead>
                        <TableHead className="min-w-16 sm:min-w-24">HE 100%</TableHead>
                        <TableHead className="min-w-16 sm:min-w-24">Feriados (dias)</TableHead>
                        <TableHead className="min-w-16 sm:min-w-24">Adic. Not. (h)</TableHead>
                        <TableHead className="min-w-20 sm:min-w-28">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>DSR</TooltipTrigger>
                                    <TooltipContent>Calculado automaticamente</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableHead>
                        <TableHead className="min-w-20 sm:min-w-28">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>DSR Not.</TooltipTrigger>
                                    <TooltipContent>Calculado automaticamente</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableHead>
                        <TableHead className="min-w-24 sm:min-w-32">Total Exercício</TableHead>
                        <TableHead className="min-w-24 sm:min-w-32">Ano Anterior</TableHead>
                        <TableHead className="min-w-20 sm:min-w-28">Diferença</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {rows.map((month, index) => (
                        <TableRow key={month.month}>
                            <TableCell className="font-medium">{getMonthName(month.month)}</TableCell>

                            <TableCell>
                                <Input
                                    inputMode="decimal"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={month.he50Qty}
                                    onChange={(e) => onChange(index, "he50Qty", parseFloat(e.target.value) || 0)}
                                    className="w-16 sm:w-20"
                                />
                                {showReadonlyTotals && month.he50Value > 0 && (
                                    <div className="text-xs text-green-600 mt-1">
                                        R$ {month.he50Value.toFixed(2).replace(".", ",")}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <Input
                                    inputMode="decimal"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={month.he100Qty}
                                    onChange={(e) => onChange(index, "he100Qty", parseFloat(e.target.value) || 0)}
                                    className="w-16 sm:w-20"
                                />
                                {showReadonlyTotals && month.he100Value > 0 && (
                                    <div className="text-xs text-green-600 mt-1">
                                        R$ {month.he100Value.toFixed(2).replace(".", ",")}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <Input
                                    inputMode="decimal"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={month.holidayDaysQty}
                                    onChange={(e) => onChange(index, "holidayDaysQty", parseFloat(e.target.value) || 0)}
                                    className="w-16 sm:w-20"
                                />
                                {showReadonlyTotals && month.holidayValue > 0 && (
                                    <div className="text-xs text-green-600 mt-1">
                                        R$ {month.holidayValue.toFixed(2).replace(".", ",")}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell>
                                <Input
                                    inputMode="decimal"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    value={month.nightHoursQty}
                                    onChange={(e) => onChange(index, "nightHoursQty", parseFloat(e.target.value) || 0)}
                                    className="w-16 sm:w-20"
                                />
                                {showReadonlyTotals && month.nightValue > 0 && (
                                    <div className="text-xs text-green-600 mt-1">
                                        R$ {month.nightValue.toFixed(2).replace(".", ",")}
                                    </div>
                                )}
                            </TableCell>

                            <TableCell className="bg-gray-50">
                                <div className="text-sm">R$ {month.dsrValue.toFixed(2).replace(".", ",")}</div>
                            </TableCell>
                            <TableCell className="bg-gray-50">
                                <div className="text-sm">R$ {month.dsrNightValue.toFixed(2).replace(".", ",")}</div>
                            </TableCell>

                            <TableCell className="bg-blue-50">
                                <div className="text-sm font-medium">R$ {month.totalValue.toFixed(2).replace(".", ",")}</div>
                            </TableCell>
                            <TableCell className="bg-gray-50">
                                <div className="text-sm">R$ {month.previousYearTotal.toFixed(2).replace(".", ",")}</div>
                            </TableCell>
                            <TableCell className={`${month.variance >= 0 ? "text-red-600" : "text-green-600"}`}>
                                <div className="text-sm font-medium">
                                    {(month.variance >= 0 ? "+" : "")}R$ {month.variance.toFixed(2).replace(".", ",")}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}