import DataBrowser from "./components/DataBrowser";
import Footer from "./components/Footer";
import Header from "./components/Header";
import React from "react";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <DataBrowser />
      <Footer />
    </div>
  );
}
