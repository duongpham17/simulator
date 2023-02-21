import useOpen from '@hooks/useOpen';

import Information from './help';
import Create from './create';

const BuildIndex = () => {

  const {onOpen, open} = useOpen();

  return (
    <>
      <Create onOpen={onOpen}/>
      {open && <Information onClose={onOpen}/>}
    </>
  )
}

export default BuildIndex