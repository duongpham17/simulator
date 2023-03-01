import { EditProps } from './@types';
import validations from '@validations/trading';
import {useAppDispatch} from '@redux/hooks/useRedux';

import useForm from '@hooks/useForm';

import Text from '@components/text/Style1';
import Form from '@components/form/Form';
import Input from '@components/inputs/Input';
import Labels from '@components/form/Label';
import Button from '@components/buttons/Button';
import Checkbox from '@components/inputs/Checkbox';
import Strategies from '@redux/actions/strategies';
import Openarrows from '@components/buttons/Openarrows';
import Flex from '@components/flex/Flex';
import Container from '@components/container/Style2';
import Line from '@components/line/Style1';

const GeneralEdit = ({strategy, openValue, onOpenValue}: EditProps) => {
    
    const dispatch = useAppDispatch()

    const initialState: {
        name: string,
        live: boolean
    } = {
        ...strategy
    };
    
    const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validations.general);

    async function callback(){
        await dispatch(Strategies.update(values));
        onOpenValue("");
    };

    return (
        <>
            <Container onClick={() => onOpenValue("general")} pointer style={{padding: 0}}>
                <Flex>
                    <p> General </p>
                    <Openarrows open={openValue === "general"}/>
                </Flex>
            </Container>
            
            {openValue === "general" ?
                <Form onSubmit={onSubmit} button={false}>

                    <Text name="Cannot be edited" value={"market id | exchange"} />

                    <Line />

                    <Input type="text" label1="Name of script" label2={errors.name} error 
                        name="name" value={values.name} onChange={onChange} 
                    />
                        
                    <Labels label1="Environment"/>
                    <Checkbox label={values.live ? "Live" : "Test"} value={values.live} onClick={() => onSetValue({live: !values.live})}  background="light" />

                    <Button type="submit" label1="save" color="blue" loading={loading}/>

                </Form>
            :
                <div>
                    <Text name="Name of script" value={strategy.name} />
                    <Text name="Environment" value={strategy.live ? "live" : "test"} />
                    <Text name="Market id" value={strategy.market_id.toLowerCase()} />
                    <Text name="Exchange" value={strategy.exchange} />
                </div>
            }

        </>
    )
}

export default GeneralEdit;