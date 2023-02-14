import {useContext} from 'react';
import {Context} from 'themes';
import {MdNightlight, MdWbSunny} from 'react-icons/md';

const Theme = () => {

    const {onSetTheme, theme} = useContext(Context)

    return (
        <>
            {theme.name === "light" && 
                <button onClick={() => onSetTheme({name: "night", background: "black"})}>
                    <MdWbSunny/>
                </button>
            }
            {theme.name === "night" && 
                <button onClick={() => onSetTheme({name: "light", background: "white"})}>
                    <MdNightlight/>
                </button>
            }
        </>
    )
}

export default Theme