"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const departments = [
  { name: 'Manutenção Elétrica', budget: 173534.40, actual: 173534.40, variance: 0, status: 'success' },
  { name: 'Operações', budget: 87870.13, actual: 87870.13, variance: 0, status: 'success' },
  { name: 'Segurança', budget: 2050.14, actual: 2050.14, variance: 0, status: 'success' },
  { name: 'Brigada de Incêndio', budget: 29735, actual: 32105, variance: 7.97, status: 'warning' },
  { name: 'Marketing', budget: 42348.30, actual: 45123.80, variance: 6.56, status: 'warning' },
  { name: 'Administração', budget: 58067.83, actual: 61234.20, variance: 5.45, status: 'warning' }
];

export const MonthlyComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acompanhamento por Departamento - Dezembro 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-medium">Departamento</th>
                <th className="text-right p-3 font-medium">Orçado (R$)</th>
                <th className="text-right p-3 font-medium">Realizado (R$)</th>
                <th className="text-right p-3 font-medium">Variação (%)</th>
                <th className="text-center p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{dept.name}</td>
                  <td className="p-3 text-right">{dept.budget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className="p-3 text-right">{dept.actual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  <td className={`p-3 text-right font-medium ${dept.variance > 5 ? 'text-red-600' : dept.variance > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {dept.variance > 0 ? '+' : ''}{dept.variance.toFixed(2)}%
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={dept.status === 'success' ? 'default' : dept.status === 'warning' ? 'secondary' : 'destructive'}>
                      {dept.status === 'success' ? 'Dentro da Meta' : 'Acima da Meta'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};