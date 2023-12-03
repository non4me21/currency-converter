import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyInput from '../components/CurrencyInput';
import CurrencyOutput from '../components/CurrencyOutput';

interface CurrencyData {
  value: string;
  currency: string;
}

const apiUrl = 'http://127.0.0.1:8080/exchange/?'
const defaultToCurrency = 'PLN'
const currencies = ['USD', 'EUR', 'PLN']
const regex = /^[\d.]*$/;

const getData = async (value: string, fromCurrency: string, toCurency: string) => {
  const searchParams = new URLSearchParams({from_curr: fromCurrency, to_curr: toCurency, value});
  const response = await fetch(apiUrl.concat(searchParams.toString()))
  return response
}

const App = () => {

  const [fromData, setFromData] = useState<CurrencyData>({value: '1', currency: 'USD'});
  const [toData, setToData] = useState<CurrencyData>({value: '', currency: defaultToCurrency});
  const [rate, setRate] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isValid, setValid] = useState<boolean>(true);

  const roundToDecimals = (value: number, decimals: number) => Math.round(value * (10 ** decimals)) / (10 ** decimals)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const validationResult = regex.test(fromData.value);
      setValid(validationResult)
      if (fromData.value !== '' && validationResult ) {
        const response = await getData(fromData.value, fromData.currency, toData.currency)
      if (response.status === 200) {
        const data = JSON.parse(await response.text())
        if (data.exchanged_value.toString() !== toData.value)
        setToData({...toData, value: `${roundToDecimals(data.exchanged_value, 2)}`})
        setRate(`${roundToDecimals(data.rate, 3)}`)
      }
      } 
      setLoading(false)
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromData, toData.currency])

  const handleFromChange = (value: string, currency: string) => {setFromData({value, currency})}
  const handleToChange = (currency: string) => {setToData({...toData, currency})}
  return (
    <div className='app-wrapper'>
      <span className='main-text'>Currency Converter</span>
      <div className="App">
        <CurrencyInput 
        value={fromData.value} 
        currency={fromData.currency} 
        currencies={currencies} 
        changeCallback={handleFromChange}
        valid={isValid}
        />
        <div className='rate-info-wrapper'>
        {isLoading ? <div className='loader'/> :
          <span className='rate-info'>{`1 ${fromData.currency} = ${rate ?? ''} ${toData.currency}`}</span>}
        </div>
        <CurrencyOutput
          value={isLoading || fromData.value === '' || !isValid ? '' : toData.value} 
          currency={toData.currency} 
          currencies={currencies} 
          changeCallback={handleToChange}
          />
      </div>
    </div>
  );
}

export default App;
