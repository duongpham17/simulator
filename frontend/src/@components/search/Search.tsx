import styles from './Search.module.scss';
import React, {useState, ReactNode} from 'react';
import {AiOutlineSearch} from 'react-icons/ai';
import {MdClose} from 'react-icons/md';

interface Props<T>{
  initialData: T[] | string[],
  dataKey: string,
  placeholder?: string, 
  children: (results: T[] | string[]) => ReactNode,
};

export const Search = <T,>({initialData, children, dataKey, placeholder}: Props<T>) => {

  const [value, setValue] = useState("");

  const [results, setResults] = useState<T[] | string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const {value} = e.target;
    setValue(value);
    if(!dataKey) {
      const data = initialData as string[];
      setResults(data.filter((el: string) => el.toLowerCase().includes(value)));
    }
    if(dataKey) {
      const data = initialData as T[];
      setResults(data.filter((el: any) => el[dataKey].toLowerCase().includes(value)));
    }
  };

  const onClose = () => {
    setValue("");
    setResults(initialData);
  };

  return (
    <div className={styles.container}>

      <div className={styles.searchbar}>
        <AiOutlineSearch className={styles.searchIcon} />
        <input placeholder={placeholder || "Search"} name="value" value={value} onChange={onChange} />
        {value && <MdClose className={styles.closeIcon} onClick={onClose} />}
      </div>

      { children(results) }
    </div>
  )
}

export default Search