import styles from './Style1.module.scss';
import React, {useState} from 'react';
import {MdKeyboardArrowRight, MdKeyboardArrowLeft} from 'react-icons/md';

interface Props<T> {
    data: T[],
    amount?: number, 
    children: (data: T) => React.ReactNode
}

const Style1 = <T,>({data, amount=10, children}:Props<T>) => {

    const [page, setPage] = useState(1);
    const [items, setItems] = useState(amount);

    const max_pages = Math.ceil(data.length / amount);

    const onPage = (index: number) => () => {
        setPage(index);
        setItems( index === 1 ? amount : (amount * index))
    }

    const onBack = () => {
        if(page === 1) return;
        setPage(page => page - 1);
        setItems(items => items-amount);
    }

    const onNext = () => {
        if(page === max_pages) return;
        setPage(page => page + 1);
        setItems(items => items+amount)
    }

    return (
        <div className={styles.container}>
            {data.slice(page === 1 ? 0 : items - amount, items).map(el => 
                children(el)
            )}
            {max_pages !== 0 && data.length > amount ? <div className={styles.pagination}>
                <button onClick={onBack}><MdKeyboardArrowLeft/></button>

                <button onClick={onPage(1)} className={1 === page ? styles.selected : "default"}>{1}</button>    

                {page !== 1 && Array.from(Array(max_pages).keys()).slice(page, page+1).map((index) => 
                    <button key={index} onClick={onPage(index)} className={index === page ? styles.selected : "default"}>{index}</button>    
                )}

                {page !== max_pages-1 && Array.from(Array(max_pages).keys()).slice(page, page+1).map((index) => 
                    <button key={index} onClick={onPage(index+1)} className={index+1 === page ? styles.selected : "default"}>{index+1}</button>    
                )}

                <button onClick={onPage(max_pages)} className={max_pages === page ? styles.selected : "default"}>{max_pages}</button>    

                <button onClick={onNext}><MdKeyboardArrowRight/></button>
            </div> : null }
        </div>
    )
}

export default Style1