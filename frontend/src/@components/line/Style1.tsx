import styles from './Style1.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {

}

const Line1 = ({...props}: Props ) => (
    <div className={styles.container} {...props}/>
)

export default Line1