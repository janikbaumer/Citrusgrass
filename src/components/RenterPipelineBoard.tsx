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
    <div className="grid gap-4 md:grid-cols-4">
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
              {columnApplications.map((application) => {
                const borderClass =
                  application.status === "accepted"
                    ? "border-good"
                    : application.status === "declined"
                      ? "border-danger"
                      : "border-line";
                const opacityClass =
                  application.status === "declined" || !application.property ? "opacity-70" : "";
                const displayProperty = application.property ?? application.propertySnapshot;
                return (
                  <div
                    key={application.id}
                    className={`rounded-2xl border bg-surface p-3 shadow-warm-sm ${borderClass} ${opacityClass}`}
                  >
                    <p className="text-sm font-medium">
                      {displayProperty
                        ? formatPropertyAddress(displayProperty)
                        : t("common.listingUnavailable")}
                    </p>
                    {displayProperty && (
                      <p className="text-xs text-muted">
                        {formatPropertySummary(displayProperty)}
                      </p>
                    )}
                    {!application.property && displayProperty && (
                      <p className="mt-1 text-xs text-danger">{t("common.listingUnavailable")}</p>
                    )}
                    <p className="mt-2 text-xs font-medium text-muted">
                      {statusLabels[application.status]}
                    </p>
                  </div>
                );
              })}
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
