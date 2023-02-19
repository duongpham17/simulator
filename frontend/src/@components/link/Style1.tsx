import styles from  './Style1.module.scss';
import {Link} from 'react-router-dom';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    name: React.ReactNode | string,
    to: string,
    selected?: boolean,
    button?: boolean,
    onClick?: any,
  }[]
}

const Style1 = ({data, ...props}: Props) => {
  return (
    <div {...props} className={styles.container} >
      {data.map((el, index) => 
        el.button 
          ? <button className={el.selected ? styles.selected : ""} key={index} onClick={() => el.onClick && el.onClick()}>{el.name}</button> 
          : <Link className={el.selected ? styles.selected : ""} key={index} to={el.to}>{el.name}</Link>
      )}
    </div>
  )
}

export default Style1