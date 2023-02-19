import {useContext} from 'react';
import {Context} from 'themes';
import {MdNightlight, MdWbSunny} from 'react-icons/md';
import LinksContainer from '@components/link/Style1'

const Theme = () => {

    const {onSetTheme, theme} = useContext(Context);

    const data = [{
        name: theme.name === "light" ?<MdWbSunny/> : <MdNightlight/>,
        to: "",
        button: true,
        onClick: theme.name === "light" ? () => onSetTheme({name: "night", background: "black"}) : () => onSetTheme({name: "light", background: "white"})
    }]

    return ( <LinksContainer data={data} /> )
}

export default Theme