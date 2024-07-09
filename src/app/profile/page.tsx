import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

type Stock = {
    symbol: string;
    quantity: number;
    price: number;
};

export default function Profile() {
    // Fake stock portfolio data
    const stockPortfolio: Stock[] = [
        { symbol: 'AAPL', quantity: 10, price: 150.25 },
        { symbol: 'GOOGL', quantity: 5, price: 2500.75 },
        { symbol: 'AMZN', quantity: 3, price: 3500.50 },
    ];

    return (
        <div>
            <h1>Stock Portfolio (this page is still in development)</h1>
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {stockPortfolio.map((stock, index) => (
                        <tr key={index}>
                            <td>{stock.symbol}</td>
                            <td>{stock.quantity}</td>
                            <td>{stock.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};