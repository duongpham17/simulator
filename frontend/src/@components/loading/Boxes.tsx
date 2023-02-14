import styles from './Boxes.module.scss';

const Loading = () => {
  return (
    <div className={styles.container}>
        <div className={styles.loader}>
            <div className={styles.square}></div>
            <div className={styles.square} ></div>
            <div className={`${styles.square} ${styles.last}`} ></div>
            <div className={`${styles.square} ${styles.clear}`} ></div>
            <div className={styles.square} ></div>
            <div className={`${styles.square} ${styles.last}`} ></div>
            <div className={`${styles.square} ${styles.clear}`} ></div>
            <div className={styles.square} ></div>
            <div className={`${styles.square} ${styles.last}`} ></div>
        </div>
    </div>
  )
}

export default Loading