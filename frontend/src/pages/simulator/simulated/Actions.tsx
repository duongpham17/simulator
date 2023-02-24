import { useAppDispatch } from '@redux/hooks/useRedux';
import { ISimulatorSimulated } from '@redux/types/simulators';

import Alert from '@redux/actions/alert';
import Strategies from '@redux/actions/strategies';
import Simulator from '@redux/actions/simulators';
import useLoading from '@hooks/useLoading';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Button';

interface Props {
    data: ISimulatorSimulated
}

const Actions = ({data}: Props) => {

    const {strategy, simulator} = data;

    const dispatch = useAppDispatch();

    const {loading: saveLoading, onLoading: onLoadingSave} = useLoading();

    const onSave = async () => {
        const d = {
            ...strategy,
            _id: undefined,
            name: `new | ${strategy.name} ${strategy.strategy}`,
        }
        onLoadingSave(() => dispatch(Strategies.build(d)));
        dispatch(Alert.set("Strategy saved", "green"));
    }

    const onDelete = () => {
        dispatch(Simulator.simulate_remove(simulator.createdAt.toLocaleString()))
    }

    return (
        <Flex>
            <Button label1="save" color="light" onClick={onSave} loading={saveLoading} style={{"width": "100px", "padding": "0.3rem"}}/>
            <Button label1="delete" color="light" onClick={onDelete} style={{"width": "100px", "padding": "0.3rem"}}/>
        </Flex>
    )
}

export default Actions