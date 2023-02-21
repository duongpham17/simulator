import styles from './Flyingdots.module.scss';

interface Props{
    color?: string
}

const Flyingdots = ({color}: Props) => {
  return (
    <span style={{color: color || ""}} className={styles.loader} ></span>
  )
}

export default Flyingdots