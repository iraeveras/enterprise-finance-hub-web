export interface Company {
    id: string;
    cnpj: string;
    corporateName: string;
    tradeName: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface CompanyFormData {
    cnpj: string;
    corporateName: string;
    tradeName: string;
    status: 'active' | 'inactive';
}