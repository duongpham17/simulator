import styles from './Checkbox.module.scss';

interface Props {
    label: string,
    value: boolean | undefined | null,
    margin?: boolean,
    onClick: () => void,
};

const Checkbox = ({label, onClick, value, margin}:Props) => {
    
  return (
    <button type="button" className={`${styles.container} ${margin ? styles.margin : ""}`} onClick={onClick}>

        <p>{label}</p>

        <span className={`${styles.box} ${value ? styles.selected : ""}`} />

    </button>
  )
}

export default Checkbox