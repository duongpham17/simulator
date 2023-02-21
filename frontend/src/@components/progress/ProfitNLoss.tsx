import styles from './ProfitNLoss.module.scss';

interface Props {
  value: number
}

const ProfitNLoss = ({value}: Props) => {
  return (
    <div className={styles.container}>
        <progress max="100" value={value} />
    </div>
  )
}

export default ProfitNLoss