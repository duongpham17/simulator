import {IStrategies} from '@redux/types/strategies';

export interface BuildProps {
    values: Partial<IStrategies>,
    errors: {[key: string]: any},
    onSetValue: (v: Partial<Partial<IStrategies>>) => void,
    onChange: (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
}