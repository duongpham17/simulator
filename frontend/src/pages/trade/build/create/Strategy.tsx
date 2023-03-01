import { BuildProps } from './@types';

import { IStrategies } from '@redux/types/strategies';
import validation from '@validations/trading';
import strategies_data, { find_side } from '@data/strategies';
import useForm from '@hooks/useForm';

import Input from '@components/inputs/Input';
import Checkbox from '@components/inputs/Checkbox';
import Label from '@components/form/Label';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Form from '@components/form/Form';
import FormSummary from '@components/form/Summary';
import Button from '@components/buttons/Button';

const Strategy = ({addToBuildData, summaryPage, onSummaryPage}: BuildProps) => {
    
    const initialState: Partial<IStrategies> = {
        strategy: "",
        short: 0,
        long: 0,
        stop_loss: 0,
        take_profit: 0,
        trailing_take_profit: false,
    };

    const {values, errors, onChange, onSetValue, onSubmit} = useForm(initialState, callback, validation.strategy);

    function callback() {
        addToBuildData(values);
        onSummaryPage("position");
    };

    return (
        <FormSummary name='Strategy' selected={summaryPage.strategy.open} onClick={() => onSummaryPage("strategy")} value="edit">
            <Form onSubmit={onSubmit} button={false}>

                <Label label1="Trading strategy" label2={errors.strategy} error />
                <Select label1="Select" items={strategies_data} selected={values.strategy}>
                    {(strategies) => 
                        strategies.map((el, i) => 
                        <List key={i} value={el.name} hover={el.description} onClick={() => onSetValue({strategy: el.name})} />  
                    )}
                </Select> 

                { find_side(values.strategy) === "both" &&
                    <>
                        <Input type="number" label1="Long difference" label2="optional" placeholder='default 10% of current price'
                            name="long" value={values.long || ""} onChange={onChange} 
                        />
                        <Input type="number" label1="Short difference" label2="optional" placeholder='default 10% of current price'
                            name="short" value={values.short || ""} onChange={onChange} 
                        />
                    </>
                }

                { find_side(values.strategy) === "buy" &&
                    <Input type="number" label1="Long difference" label2="optional" placeholder='default 10% of current price'
                        name="long" value={values.long || ""} onChange={onChange} 
                    />
                }

                { find_side(values.strategy) === "sell" &&
                    <Input type="number" label1="Short difference" label2="optional" placeholder='default 10% of current price'
                        name="short" value={values.short || ""} onChange={onChange} 
                    />
                }

                <Input type="number" label1="Take profit difference" label2="optional" placeholder='default 10% of current price'
                    name="take_profit" value={values.take_profit || ""} onChange={onChange} 
                />
                <Input type="number" label1="Stop loss difference" label2="optional" placeholder='default 10% of current price'
                    name="stop_loss" value={values.stop_loss || ""} onChange={onChange} 
                />

                <Input type="number" label1="Reset price snapshot" label2="optional"
                    name="reset" value={values.reset} onChange={onChange} 
                />

                <Checkbox label="Trailing take profit" margin value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light" />

                <Button type="submit" label1="next" color='blue' />
        
            </Form>
        </FormSummary>
    )
}

export default Strategy