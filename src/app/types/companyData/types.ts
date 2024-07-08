export interface CompanyGenericData {
    company_name: string;
    stock_ticker: string;
    description: string;
    id: number;
}

export interface CompanyStockData {
    previous_close_price: number;
    open_price: number;
    bid: number;
    ask: number;
    day_range: string;
    year_range: string;
    volume: number;
    market_cap: number;
    beta: number;
    pe_ratio: number;
    eps: number;
    earnings_date: string;
    foward_dividend: number;
    exdividend_date: string;
    target_est: number;
    id: number;
}

export interface CompanyEsgData {
    esg_curr: string;
    id: number;
    laggard: string;
    average: string;
    leader: string;
}

export interface CompanyEmissionsData {
    questions: string;
    alignment: string;
}

export interface CompanyControversyData {
    environment: string;
    social: string;
    governance: string;
    id: number;
}

export interface CompanyDataAll {
    companyGenericData: CompanyGenericData;
    companyStockData: CompanyStockData;
    companyEsgData: CompanyEsgData;
    companyEmissionsData: CompanyEmissionsData;
    companyControversyData: CompanyControversyData;
}