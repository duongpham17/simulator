import styles from './ButtonList.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label1: string | React.ReactNode;
    label2?: string | React.ReactNode;
    color?: "dark" | "bright" | "red" | "light",
};

const ButtonList = ({label1, label2, color, ...props}: Props) => {

    return (
        <div className={styles.container}>
            <button {...props} className={styles[color ? color : "default"]}>

                { label1 && !label2 && 
                    <p className={styles.single}>  
                        <span>{label1}</span>
                    </p>
                }

                { label1 && label2 && 
                    <p className={styles.double}>  
                        <span>{label1}</span>
                        <span>{label2}</span>
                    </p> 
                }

            </button>   
        </div>
    )
}

export default ButtonList