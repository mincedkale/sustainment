"use client";

import styles from './Discover.module.css';
import { useEffect, useState } from 'react';

import { CompanyGenericData } from '../types/companyData/types';
import { useRouter } from 'next/navigation';

async function fetchCompanySearchResults(query: string) {
  const response = await fetch(`/api/company-search-results?query=${query}`);
  return await response.json();
}



export default function Discover() {
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CompanyGenericData[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [recommended, setRecommended] = useState<CompanyGenericData[]>([]);
  const [resultsNumber, setResultsNumber] = useState<number>(5);

  const router = useRouter();

  const handleSearchItemClick = (company: CompanyGenericData) => {
    router.push(`/company?id=${company.id}`);
  }

  const handleSearchBarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }

  const handleSearchEvent: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!searchQuery) return;
    setLoaded(false);
    const getCompanySearchResults = () => {
      fetchCompanySearchResults(searchQuery).then((results) => {
        console.log(results);
        setSearchResults(results);
        setLoaded(true);
        setRecommended([])
      });
    }

    getCompanySearchResults();
  }

  useEffect(() => {
    fetchCompanySearchResults('energy').then((results) => {
      console.log(results);
      setRecommended(results);
      setLoaded(true);
    });
  }, []);


  return (
    <div className={styles.background}>
      <div className={styles.searchContainer}>
        <h2 className={styles.searchTitle}>
          Find the right investment <br/>
          <span className={styles.animatedGreen}>for your world</span>
        </h2>
        <div className={styles.searchBarAndContainer}>
          <form onSubmit={handleSearchEvent}>
            <input placeholder="Search for impact investments" className={styles.searchBar} onChange={handleSearchBarChange}></input>
            <button type='submit' onClick={() => handleSearchEvent} className={styles.searchButton}>→</button>
          </form>          
        </div>
        {
          (loaded && searchResults.length > 0) &&
          (<div className={styles.searchResults}>
              {
                searchResults.slice(0, resultsNumber).map((company: CompanyGenericData) => {
                  return (
                    <div key={company.stock_ticker} className={styles.searchResultItemContainer}>
                      <div className={styles.searchResultItem} onClick={() => {handleSearchItemClick(company)}}>
                        <h3>{company.company_name}</h3>
                        <p>Exchange: ASX <br/>
                          Ticker: {company.stock_ticker} 
                        </p>
                        <p>{company.description}</p>
                      </div>                    
                    </div>
                  );
                })
              }
              <button onClick={() => setResultsNumber(resultsNumber + 5)}>Load more</button>
          </div>)
        }
        {
          (loaded && recommended.length > 0) &&
          (<div className={styles.searchResults}>
            <p>Recommended</p>
              {
                recommended.slice(0, resultsNumber).map((company: CompanyGenericData) => {
                  return (
                    <div key={company.stock_ticker} className={styles.searchResultItemContainer}>
                      <div className={styles.searchResultItem} onClick={() => {handleSearchItemClick(company)}}>
                        <h3>{company.company_name}</h3>
                        <p>Exchange: ASX <br/>
                          Ticker: {company.stock_ticker} 
                        </p>
                        <p>{company.description}</p>
                      </div>                    
                    </div>
                  );
                })
              } 
              <button onClick={() => setResultsNumber(resultsNumber + 5)}>Load more</button>
          </div>)
        }
        {
          !loaded && <div> Loading... </div>
        }
      </div>
    </div>
  );
}