import { Link } from 'react-router-dom';

const Pages = () => {
  return (
    <>      
        <Link to="/">CST</Link>
        <Link to="/trade">Trade</Link>
        <Link to="/simulator">Simulator</Link>
        <Link to="/history">History</Link>
    </>
  )
}

export default Pages