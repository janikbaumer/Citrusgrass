"use client";

import {
  formatPropertyAddress,
  formatPropertySummary,
  getPipelineColumns,
  getRenterStatusLabels,
  type ApplicationWithProperty,
} from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface RenterPipelineBoardProps {
  applications: ApplicationWithProperty[];
}

export function RenterPipelineBoard({ applications }: RenterPipelineBoardProps) {
  const { t } = useLanguage();
  const statusLabels = getRenterStatusLabels(t);
  const pipelineColumns = getPipelineColumns(statusLabels);

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {pipelineColumns.map((column) => {
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
                    {application.property
                      ? formatPropertyAddress(application.property)
                      : t("common.listingUnavailable")}
                  </p>
                  {application.property && (
                    <p className="text-xs text-muted">
                      {formatPropertySummary(application.property)}
                    </p>
                  )}
                  <p className="mt-2 text-xs font-medium text-muted">
                    {statusLabels[application.status]}
                  </p>
                </div>
              ))}
              {columnApplications.length === 0 && (
                <p className="text-xs text-muted">{t("renterPipelineBoard.nothingHere")}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
