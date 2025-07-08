import React from "react";
import { useAuth } from "../../contexts/authContext";
import MapRoute from "../maps/MapRoute";


const Home = () => {
  
  return (
    <div className="text-2xl font-bold">
    <MapRoute/>
    </div>
  );
};

export default Home;
