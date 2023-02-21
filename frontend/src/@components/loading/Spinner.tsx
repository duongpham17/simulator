import styles from './Spinner.module.scss';

interface Props {
  size: 10 | 15 | 20 | 30 | 40 | 50 | 60,
  color?: "white",
  center?: boolean 
}

const Spinner = ({size, color, center=false}:Props) => {
  return (
    <span className={`${styles[`loading${size || 20}`]} ${center ? styles.center : "default"} ${styles[color ? color : ""]}`} />
  )
}

export default Spinner