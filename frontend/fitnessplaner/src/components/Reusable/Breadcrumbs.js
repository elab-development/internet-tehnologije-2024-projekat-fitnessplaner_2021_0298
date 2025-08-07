// components/reusable/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const location = useLocation();

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "");

  return (
    <div className="breadcrumbs" style={{ padding: "10px" }}>
      <Link to="/dashboard">Dashboard</Link>
      {crumbs.map((crumb, index) => {
        const path = `/${crumbs.slice(0, index + 1).join("/")}`;

        // Možeš ovde prevesti path u "lepši" tekst
        const label = decodeURIComponent(crumb)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <span key={path}>
            {" > "}
            <Link to={path}>{label}</Link>
          </span>
        );
      })}
    </div>
  );
}
