import {useState} from 'react';

const useOpen = <T>(initialState?: T) => {

    const [open, setOpen] = useState(false);

    const [openValue, setOpenValue] = useState<T | null>(initialState || null);

    const [openItems, setOpenItems] = useState<any[]>([initialState]);

    const onOpen = () => setOpen(!open);

    const onOpenValue = (value:T, change=false) => {
        if((value === openValue) && !change) return setOpenValue(null);
        setOpenValue(value);
    };

    const onOpenItems = (value: string) => {
        const isOpen = openItems.includes(value);
        if(isOpen) {
            const newOpen = openItems.filter(el => el !== value);
            setOpenItems(newOpen);
        } else {
            setOpenItems((state) => [...state, value])
        }
    };

    const onOpenItemsClear = () => {
        setOpenItems([]);
    };

    return {
        setOpen,
        onOpen,
        open,
        openValue,
        onOpenValue,
        setOpenValue,
        openItems,
        setOpenItems,
        onOpenItems,
        onOpenItemsClear
    }
};

export default useOpen;