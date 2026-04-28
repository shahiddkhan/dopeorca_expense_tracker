import React from 'react';

export default function Toast({ notif }) {
  if (!notif) return null;
  return <div className={`toast toast-${notif.type}`}>{notif.msg}</div>;
}
