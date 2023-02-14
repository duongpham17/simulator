import styles from './Flex.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode,
  flex?: "between" | "evenly" | "around" | "center" | "default",
  sticky?: boolean,
  fixed?: "bottom" | "top" | null,
  center?: boolean,
  padding?: {
    top?: number,
    bottom?: number,
    right?: number,
    left?: number
  },
}

const Flex = ({children, flex, sticky, fixed, center, padding, ...props}: Props) => {
  
  const check = (flex_type: Props["flex"] = "between") => {
    if(flex_type === "evenly") return styles.evenly;
    if(flex_type === "around") return styles.around;
    if(flex_type === "between") return styles.between
    if(flex_type === "center") return styles.center
  }

  return (
    <div className={`${styles.container} ${center ? styles.centerItems : "default"} ${check(flex)} ${sticky && styles.sticky} ${fixed && styles[`fixed-${fixed}`]}`} 
      style={{"paddingTop": `${padding?.top}px`, "paddingBottom": `${padding?.bottom}px`, "paddingLeft": `${padding?.left}px`, "paddingRight": `${padding?.right}px`}} 
      {...props}>
      {children}
    </div>
  )
}

export default Flex