// src/app/(private)/vacations/components/VacationSectorView.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { VacationPlanningTable } from "./VacationPlanningTable";
import type { Vacation } from "../types";

interface Props {
  vacations: Vacation[];
  onEdit: (vacation: Vacation) => void;
  onDelete: (id: string) => void;
  employeeName: (employeeId: number) => string;
  sectors?: { id: number; name: string }[];
  periodIsClosed?: boolean; // NOVO
}

export function VacationSectorView({
  vacations,
  onEdit,
  onDelete,
  employeeName,
  sectors = [],
  periodIsClosed = false,
}: Props) {
  const [selectedSectorId, setSelectedSectorId] = useState<string>("");

  const sectorVacations = useMemo(() => {
    if (!selectedSectorId) return [];
    const id = Number(selectedSectorId);
    return vacations.filter((v) => Number(v.sectorId) === id);
  }, [vacations, selectedSectorId]);

  const selectedName = useMemo(
    () => sectors.find((s) => String(s.id) === selectedSectorId)?.name ?? "",
    [sectors, selectedSectorId]
  );

  return (
    <div className="space-y-4">
      <Card className="rounded-none gap-2">
        <CardHeader>
          <CardTitle className="text-lg md:text-base flex items-center gap-2">
            <Users className="h-5 w-5" />
            Programação de Férias por Setor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Label htmlFor="sectorSelect" className="mb-2">Selecione o Setor</Label>
            <Select value={selectedSectorId} onValueChange={setSelectedSectorId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um setor para visualizar as programações" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!selectedSectorId && (
            <div className="text-center py-8 text-gray-500">
              Selecione um setor para visualizar as programações de férias.
            </div>
          )}

          {!!selectedSectorId && (
            <VacationPlanningTable
              vacations={sectorVacations}
              onEdit={onEdit}
              onDelete={onDelete}
              employeeName={employeeName}
              sectorName={selectedName}
              periodIsClosed={periodIsClosed}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}