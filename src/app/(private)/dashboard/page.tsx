"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Calendar,
    FileText,
    AlertTriangle,
    CheckCircle
} from "lucide-react";
import { BudgetChart } from "./components/BudgetChart";
import { EmployeeChart } from "./components/EmployeeChart";
import { MonthlyComparison } from "./components/MonthlyComparison";
import { PeriodSelector } from "./components/PeriodSelector";
import { ProtectedPage } from "@/components/layout/ProtectedPage";

export const DashboardContent = () => {
    const [isPeriodSelectorOpen, setIsPeriodSelectorOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("Dezembro 2025");

    const handlePeriodChange = (period: any) => {
        if (period.type === "month" && period.month && period.year) {
            const months = [
                "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
            ];
            setSelectedPeriod(`${months[parseInt(period.month) - 1]} ${period.year}`);
        } else if (period.type === "custom" && period.startDate && period.endDate) {
            setSelectedPeriod(`${new Date(period.startDate).toLocaleDateString('pt-BR')} - ${new Date(period.endDate).toLocaleDateString('pt-BR')}`);
        }
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h1>
                        <p className="text-gray-600">Visão geral do orçamento empresarial - {selectedPeriod}</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Exportar Relatório
                        </Button>
                        <Button onClick={() => setIsPeriodSelectorOpen(true)}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Período
                        </Button>
                    </div>
                </div>

                {/* Cards de Indicadores */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Funcionários</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">127</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+2%</span> em relação ao mês anterior
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orçamento Anual</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ 429.788,30</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-blue-600">8,27%</span> variação ano anterior
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Realizado vs Orçado</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">96,8%</div>
                            <p className="text-xs text-muted-foreground">
                                Meta: 95% | <span className="text-green-600">Dentro do esperado</span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendências</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">8</div>
                            <p className="text-xs text-muted-foreground">
                                Justificativas aguardando aprovação
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráficos e Dados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BudgetChart />
                    <EmployeeChart />
                </div>

                {/* Comparação Mensal */}
                <MonthlyComparison />

                {/* Alertas e Notificações */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                            Alertas e Notificações
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-yellow-800">Variação significativa detectada</p>
                                    <p className="text-sm text-yellow-700">Manutenção Elétrica apresentou variação de +15% em dezembro. Justificativa pendente.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-green-800">Meta atingida</p>
                                    <p className="text-sm text-green-700">Departamento de Segurança ficou 3% abaixo do orçado em dezembro.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-800">Escala de plantão atualizada</p>
                                    <p className="text-sm text-blue-700">Nova escala para feriados de janeiro 2026 disponível para aprovação.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <PeriodSelector
                    isOpen={isPeriodSelectorOpen}
                    onClose={() => setIsPeriodSelectorOpen(false)}
                    onPeriodChange={handlePeriodChange}
                />
            </div>
        </ProtectedPage>
    );
};