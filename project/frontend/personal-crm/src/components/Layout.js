import React from "react";
import CRMSidebar from "./CRMSidebar";

function Layout({ children }) {
  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <CRMSidebar />

      {/* Page Content */}
      <div className="flex-grow-1 p-3">{children}</div>
    </div>
  );
}

export default Layout;