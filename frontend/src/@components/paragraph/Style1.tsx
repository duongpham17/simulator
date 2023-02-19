import styles from './Style1.module.scss';

interface Props{
    text: string,
    light?: boolean,
    size?: number,
    weight?: number,
}

const Style1 = ({text, size, weight, light}: Props) => {
  return (
    <p className={`${styles.container} ${light ? styles.light : ""}`} style={{"fontSize": `${size}px`, "fontWeight": `${weight}`}} >
        {text}
    </p>
  )
}

export default Style1