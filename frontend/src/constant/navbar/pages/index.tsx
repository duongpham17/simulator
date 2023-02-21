import { useContext } from 'react';
import { Context } from 'themes';

import black_logo from '@assets/logo/black.png';
import white_logo from '@assets/logo/white.png';
import useQuery from '@hooks/useQuery'

import LinksContainer from '@components/link/Style1'

const Pages = () => {

  const {location} = useQuery();

  const check = (at: string) => location.pathname === at;

  const {theme} = useContext(Context);

  const data = [
    {
      name: <img src={theme.name === "light" ? white_logo : black_logo} alt="bot" width={30} />,
      to: '/',
      selected: check("/")
    },
    {
      name: "Trade",
      to: '/trade',
      selected: check("/trade")
    },
    {
      name: "Simulator",
      to: "/simulator",
      selected: check("/simulator")
    },
    {
      name: "History",
      to: "/history",
      selected: check("/history")
    }
  ]

  return ( <LinksContainer data={data} /> )
}

export default Pages