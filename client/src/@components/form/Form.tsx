import styles from './Form.module.scss';
import React, { ReactElement } from 'react';

interface Props extends React.HTMLProps<HTMLFormElement> {
  children: ReactElement,
  onSubmit: React.FormEventHandler,
  edited?: boolean,
  loading?: boolean,
  width?: number
  button?: boolean,
  buttonClr?: "main" | "blue" | "dark" | "none"
}

const Form = ({onSubmit, children, loading, edited = true, button=true, width, buttonClr, ...props}: Props) => {
  return (
    <form {...props} className={styles.container} onSubmit={onSubmit} style={{"width": `${width}px`}}>

      {children}

      {loading && <section className={styles.loading}/> }
      
      {button && !loading && edited && <button className={`${styles.button} ${styles[buttonClr || "none"]}`}> &#x2192; </button> }

    </form>
  )
}

export default Form