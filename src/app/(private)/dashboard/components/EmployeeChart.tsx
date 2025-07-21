"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Manutenção Elétrica', value: 6, color: '#3b82f6' },
  { name: 'Segurança', value: 15, color: '#10b981' },
  { name: 'Brigada de Incêndio', value: 8, color: '#f59e0b' },
  { name: 'Marketing', value: 12, color: '#ef4444' },
  { name: 'Operações', value: 45, color: '#8b5cf6' },
  { name: 'Administração', value: 18, color: '#06b6d4' },
  { name: 'Outros', value: 23, color: '#6b7280' }
];

export const EmployeeChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Departamento</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} funcionários`, '']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};