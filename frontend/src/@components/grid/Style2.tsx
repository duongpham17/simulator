import styles from './Style2.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  columns?: string,
  margin?: string
};

const Style1 = ({children, columns, margin, ...props}: Props) => {
  return (
    <div className={styles.container} {...props} style={{"gridTemplateColumns": `${columns || "1fr 1fr"}`, margin: margin || "0"}}>
      {children}
    </div>
  )
}

export default Style1