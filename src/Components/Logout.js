import React, { useEffect } from 'react'
import { clearLocal } from '../constants/localstorage'
import { useNavigate } from 'react-router-dom'

const Logout = () => {

  const navigate = useNavigate();
  useEffect(() => {
    clearLocal();
    navigate("/signin");
    // eslint-disable-next-line
  }, [])

  return (
    <div>Logging Off..</div>
  )
}

export default Logout