import { CompanyGenericData, CompanyControversyData, CompanyEmissionsData, CompanyEsgData, CompanyStockData, CompanyDataAll } from "@/app/types/companyData/types";
import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    const sql = process.env.DATABASE_URL && postgres(process.env.DATABASE_URL, {ssl: 'require'});
    if (!sql) {
        throw new Error('DATABASE_URL is not set OR query is empty');
    }

    const [
        company_data_generic,
        company_controversy_data,
        company_emissions_data,
        company_esg_data,
        company_stock_data
    ] = await Promise.all([
        sql<CompanyGenericData[]>`SELECT * FROM company_data_generic WHERE id = ${id}`,
        sql<CompanyControversyData[]>`SELECT * FROM company_data_controversy WHERE id = ${id}`,
        sql<CompanyEmissionsData[]>`SELECT * FROM company_data_emissions WHERE id = ${id}`,
        sql<CompanyEsgData[]>`SELECT * FROM company_data_esg WHERE id = ${id}`,
        sql<CompanyStockData[]>`SELECT * FROM company_data_stock WHERE id = ${id}`
    ]);

    const company_data_all: CompanyDataAll = {
        companyGenericData: company_data_generic[0],
        companyControversyData: company_controversy_data[0],
        companyEmissionsData: company_emissions_data[0],
        companyEsgData: company_esg_data[0],
        companyStockData: company_stock_data[0]
    };

    return NextResponse.json(company_data_all);
}