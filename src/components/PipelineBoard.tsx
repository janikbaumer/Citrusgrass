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
          <div key={column.title} className="rounded-2xl bg-bg p-3">
            <h2 className="mb-3 text-sm font-semibold text-ink">
              {column.title}{" "}
              <span className="font-normal text-muted">({columnApplications.length})</span>
            </h2>
            <div className="space-y-3">
              {columnApplications.map((application) => (
                <div
                  key={application.id}
                  className={`rounded-2xl border bg-surface p-3 shadow-warm-sm ${
                    application.status === "accepted"
                      ? "border-good"
                      : application.status === "declined"
                        ? "border-danger opacity-70"
                        : "border-line"
                  }`}
                >
                  <p className="text-sm font-medium">
                    {application.renter.firstName} {application.renter.lastName}
                  </p>
                  <p className="text-xs text-muted">{application.renter.email}</p>
                  {application.renter.phone && (
                    <p className="text-xs text-muted">{application.renter.phone}</p>
                  )}
                  {application.renter.salaryRange && (
                    <p className="mt-1 text-xs text-muted">
                      Salary: {application.renter.salaryRange}
                    </p>
                  )}
                  {application.renter.about && (
                    <p className="mt-1 line-clamp-3 text-xs text-muted">
                      {application.renter.about}
                    </p>
                  )}

                  <select
                    value={application.status}
                    onChange={(e) =>
                      onStatusChange(application, e.target.value as PipelineStatus)
                    }
                    className="mt-3 w-full rounded-lg border border-line bg-surface px-2 py-1 text-xs focus:border-accent focus:outline-none"
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
                <p className="text-xs text-muted">No applicants.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
