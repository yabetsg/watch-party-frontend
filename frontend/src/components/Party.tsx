import React from 'react'
import { useParams } from 'react-router-dom';

const Party = () => {
  const { partyID } = useParams();
// 
  return (
    <div>
        <div>{partyID}</div>
        <div>PARTYYYY</div>
    </div>
  )
}

export default Party