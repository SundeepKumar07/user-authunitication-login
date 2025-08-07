import axios from "axios";
import { createContext, useState, useEffect  } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [UserData, setUserData] = useState(false);

  const getUserData = async ()=>{
    try {
      const {data} =  await axios.get(backendurl + '/api/user/data', {withCredentials: true});
      data.success? setUserData(data.message): toast.error(data.message);      
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);


  const value = {
    backendurl,
    isLoggedIn, setIsLoggedIn,
    UserData, setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};