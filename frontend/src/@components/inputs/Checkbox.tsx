import styles from './Checkbox.module.scss';

interface Props {
    label: string,
    value: boolean | undefined | null,
    margin?: boolean,
    background?: "light" | "dark",
    onClick: () => void,
};

const Checkbox = ({label, onClick, value, margin, background}:Props) => {
    
  return (
    <button type="button" className={`${styles.container} ${margin ? styles.margin : ""} ${styles[background || ""]}`} onClick={onClick}>

        <p>{label}</p>

        <span className={`${styles.box} ${value ? styles.selected : ""}`} />

    </button>
  )
}

export default Checkbox