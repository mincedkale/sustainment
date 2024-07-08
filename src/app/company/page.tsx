"use client"

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CompanyGenericData, CompanyControversyData, CompanyEmissionsData, CompanyEsgData, CompanyStockData, CompanyDataAll } from '../types/companyData/types';
import styles from './Company.module.css';
 
const jsxifyLineBreaks = (text: string) => {
    return text && text.split(/\r?\\n/).map((line, index) => {
        if(line.includes('Customers: ')) {
            console.log("YES")
            return <div key={index}><p >{line.split('Customers: ')[0]}</p><p>Customers: {line.split('Customers: ')[1]}</p></div>
        }
        return <p key={index}>{line}</p>
    });
}

export default function Company() {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [genericData, setGenericData] = React.useState<CompanyGenericData | null>(null);
    const [controversyData, setControversyData] = React.useState<CompanyControversyData | null>(null);
    const [emissionsData, setEmissionsData] = React.useState<CompanyEmissionsData | null>(null);
    const [esgData, setEsgData] = React.useState<CompanyEsgData | null>(null);
    const [stockData, setStockData] = React.useState<CompanyStockData | null>(null);

    useEffect(() => {
        const getCompanyData = () => {
            fetch(`/api/company-all-data?id=${id}`).then((response) => {
                return response.json().then((companyData: CompanyDataAll) => {
                    setGenericData(companyData.companyGenericData);
                    setControversyData(companyData.companyControversyData);
                    setEmissionsData(companyData.companyEmissionsData);
                    setEsgData(companyData.companyEsgData);
                    setStockData(companyData.companyStockData);
                });
            });
        }
        getCompanyData();
    }, [])

    return (
        <div>
            <div>
                {genericData && controversyData && emissionsData && esgData && stockData ? (
                    <div>
                        <div className={styles.infoContainer}>
                            <div className={styles.generalDataContainer}>
                                <div className={styles.generalData}>
                                    <div>
                                        <h1>{jsxifyLineBreaks(genericData.company_name)}</h1>
                                        <p>{jsxifyLineBreaks(genericData.stock_ticker)}</p>
                                        {jsxifyLineBreaks(`Industry: ${genericData.description}`)}
                                    </div>
                                    <div>
                                        <h2>Stock Data</h2>
                                        Current ask: {stockData.ask}
                                        <br/>Market cap: {stockData.market_cap}
                                        <br/>Volume traded today: {stockData.volume}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.esgDataContainer}>
                                <div className={styles.esgData}>
                                    <h1>ESG Profile</h1>
                                    <div>
                                        <h2>Controversy Data</h2>
                                        <p>{jsxifyLineBreaks(controversyData.environment)}</p>
                                        <p>{jsxifyLineBreaks(controversyData.governance)}</p>
                                        <p>{jsxifyLineBreaks(controversyData.social)}</p>
                                    </div>
                                    <div>
                                        <h2>Emissions Data</h2>
                                        <p>{jsxifyLineBreaks(emissionsData.questions)}</p>
                                        <p>{jsxifyLineBreaks(emissionsData.alignment)}</p>
                                    </div>
                                    <div>
                                        <h2>ESG Data</h2>
                                        <p>{jsxifyLineBreaks(esgData.leader)}</p>
                                        <p>{jsxifyLineBreaks(esgData.average)}</p>
                                        <p>{jsxifyLineBreaks(esgData.esg_curr)}</p>
                                        <p>{jsxifyLineBreaks(esgData.laggard)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};