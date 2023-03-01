import { useState } from 'react';
import { IStrategies } from '@redux/types/strategies';

import { SummaryPageProps, Pages } from './@types';
import { initialState, initialSummaryPage } from './@initialState';

import Summary from '@components/summary/Style1';

import {FaHammer} from 'react-icons/fa';
import {AiOutlineInfo} from 'react-icons/ai';

import Exchange from './Exchange';
import General from './General';
import Strategy from './Strategy';
import Position from './Position';
import MarketId from './MarketId';

import Line from '@components/line/Style1';

interface Props {
  onOpen: CallableFunction
}

const Build = ({onOpen}: Props) => {

  const [buildData, setBuildData] = useState(initialState);

  const [summaryPage, setSummaryPage] = useState<SummaryPageProps>(initialSummaryPage);

  const onSummaryPage = (page: Pages) => {
    setSummaryPage(state => ({ 
      exchange: {open: false, next: state["exchange"].next}, 
      general:  {open: false, next: state["general"].next }, 
      strategy: {open: false, next: state["strategy"].next}, 
      position: {open: false, next: state["position"].next}, 
      marketId: {open: false, next: state["marketId"].next}, 
      [page]: { open: !state[page].open, next: true}
    }));
  };

  const addToBuildData = (data: Partial<IStrategies>) => {
    setBuildData({...buildData, ...data});
  };

  const onExtendOpen = (e: any) => {
    e.stopPropagation()
    onOpen() 
  };

  const onClearBuildData = () => {
    setSummaryPage(initialSummaryPage);
    setBuildData(initialState);
  }

  const context = {
    onClearBuildData,
    buildData,
    summaryPage, 
    setSummaryPage,
    onSummaryPage,
    addToBuildData,
  };

  return (
    <Summary title="Build trading bot" open={false} iconOpen={<AiOutlineInfo onClick={onExtendOpen}/>} iconClose={<FaHammer/>} background="dark">

      <Line/>

      <Exchange {...context} />
      
      <>
        {summaryPage.marketId.next && <MarketId {...context} /> }

        {summaryPage.general.next  && <General {...context} />  }

        {summaryPage.strategy.next && <Strategy {...context} /> }
      
        {summaryPage.position.next && <Position {...context} /> }
      </>

    </Summary>
  )
}

export default Build