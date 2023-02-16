import styles from './Style1.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  selected?: boolean,
  background?: "light" | "dark" | "default",
  noPadding?: boolean, 
  noBorder?: boolean,
  pointer?: boolean,
  margin?: boolean,
};

const Container = ({children, margin, selected, background, noPadding, noBorder, pointer,...props}: Props) => {
  return (
    <div {...props} className={`
          ${styles.container} 
          ${selected?styles.selected:""} 
          ${pointer?styles.pointer:""} 
          ${noPadding?styles.noPadding:""} 
          ${noBorder?styles.noBorder:""} 
          ${styles[background || ""]} 
          ${margin ? styles.margin : ""}
        `} 
      >
      {children}
    </div>
  )
}

export default Container