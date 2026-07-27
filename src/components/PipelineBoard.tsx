"use client";

import {
  getPipelineColumns,
  PIPELINE_STATUS_LABELS,
  type Application,
  type PipelineStatus,
} from "@/lib/types";

const PIPELINE_COLUMNS = getPipelineColumns(PIPELINE_STATUS_LABELS);
const ALL_STATUSES = PIPELINE_COLUMNS.flatMap((column) => column.statuses);

interface PipelineBoardProps {
  applications: Application[];
  onStatusChange: (application: Application, status: PipelineStatus) => void;
}

export function PipelineBoard({ applications, onStatusChange }: PipelineBoardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {PIPELINE_COLUMNS.map((column) => {
        const columnApplications = applications.filter((application) =>
          column.statuses.includes(application.status)
        );
        return (
          <div key={column.title} className="rounded-xl bg-gray-50 p-3">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              {column.title}{" "}
              <span className="font-normal text-gray-400">({columnApplications.length})</span>
            </h2>
            <div className="space-y-3">
              {columnApplications.map((application) => (
                <div
                  key={application.id}
                  className={`rounded-lg border bg-white p-3 shadow-sm ${
                    application.status === "accepted"
                      ? "border-green-300"
                      : application.status === "declined"
                        ? "border-red-200 opacity-70"
                        : "border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {application.renter.firstName} {application.renter.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{application.renter.email}</p>
                  {application.renter.phone && (
                    <p className="text-xs text-gray-500">{application.renter.phone}</p>
                  )}
                  {application.renter.salaryRange && (
                    <p className="mt-1 text-xs text-gray-500">
                      Salary: {application.renter.salaryRange}
                    </p>
                  )}
                  {application.renter.about && (
                    <p className="mt-1 line-clamp-3 text-xs text-gray-400">
                      {application.renter.about}
                    </p>
                  )}

                  <select
                    value={application.status}
                    onChange={(e) =>
                      onStatusChange(application, e.target.value as PipelineStatus)
                    }
                    className="mt-3 w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:border-gray-900 focus:outline-none"
                  >
                    {ALL_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {PIPELINE_STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              {columnApplications.length === 0 && (
                <p className="text-xs text-gray-400">No applicants.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
