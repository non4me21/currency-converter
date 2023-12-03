import React, { useEffect, useState } from 'react'
import './styles.css'

interface CurrencyOutputOwnProps {
    value: string;
    currency: string;
    currencies: string[];
    changeCallback: (currency: string) => void;
}

const CurrencyOutput: React.FC<CurrencyOutputOwnProps> = (props) => {

    const [currency, setCurrency] = useState<string>(props.currency);

    useEffect(() => {
        if (currency !== props.currency) {
            props.changeCallback(currency);
        } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency])

    const options = props.currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value)
    }

    return <div className='currency-output'>
        <input
            className='currency-text'
            type='text'
            value={props.value}
            readOnly={true}
            />
        <select
        className='currency-select'
        onChange={handleSelectChange}
        value={currency}
        >
            {options}
        </select>
    </div>
}

export default CurrencyOutput