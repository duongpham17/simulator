import styles from './Style1.module.scss';

interface Props{
  children: React.ReactNode,
  onClose?: CallableFunction
};

const Style1 = ({children, onClose}: Props) => {
  return (
    <div className={styles.container} onClick={() => onClose && onClose()}>
        <div className={styles.content} onClick={e => e.stopPropagation()}>
          {children}
        </div>
    </div>
  )
}

export default Style1