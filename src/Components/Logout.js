import React, { useEffect } from 'react'
import { clearLocal } from '../constants/localstorage' // Function to clear local storage
import { useNavigate } from 'react-router-dom' // Hook to navigate between routes

const Logout = () => {

  const navigate = useNavigate(); // Initialize navigate hook to redirect after logout
  
  useEffect(() => {
    clearLocal(); // Clear the local storage when the component is mounted (logout process)
    navigate("/signin"); // Redirect the user to the signin page after logging out
    // eslint-disable-next-line
  }, []) // Empty dependency array to run the effect only once when the component is mounted

  return (
    <div>Logging Off..</div> // Display a message while the logout process is happening
  )
}

export default Logout
