import React, { useContext, SetStateAction, useState } from 'react';
import { IOrders } from '@redux/types/orders';
import { Context } from 'context/useOrders';

import Container from '@components/container/Style1';
import Checkbox from '@components/buttons/Checkbox';
import Flex from '@components/flex/Flex';

const Index = () => {
    const {orders, setOrders, initialOrders} = useContext(Context);
    return ( 
        orders && initialOrders && <Filter orders={orders} setOrders={setOrders} initialOrders={initialOrders} /> 
    )
};

interface Props {
    initialOrders: IOrders[],
    orders: IOrders[],
    setOrders: React.Dispatch<SetStateAction<IOrders[] | null>>
};

const Filter = ({setOrders, orders, initialOrders}: Props) => {

    const [query, setQuery] = useState({
        filter: "",
        sort: "",
    });

    const sort = (s: string, data: IOrders[]):IOrders[] => {
        if(s === "highest profit") data = data.sort((a, b) => Number(a.profit_loss) - Number(b.profit_loss));
        if(s === "lowest profit")  data = data.sort((a, b) => Number(b.profit_loss) -  Number(a.profit_loss));
        if(s === "newest")         data = data.sort((a, b) => Date.parse(a.closed_at_date as any) - Date.parse(b.closed_at_date as any));
        if(s === "oldest")         data = data.sort((a, b) => Date.parse(b.closed_at_date as any) - Date.parse(a.closed_at_date as any));
        return data;
    }

    const filter = (q: string, data: IOrders[]): IOrders[] => {
        if(q === "loss")    data = data.filter(el => 0 > el.profit_loss);
        if(q === "profit")  data = data.filter(el => el.profit_loss > 0);
        if(q === "sell")    data = data.filter(el => el.side === "sell");
        if(q === "buy")     data = data.filter(el => el.side === "buy");
        return data;
    }

    const onFilter = (q: string) => {
        const off = query.filter === q;

        let data = [...initialOrders];

        if(off) data = sort(query.sort, data);

        if(!off){
            data = filter(q, data);
            data = sort(query.sort, data);
        }

        setQuery(state => ({...state, filter: state.filter ? "" : q}));
        setOrders(data);
    };

    const onSort = (q: string) => {
        const off = query.sort === q;
        if(off) return;
        let data = [...orders];
        data = sort(q, data);
        setOrders(data);
        setQuery(state => ({...state, sort: q}));

    };

    const check = (q: "filter" | "sort", selected: string) => query[q] === selected;

    return (
        <Flex style={{"marginBottom": "0.5rem"}}>
            <Container background="dark">
                <Checkbox name="Profit" selected={check("filter", "profit")} onClick={() => onFilter("profit")} /> 
                <Checkbox name="Loss"   selected={check("filter", "loss")} onClick={() => onFilter("loss")} /> 
                <Checkbox name="Sell"   selected={check("filter", "sell")} onClick={() => onFilter("sell")} /> 
                <Checkbox name="Buy"    selected={check("filter", "buy")} onClick={() => onFilter("buy")} /> 
            </Container>
            <Container background="dark">
                <Checkbox name="Highest profit" selected={check("sort", "highest profit")}  onClick={() => onSort("highest profit")} /> 
                <Checkbox name="Lowest profit"  selected={check("sort", "lowest profit")}  onClick={() => onSort("lowest profit")} /> 
                <Checkbox name="Newest"         selected={check("sort", "newest")}  onClick={() => onSort("newest")} /> 
                <Checkbox name="Oldest"         selected={check("sort", "oldest")}  onClick={() => onSort("oldest")} /> 
            </Container>
        </Flex>
    )
}

export default Index