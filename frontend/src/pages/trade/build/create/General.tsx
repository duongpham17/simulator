import { BuildProps } from './@types';
import { IStrategies } from '@redux/types/strategies';

import useForm from '@hooks/useForm';
import validation from '@validations/trading';

import Form from '@components/form/Form';
import FormSummary from '@components/form/Summary';
import Label from '@components/form/Label';
import Button from '@components/buttons/Button';
import Input from '@components/inputs/Input';
import Checkbox from '@components/inputs/Checkbox';

const General = ({addToBuildData, summaryPage, onSummaryPage}:BuildProps) => {

  const initialState: Partial<IStrategies> = {
    name: "",
    live: false,
  };

  const {values, errors, onChange, onSubmit, onSetValue} = useForm(initialState, callback, validation.general);

  function callback() {
    addToBuildData(values);
    onSummaryPage("strategy")
  };

  return (
    <FormSummary name='General' selected={summaryPage.general.open} value="edit" onClick={() => onSummaryPage("general")}>
      <Form onSubmit={onSubmit} button={false}>

        <Input type="text" label1="Name of script" label2={errors.name} error 
          name="name" value={values.name} onChange={onChange} /
        >
        
        <Label label1="Environment"/>
        <Checkbox label={values.live ? "Live" : "Test"} value={values.live} onClick={() => onSetValue({live: !values.live})}  background="light" />

        <Button type="submit" label1="next" color="blue"/>
        
      </Form>
    </FormSummary>
  )
}

export default General