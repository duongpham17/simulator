import styles from './Input.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    color?: "dark",
    label1?: string | number, 
    label2?: string | number | React.ReactNode,
    error?: boolean,
    borderBottom?: boolean
};

const Input = ({color, label1, label2, error, borderBottom, ...props}:Props) => {
    
  return (
    <div className={styles.container}>

        {label1 && !label2 && 
            <label className={styles.single}>
                <span>{label1}</span>
            </label>
        }

        {label1 && label2 && 
            <label className={styles.double}> 
                <span>{label1}</span>
                {error ? <small className={styles.error}>{label2}</small> : <small>{label2}</small>}
            </label>
        }

        <input {...props} className={`${styles[color ? color : "plain"]} ${borderBottom ? styles.borderBottom : styles.border}` } />

    </div>
  )
}

export default Input