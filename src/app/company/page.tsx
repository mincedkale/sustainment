"use client"

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CompanyGenericData, CompanyControversyData, CompanyEmissionsData, CompanyEsgData, CompanyStockData, CompanyDataAll } from '../types/companyData/types';
import styles from './Company.module.css';

const jsxifyLineBreaks = (text: string) => {
    return text && text.split(/\r?\\n/).map((line, index) => {
        if(line.includes('Customers: ')) {
            return <div key={index}><p>{line.split('Customers: ')[0]}</p>
            <p >Customers: {line.split('Customers: ')[1]}</p></div>
        }
        return <p key={index}>{line}</p>
    });
}
 
const jsxifyLineBreaksControversy = (text: string) => {
    return text && text.split(/\r?\\n/).map((line, index) => {
        let colour = 'black';
        line.includes('Green') && (colour = 'green');
        line.includes('Yellow') && (colour = 'yellow');
        line.includes('Orange') && (colour = 'orange');
        line.includes('Red') && (colour = 'red');
        let fontWeight = 'bold';
        colour === 'black' && (fontWeight = 'normal');
        if(line.includes('Customers: ')) {
            let color1 = 'black';
            let color2= 'black';
            line.split('Customers: ')[0].includes('Green') && (color1 = 'green');
            line.split('Customers: ')[0].includes('Yellow') && (color1 = 'yellow');
            line.split('Customers: ')[0].includes('Orange') && (color1 = 'orange');
            line.split('Customers: ')[0].includes('Red') && (color1 = 'red');
            line.split('Customers: ')[1].includes('Green') && (color2 = 'green');
            line.split('Customers: ')[1].includes('Yellow') && (color2 = 'yellow');
            line.split('Customers: ')[1].includes('Orange') && (color2 = 'orange');
            line.split('Customers: ')[1].includes('Red') && (color2 = 'red');
            return <div key={index} style={{ color: color1, fontWeight: 'bold'  }}><p>{line.split('Customers: ')[0]}</p>
            <p style={{ color: color2, fontWeight: 'bold'  }} >Customers: {line.split('Customers: ')[1]}</p></div>
        }
        return <p key={index} style={{ color: colour, fontWeight: 'bold' }}>{line}</p>
    });
}

const jsxifyLineBreaksEmissions = (text: string) => {
    return text && text.split(/\r?\\n/).map((line, index) => {
        let colour = 'black';
        line.endsWith('YES') && (colour = 'green');
        line.endsWith('NO') && (colour = 'red');
        line.endsWith('MISALIGNED') && (colour = 'red');
        return <p key={index} style={{ color: colour, fontWeight: 'bold' }}>{line}</p>
    });
}

const jsxifyLineBreaksESG = (text: string) => {
    return text && text.split(/\r?\\n/).map((line, index) => {
        let colour = 'black';
        line.startsWith('Leader') && (colour = 'green');
        line.startsWith('Average') && (colour = 'yellow');
        line.startsWith('Very poor') && (colour = 'red');
        return <p key={index} style={{ color: colour, fontWeight: 'bold' }}>{line}</p>
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

    const handleTradeClick = (tradeType: string) => {
        if (genericData) {
            window.location.href = `/trade?id=${genericData.id}&type=${tradeType}`;
        } else {
            console.error('No company data to trade');
        }
    }

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
                                    <br/>
                                    <div>
                                        <button className={styles.bullSellButtons} onClick={() => handleTradeClick('buy')}> Buy </button>
                                        <button className={styles.bullSellButtons} onClick={() => handleTradeClick('sell')}> Sell </button>
                                    </div>
                                    
                                    <br/>
                                    <img className={styles.graph} src='https://www.amcharts.com/wp-content/uploads/2019/10/demo_14592_none-11-1024x690.png' ></img>
                                </div>
                            </div>
                            <div className={styles.esgDataContainer}>
                                <div className={styles.esgData}>
                                    <h1>ESG Profile</h1>
                                    <h2>{jsxifyLineBreaksEmissions(`Current ESG Grade: ${esgData.esg_curr.toUpperCase()}`)}</h2>
                                    <div>
                                        <h2>Controversy Data</h2>
                                        <p>{jsxifyLineBreaksControversy(controversyData.environment)}</p>
                                        <p>{jsxifyLineBreaksControversy(controversyData.governance)}</p>
                                        <p>{jsxifyLineBreaksControversy(controversyData.social)}</p>
                                    </div>
                                    <div>
                                        <h2>Emissions Data</h2>
                                        <p>{jsxifyLineBreaksEmissions(emissionsData.questions)}</p>
                                        <p>{jsxifyLineBreaksEmissions(emissionsData.alignment)}</p>
                                    </div>
                                    <div>
                                        <h2>ESG Data</h2>
                                        <p>{jsxifyLineBreaksESG(`Leader in: ${esgData.leader}`)}</p>
                                        <p>{jsxifyLineBreaksESG(`Average in: ${esgData.average}`)}</p>
                                        <p>{jsxifyLineBreaksESG(`Very poor in: ${esgData.laggard}`)}</p>
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