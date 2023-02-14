import React from 'react';

interface Props {
    hide: boolean,
    children: React.ReactNode
}

const Hidden = ({hide=true, children}: Props) => {
  return (
    <div style={{"display": hide ? "none" : "block"}}>
        {children}
    </div>
  )
}

export default Hidden