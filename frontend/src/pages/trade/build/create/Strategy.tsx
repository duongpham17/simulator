import { BuildProps } from './@types';
import { find_side } from '@data/strategies';

import Flex from '@components/flex/Flex';
import Input from '@components/inputs/Input';
import Checkbox from '@components/inputs/Checkbox';
import Line from '@components/line/Style1';

const Strategy = ({values, onChange, onSetValue}: BuildProps) => {
  return (
    <>
        <Line />

        {find_side(values.strategy) === "both" &&
            <Flex>
                <Input type="number" label1="Long difference" name="long" value={values.long} onChange={onChange} />
                <Input type="number" label1="Short difference" name="short" value={values.short} onChange={onChange} />
            </Flex>
        }

        { find_side(values.strategy) === "buy" &&
            <Input type="number" label1="Long difference" name="long" value={values.long} onChange={onChange} />
        }

        { find_side(values.strategy) === "sell" &&
            <Input type="number" label1="Short difference" name="short" value={values.short} onChange={onChange} />
        }

        <Flex>
            <Input type="number" label1="Take profit difference"  name="take_profit" value={values.take_profit} onChange={onChange} />
            <Input type="number" label1="Stop loss difference" name="stop_loss" value={values.stop_loss} onChange={onChange} />
        </Flex>

        <Checkbox label="Trailing take profit" margin value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light" />
    </>
  )
}

export default Strategy