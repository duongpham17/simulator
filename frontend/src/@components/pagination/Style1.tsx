import styles from './Style1.module.scss';
import React, {useState} from 'react';
import {MdKeyboardArrowRight, MdKeyboardArrowLeft} from 'react-icons/md';

interface Props<T> {
    data: T[],
    show?: number, 
    children: (data: T) => React.ReactNode
}

const Style1 = <T,>({data, show=10, children}:Props<T>) => {

    const [page, setPage] = useState(1);
    const [items, setItems] = useState(show);

    const max_pages = Math.ceil(data.length / show);

    const onPage = (index: number) => () => {
        setPage(index);
        setItems( index === 1 ? show : (show * index))
    }

    const onBack = () => {
        if(page === 1) return;
        setPage(page => page - 1);
        setItems(items => items-show);
    }

    const onNext = () => {
        if(page === max_pages) return;
        setPage(page => page + 1);
        setItems(items => items+show)
    }

    return (
        <div className={styles.container}>
            {data.slice(page === 1 ? 0 : items - show, items).map(el => 
                children(el)
            )}
            {max_pages !== 0 && data.length > show ? <div className={styles.pagination}>
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