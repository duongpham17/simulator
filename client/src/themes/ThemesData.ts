export interface ThemeTypes {
    name: "light" | "night"
    background: string,
}

export const themesData: ThemeTypes[] = [
    {
        name: "light",
        background: "white",
    },
    {
        name: "night",
        background: "black"
    }
]