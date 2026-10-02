import React from "react";

export const StatusBadge = ({ status }) => {
  const normStatus = (status || "GENUINE").toUpperCase();

  let badgeClass = "badge-genuine";
  let label = "Genuine";

  switch (normStatus) {
    case "GENUINE":
      badgeClass = "badge-genuine";
      label = "Genuine";
      break;
    case "EXPIRED":
      badgeClass = "badge-expired";
      label = "Expired";
      break;
    case "SUSPICIOUS":
      badgeClass = "badge-suspicious";
      label = "Suspicious";
      break;
    case "RECALLED":
      badgeClass = "badge-recalled";
      label = "Recalled";
      break;
    case "INVALID":
    case "FAKE":
    case "COUNTERFEIT":
      badgeClass = "badge-invalid";
      label = "Counterfeit / Invalid";
      break;
    default:
      badgeClass = "badge-genuine";
      label = normStatus;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span className="badge-dot"></span>
      {label}
    </span>
  );
};

export default StatusBadge;
