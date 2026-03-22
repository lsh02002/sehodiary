import React from "react";
import { ActivityLogResponseType } from "../../types/type";

const ActivityLogCard = ({ log }: { log: ActivityLogResponseType }) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body p-3">
        <div className="w-100 d-flex flex-column gap-2">
          <div className="small text-body">{log?.message}</div>
          <div className="fst-italic text-secondary small w-100">{log?.createdAt}</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogCard;
