import React, { useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"

import HeaderSection from "../../Layout/Header/HeaderSection";

import MainContent from "./MainContent"

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        // Redirect to the login page if tokens are missing
        navigate("/");
      }
    }
  }, [navigate, user]);

  return (
    <>
      <HeaderSection />
      <MainContent />
    </>
  );
};

export default DashboardPage;