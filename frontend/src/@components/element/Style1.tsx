import styles from './Style1.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  selected?: boolean,
  loading?: boolean,
  border?: boolean, 
  pointer?: boolean
};

const Style1 = ({children, selected=false, border=false, pointer=false, loading, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${selected ? styles.selected : "default"} ${border ? styles.border : "default"} ${pointer ? styles.pointer : "default"} ${loading ? styles.loading : "default"}`} {...props}>
      {children}
    </div>
  )
}

export default Style1