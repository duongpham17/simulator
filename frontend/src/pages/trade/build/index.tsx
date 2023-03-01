import useOpen from '@hooks/useOpen';

import Help from './help';
import Create from './create';

const BuildIndex = () => {

  const {onOpen, open} = useOpen();

  return (
    <>
      <Create onOpen={onOpen}/>
      {open && <Help onClose={onOpen}/>}
    </>
  )
}

export default BuildIndex