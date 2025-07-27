import React from "react";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('/bg_img.png')] bg-cover bg-center pt-16">
      <Header />
    </div>
  );
};

export default Home;
