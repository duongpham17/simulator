import styles from './Warning.module.scss';
import {ReactNode, useState} from 'react';

interface Props {
    onFunction: CallableFunction,
    button: ReactNode | string,
    message?: string,
    loading?: boolean
}

const Warning = ({onFunction, button, message = "Delete", loading}: Props) => {

    const [warning, setWarning] = useState(false);

    const onDelete = async () => {
        await onFunction();
        setWarning(false);
    };
    
    return (
        <div className={styles.container}>

            {!warning && <button onClick={() => setWarning(!warning)}>{button}</button>}

            { warning &&
                <div className={styles.warning}>
                    {!loading ? 
                        <div className={styles.buttons}>
                            <button onClick={() => setWarning(!warning)}> Cancel </button>
                            <button onClick={() => onDelete()}> {message} </button>
                        </div>
                    :
                        <div className='loading' />
                    }
                </div>
            }

        </div>
    )
}

export default Warning