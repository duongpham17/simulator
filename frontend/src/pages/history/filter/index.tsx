import React, { useContext, SetStateAction, useState } from 'react';
import { IOrders } from '@redux/types/orders';
import { Context } from 'context/useOrders';

import Container from '@components/container/Style1';
import Checkbox from '@components/buttons/Checkbox';
import Grid from '@components/grid/Style2';
import Overflow from '@components/overflow/Overflow';
import { firstcaps } from '@utils/functions';

interface Props {
    initialOrders: IOrders[],
    orders: IOrders[],
    setOrders: React.Dispatch<SetStateAction<IOrders[] | null>>
};

const Filter = ({setOrders, orders, initialOrders}: Props) => {

    const [query, setQuery] = useState({
        market_id: "",
        filter: "",
        sort: "",
    });
    const check = (q: "filter" | "sort" | "market_id", selected: string) => query[q] === selected;

    const sort_values = ["highest", "lowest", "newest", "oldest"];
    const filter_values = ["profit", "loss", "sell", "buy"];
    const market_ids_values = [...new Set(initialOrders.map(el => el.market_id))].sort();

    const sort = (s: string, data: IOrders[]):IOrders[] => {
        if(s === "highest") data = data.sort((a, b) => Number(a.profit_loss) - Number(b.profit_loss));
        if(s === "lowest")  data = data.sort((a, b) => Number(b.profit_loss) -  Number(a.profit_loss));
        if(s === "newest")         data = data.sort((a, b) => Date.parse(a.closed_at_date as any) - Date.parse(b.closed_at_date as any));
        if(s === "oldest")         data = data.sort((a, b) => Date.parse(b.closed_at_date as any) - Date.parse(a.closed_at_date as any));
        return data;
    };

    const filter = (q: string, data: IOrders[]): IOrders[] => {
        if(q === "loss")    data = data.filter(el => 0 > el.profit_loss);
        if(q === "profit")  data = data.filter(el => el.profit_loss > 0);
        if(q === "sell")    data = data.filter(el => el.side === "sell");
        if(q === "buy")     data = data.filter(el => el.side === "buy");
        return data;
    };

    const onFilter = (q: string) => {
        const query_marketIds = market_ids_values.includes(q) ? q === query.market_id ? "" : q : query.market_id;

        const query_filter = filter_values.includes(q) ? q === query.filter ? "" : q : query.filter;

        let data = query_marketIds ? initialOrders.filter(el => el.market_id === query_marketIds) : [...initialOrders];

        data = filter(query_filter, data);

        data = sort(query.sort, data);

        setQuery(state => ({...state, filter: query_filter, market_id: query_marketIds}));

        setOrders(data);
    };

    const onSort = (q: string) => {
        const isSelected = query.sort === q;
        if(isSelected) return;
        setOrders(sort(q, [...orders]));
        setQuery(state => ({...state, sort: q}));
    };

    return (
        <Grid columns='1fr 1fr 1fr' margin="0.5rem 0">

            <Container background="dark">
                <Overflow maxHeight={75} hideScrollBar>
                    {market_ids_values.map((el) => 
                        <Checkbox key={el} name={el.toLowerCase()} selected={check("market_id", el)} onClick={() => onFilter(el)} /> 
                    )}
                </Overflow>
            </Container>

            <Container background="dark">
                {filter_values.map((el) => 
                    <Checkbox key={el} name={firstcaps(el)} selected={check("filter", el)} onClick={() => onFilter(el)} /> 
                )}
            </Container>

            <Container background="dark">
                {sort_values.map((el) => 
                    <Checkbox key={el} name={firstcaps(el)} selected={check("sort", el)} onClick={() => onSort(el)} /> 
                )}
            </Container>

        </Grid>
    )
}

const Index = () => {
    const {orders, setOrders, initialOrders} = useContext(Context);
    return ( orders && initialOrders && <Filter orders={orders} setOrders={setOrders} initialOrders={initialOrders} /> )
};

export default Index