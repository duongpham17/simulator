import styles from './Style1.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  width?: number
};

const Style1 = ({children,width=150,...props}: Props) => {
  return (
    <div className={styles.container} {...props} style={{"gridTemplateColumns": `repeat(auto-fill, minmax(${width}px, 1fr))`}}>
      {children}
    </div>
  )
}

export default Style1