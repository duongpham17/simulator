import {IStrategies} from '@redux/types/strategies';

export interface Options {
    open: boolean;
    next: boolean;
};

export interface SummaryPageProps {
    exchange: Options,
    general:  Options,
    marketId: Options,
    strategy: Options,
    position: Options,
};

export type Pages = keyof SummaryPageProps;

export interface BuildProps {
    summaryPage: SummaryPageProps
    setSummaryPage: React.Dispatch<React.SetStateAction<SummaryPageProps>>,
    buildData: Partial<IStrategies>,
    onSummaryPage: (page: Pages) => void,
    addToBuildData: (data: Partial<IStrategies>) => void,
    onClearBuildData: () => void,
}