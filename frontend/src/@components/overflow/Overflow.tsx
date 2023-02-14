import styles from './Overflow.module.scss';
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  maxHeight?: number,
  hideScrollBar?: boolean
};

const Overflow = ({children, maxHeight=200, hideScrollBar=false, ...props}: Props) => {
  return (
    <div className={`${styles.container} ${hideScrollBar ? styles.hideScrollBar : ""}`} style={{"maxHeight": `${maxHeight}px`}} {...props}>
      {children}
    </div>
  )
}

export default Overflow