"use client";

import {
  formatPropertyAddress,
  formatPropertySummary,
  getPipelineColumns,
  RENTER_STATUS_LABELS,
  type ApplicationWithProperty,
} from "@/lib/types";

const PIPELINE_COLUMNS = getPipelineColumns(RENTER_STATUS_LABELS);

interface RenterPipelineBoardProps {
  applications: ApplicationWithProperty[];
}

export function RenterPipelineBoard({ applications }: RenterPipelineBoardProps) {
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
                    {application.property
                      ? formatPropertyAddress(application.property)
                      : "Listing no longer available"}
                  </p>
                  {application.property && (
                    <p className="text-xs text-gray-500">
                      {formatPropertySummary(application.property)}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-gray-600">
                    {RENTER_STATUS_LABELS[application.status]}
                  </p>
                </div>
              ))}
              {columnApplications.length === 0 && (
                <p className="text-xs text-gray-400">Nothing here.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
