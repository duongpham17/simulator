import React from 'react';

import Strategies from '@redux/actions/strategies';
import { useAppDispatch } from '@redux/hooks/useRedux';
import { IStrategies } from '@redux/types/strategies';
import useForm from '@hooks/useForm';

import strategies_data from '@data/strategies';
import validation from '@validations/trading';

import Button from '@components/buttons/Button';
import SameLine from '@components/inputs/SameLine';
import Select from '@components/select/Select';
import List from '@components/select/List';

import {MdKeyboardArrowRight} from 'react-icons/md';

interface Props {
    data: IStrategies,
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}

const Edit = ({data, setIsEdit}: Props) => {

    const dispatch = useAppDispatch();

    const {values, onChange, onSubmit, loading, errors, edited, onSetValue} = useForm(data, callback, validation, true);

    async function callback(){
        await dispatch(Strategies.update(values));
        setIsEdit(false);
    };

    return (
        <form onSubmit={onSubmit}>
            <Select label1="Trading strategy" items={strategies_data} selected={values.strategy}>
            {(strategies) => 
                strategies.map((el, i) => 
                <List key={i} value={el.name} hover={el.description} onClick={() => onSetValue({strategy: el.name})} />  
            )}
            </Select>

            <SameLine label1="Name" name="name" value={values.name} onChange={onChange} error={errors.name} />
            
            <SameLine label1="Long at price difference" name="long" value={values.long} onChange={onChange}/>
            <SameLine label1="Short at price difference" name="short" value={values.short} onChange={onChange}/>

            <SameLine label1="Stop loss difference" name="stop_loss" value={values.stop_loss} onChange={onChange} />
            <SameLine label1="Trailing take profit difference" name="trailing_take_profit" value={values.trailing_take_profit} onChange={onChange}/>

            {edited && <Button label1="Update" label2={<MdKeyboardArrowRight/>} color="blue" loading={loading} />}
        </form>
    )
}

export default Edit