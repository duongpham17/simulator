import './Themes.scss';
import {createContext, ReactNode, useLayoutEffect, useState} from 'react';
import {localSet, localGet} from '@utils/localstorage';
import {ThemeTypes} from './ThemesData';

export interface PropsTypes {
    theme: ThemeTypes,
    onSetTheme: (theme: ThemeTypes) => void,
};

// for consuming in children components, initial state
export const Context = createContext<PropsTypes>({
    theme: {
        name: "light",
        background: "white",
    },
    onSetTheme: () => null
});

// Provider in your app
export const Theme = ({children}: {children: ReactNode}) => {

    const theme_default = {theme: "light", background: "white"};

    const theme_saved: ThemeTypes = localGet("theme");

    const theme_selected = theme_saved || theme_default;

    const [theme, setTheme] = useState<ThemeTypes>(theme_selected)

    useLayoutEffect(() => { document.body.style.background = theme.background }, [theme]);

    const onSetTheme = (theme: ThemeTypes) => {
        localSet("theme", theme);
        setTheme(theme);
    };

    const value: PropsTypes = {
        theme,
        onSetTheme,
    };
  
    return (
        <Context.Provider value={value}>
            <div className={`theme-${theme.name}`}>
                {children}
            </div>
        </Context.Provider>
    )
};

export default Theme