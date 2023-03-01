import {IStrategies} from '@redux/types/strategies';

export interface EditProps {
    strategy: IStrategies,
    openValue: string | null,
    onOpenValue: (value: string, change?: boolean) => void,
}