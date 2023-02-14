import styles from './SameLine.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  color?: "dark",
  label1?: string | number, 
  error?: boolean,
  borderBottom?: boolean
};

const SameLine = ({color, label1, error, borderBottom, ...props}:Props) => {
  return (
    <div className={styles.container}>

        <label className={styles.single}> {label1} </label>

        <div className={styles.wrapper}>
            {error && <small className={styles.erorr}>{"*"}</small>}
            <input {...props} className={`${styles[color ? color : "plain"]} ${borderBottom ? styles.borderBottom : styles.border}` } />
        </div>

    </div>
  )
}

export default SameLine