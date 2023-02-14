import styles from './Style3.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  selected?: boolean,
  border?: boolean, 
  pointer?: boolean
};

const Style2 = ({children, selected=false, border=false, pointer=false, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${selected ? styles.selected : "default"} ${border ? styles.border : "default"} ${pointer ? styles.pointer : "default"}`} {...props}>
      {children}
    </div>
  )
}

export default Style2