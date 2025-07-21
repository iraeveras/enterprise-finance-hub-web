"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', orcado: 35598, realizado: 34593 },
  { month: 'Fev', realizado: 35598, orcado: 35598 },
  { month: 'Mar', orcado: 33367, realizado: 33367 },
  { month: 'Abr', orcado: 33367, realizado: 32195 },
  { month: 'Mai', orcado: 32195, realizado: 32195 },
  { month: 'Jun', orcado: 35644, realizado: 34539 },
  { month: 'Jul', orcado: 34539, realizado: 32195 },
  { month: 'Ago', orcado: 32195, realizado: 32195 },
  { month: 'Set', orcado: 32195, realizado: 39588 },
  { month: 'Out', orcado: 39588, realizado: 33690 },
  { month: 'Nov', orcado: 33690, realizado: 48673 },
  { month: 'Dez', orcado: 48673, realizado: 42878 }
];

export const BudgetChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orçado vs Realizado 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']} />
            <Legend />
            <Bar dataKey="orcado" fill="#3b82f6" name="Orçado" />
            <Bar dataKey="realizado" fill="#10b981" name="Realizado" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};