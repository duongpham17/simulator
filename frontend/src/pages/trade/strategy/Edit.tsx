import React from 'react';

import Strategies from '@redux/actions/strategies';
import { useAppDispatch } from '@redux/hooks/useRedux';
import { IStrategies } from '@redux/types/strategies';
import useForm from '@hooks/useForm';

import strategies_data, { find_side } from '@data/strategies';
import validation from '@validations/trading';

import Button from '@components/buttons/Button';
import Line from '@components/line/Style1';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Checkbox from '@components/inputs/Checkbox';
import Flex from '@components/flex/Flex';
import Input from '@components/inputs/Input';
import Label from '@components/form/Label';
import Form from '@components/form/Form';

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
        <Form onSubmit={onSubmit} button={false}>
            <Line/>

            <Input label1="Name" name="name" value={values.name} onChange={onChange} error={errors.name} />

            <Label label1="Trading strategy" label2={errors.strategy} error />
            <Select label1="Trading strategy" items={strategies_data} selected={values.strategy}>
            {(strategies) =>  
                strategies.map((el, i) => 
                <List key={i} value={el.name} hover={el.description} selected={el.name === values.strategy} onClick={() => onSetValue({strategy: el.name})} />  
            )}
            </Select>

            {find_side(values.strategy) === "both" && 
                <Flex>
                    <Input label1="Long difference" name="long" value={values.long} onChange={onChange}/>
                    <Input label1="Short difference" name="short" value={values.short} onChange={onChange}/>
                </Flex>
            }

            {find_side(values.strategy) === "sell" && 
                <Flex>
                    <Input label1="Short difference" name="short" value={values.short} onChange={onChange}/>
                </Flex>
            }

            {find_side(values.strategy) === "buy" && 
                <Flex>
                    <Input label1="Long difference" name="long" value={values.long} onChange={onChange}/>
                </Flex>
            }

            <Flex>
                <Input label1="Take profit difference" name="take_profit" value={values.take_profit} onChange={onChange}/>
                <Input label1="Stop loss difference" name="stop_loss" value={values.stop_loss} onChange={onChange} />
            </Flex>

            <Flex>
                <Input label1="Reset price snapshot" placeholder='minute' name="reset" value={values.reset} onChange={onChange} />
            </Flex>

            <Checkbox label="Trailing take profit" value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light"/>

            {edited && <Button type="submit" label1="Update" label2={<MdKeyboardArrowRight/>} color="blue" loading={loading} />}
        </Form>
    )
}

export default Edit