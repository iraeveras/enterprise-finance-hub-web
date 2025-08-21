// FILE: src/app/(private)/costcenterplans/components/GenericTable.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type Column<T> = {
    header: string;
    render: (row: T) => React.ReactNode;
    className?: string;
};

interface GenericTableProps<T> {
    rows: T[];
    columns: Column<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    emptyMessage?: string;
    actionsColumn?: boolean;
    disabledActions?: boolean;
}

export default function GenericTable<T>({
    rows,
    columns,
    onEdit,
    onDelete,
    emptyMessage = "Sem registros",
    actionsColumn = true,
    disabledActions = false,
}: GenericTableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((c, idx) => (
                            <TableHead key={idx} className={c.className}>{c.header}</TableHead>
                        ))}
                        {actionsColumn && <TableHead className="w-28">Ações</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((r, idx) => (
                        <TableRow key={idx}>
                            {columns.map((c, cidx) => (
                                <TableCell key={cidx} className={c.className}>{c.render(r)}</TableCell>
                            ))}
                            {actionsColumn && (
                                <TableCell className="flex gap-2">
                                    {onEdit && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 p-0 cursor-pointer"
                                            onClick={() => onEdit(r)}
                                            disabled={disabledActions}
                                            title={disabledActions ? "Ações desabilitadas" : "Editar"}
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 w-7 p-0 text-red-600 cursor-pointer"
                                            onClick={() => onDelete(r)}
                                            disabled={disabledActions}
                                            title={disabledActions ? "Ações desabilitadas" : "Excluir"}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={columns.length + (actionsColumn ? 1 : 0)} className="text-center text-muted-foreground">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}