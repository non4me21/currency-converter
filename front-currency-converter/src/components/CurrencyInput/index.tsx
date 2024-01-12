import React, { useEffect, useState } from 'react'
import './styles.css'


interface InputOwnProps {
    currency: string;
    value: string;
    changeCallback: (value: string, currency: string) => void;
    currencies: string[];
    valid: boolean;
}

const CurrencyInput: React.FC<InputOwnProps> = (props) => {
    const [value, setValue] = useState<string>(props.value);
    const [currency, setCurrency] = useState<string>(props.currency);

    const options = props.currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)

    useEffect(() => {
        props.changeCallback(value, currency)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, currency])

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrency(e.target.value)
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return <div className={`currency-input ${props.valid ? '' : 'warning'}`}>
        <input
        className='currency-text'
        type='text'
        onChange={handleInputChange}
        value={value}
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

export default CurrencyInput