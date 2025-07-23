// Utility functions for property period calculations

export function getNextMonday(date: Date): Date {
  const d = new Date(date); // avoid mutating input
  const day = d.getDay();
  if (day === 6) {
    d.setDate(d.getDate() + 2);
  } else if (day === 0) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export const NEW_APPLICATION_PERIOD_BEGINS = {
  label: 'New application period begins',
  getDate: (year: number) => new Date(year, 0, 1),
};

export const ABATEMENT_APPLICATION_DEADLINE = {
  label: 'Abatement Application Deadline',
  getDate: (year: number) => getNextMonday(new Date(year, 1, 1)),
};

export const EXEMPTIONS_IN_PROGRESS = {
  label: 'Exemptions in progress',
  getDate: (year: number) => new Date(year, 2, 1),
};

export const EXEMPTION_APPLICATION_DEADLINE = {
  label: 'Exemption Application Deadline',
  getDate: (year: number) => getNextMonday(new Date(year, 3, 1)),
};

export const NEW_FY_PRELIMINARY_TAX_PERIOD_BEGINS = {
  label: 'New FY Preliminary Tax Period Begins',
  getDate: (year: number) => new Date(year, 6, 1),
};

export const ABATEMENT_GRACE_PERIOD_DEADLINE = {
  label: 'Abatement 28 Day Grace Period Deadline',
  getDate: (year: number) => {
    const abatementDeadline = ABATEMENT_APPLICATION_DEADLINE.getDate(year);
    const graceDate = new Date(abatementDeadline);
    graceDate.setDate(graceDate.getDate() + 28);
    return graceDate;
  },
};

export function getAllTimepoints(year: number) {
  return [
    {
      label: NEW_APPLICATION_PERIOD_BEGINS.label,
      date: NEW_APPLICATION_PERIOD_BEGINS.getDate(year),
    },
    {
      label: ABATEMENT_APPLICATION_DEADLINE.label,
      date: ABATEMENT_APPLICATION_DEADLINE.getDate(year),
    },
    {
      label: ABATEMENT_GRACE_PERIOD_DEADLINE.label,
      date: ABATEMENT_GRACE_PERIOD_DEADLINE.getDate(year),
    },
    {
      label: EXEMPTIONS_IN_PROGRESS.label,
      date: EXEMPTIONS_IN_PROGRESS.getDate(year),
    },
    {
      label: EXEMPTION_APPLICATION_DEADLINE.label,
      date: EXEMPTION_APPLICATION_DEADLINE.getDate(year),
    },
    {
      label: NEW_FY_PRELIMINARY_TAX_PERIOD_BEGINS.label,
      date: NEW_FY_PRELIMINARY_TAX_PERIOD_BEGINS.getDate(year),
    },
  ];
}

export function getCurrentPeriod(date: Date, timepoints: { label: string; date: Date }[]) {
  let prev = timepoints[0];
  for (let i = 1; i < timepoints.length; i++) {
    if (date < timepoints[i].date) {
      return { from: prev, to: timepoints[i] };
    }
    prev = timepoints[i];
  }
  return { from: timepoints[timepoints.length - 1], to: null };
}

export function formatDateForDisplay(date: Date, opts?: { withTime?: boolean }) {
  // Example: Monday, February 3, 2025 or Monday, February 3, 2025 at 5:00:00 PM
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(opts?.withTime ? { hour: 'numeric', minute: '2-digit', second: '2-digit' } : {})
  };
  return date.toLocaleString('en-US', options);
}

// Utility to get the fiscal year for a given date
export function getFiscalYear(date: Date): number {
  // Fiscal year starts July 1st of previous year, ends June 30th of current year
  // e.g., July 1, 2024 - June 30, 2025 is FY2025
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0=Jan, 6=July
  return month >= 6 ? year + 1 : year;
}

export function getAbatementPhase(date: Date, year: number) {
  // Get all relevant timepoints
  const jan1 = NEW_APPLICATION_PERIOD_BEGINS.getDate(year);
  const abatementDeadline = ABATEMENT_APPLICATION_DEADLINE.getDate(year);
  const graceDeadline = ABATEMENT_GRACE_PERIOD_DEADLINE.getDate(year);
  const july1 = NEW_FY_PRELIMINARY_TAX_PERIOD_BEGINS.getDate(year);
  const nextJan1 = NEW_APPLICATION_PERIOD_BEGINS.getDate(year + 1);
  const fiscalYear = getFiscalYear(date);
  // 1. Before Jan 1: between end of previous app period and Jan 1
  if (date < jan1) {
    return {
      phase: 'before_jan1',
      message: `Applications for Abatements, Residential Exemptions, and Personal Exemptions for the upcoming FY${year} will become available for download on ${formatDateForDisplay(jan1)}.`
    };
  }
  // 2. Jan 1 (inclusive) to abatement deadline (inclusive)
  if (date >= jan1 && date <= abatementDeadline) {
    return {
      phase: 'open',
      message: `To file an Abatement Application for the currently open FY${year}, please use the link below. The deadline for submission is ${formatDateForDisplay(abatementDeadline, { withTime: true })}.`,
      deadline: abatementDeadline
    };
  }
  // 3. After abatement deadline (exclusive) to grace period (inclusive)
  if (date > abatementDeadline && date <= graceDeadline) {
    return {
      phase: 'grace',
      message: `The deadline for filing an Abatement application for FY${year} was ${formatDateForDisplay(abatementDeadline)}. However, additional documentation for applications already on file is still being accepted. If you were eligible but not granted an abatement in FY${year}, you will need to wait until the next application period.`,
      deadline: abatementDeadline
    };
  }
  // 4. After grace period (i.e., starting 29 days after deadline) and before July 1st
  if (date > graceDeadline && date < july1) {
    return {
      phase: 'after_grace',
      message: `The deadline for filing an Abatement application for FY${year} was ${formatDateForDisplay(abatementDeadline)}. If you were eligible but not granted an abatement in FY${year}, you will need to wait until the next application period. Applications for the upcoming FY${year + 1} will become available for download beginning ${formatDateForDisplay(nextJan1)}.`,
      deadline: abatementDeadline
    };
  }
  // 5. After July 1st and before next Jan 1: show reference to last FY
  if (date >= july1 && date < nextJan1) {
    return {
      phase: 'reference_only',
      message: `The abatement values shown are for the past FY${year} and are for reference only. FY${year + 1} values will become available in January (${formatDateForDisplay(nextJan1)}). If you were eligible but not granted an abatement in FY${year}, you will need to wait until the next application period.`,
      deadline: abatementDeadline
    };
  }
  // Fallback (should not happen)
  return {
    phase: 'unknown',
    message: ''
  };
}

export const EXEMPTION_APPLICATION_DEADLINE_DATE = {
  label: 'Exemption Application Deadline',
  getDate: (year: number) => getNextMonday(new Date(year, 3, 1)), // April 1st, next Monday if weekend
};

export function getExemptionPhase(date: Date, year: number, opts: { isEligible: boolean, grantedCount: number, type: 'Residential' | 'Personal' }) {
  const jan1 = NEW_APPLICATION_PERIOD_BEGINS.getDate(year);
  const deadline = EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(year);
  const july1 = NEW_FY_PRELIMINARY_TAX_PERIOD_BEGINS.getDate(year);
  const nextJan1 = NEW_APPLICATION_PERIOD_BEGINS.getDate(year + 1);
  const fiscalYear = getFiscalYear(date);
  const { isEligible, grantedCount, type } = opts;
  // Before Jan 1
  if (date < jan1) {
    return {
      phase: 'before_jan1',
      message: `Applications for Abatements, Residential Exemptions, and Personal Exemptions for the upcoming FY${year} will become available for download on ${formatDateForDisplay(jan1)}.`
    };
  }
  // Jan 1 to deadline (inclusive)
  if (date >= jan1 && date <= deadline) {
    if (!isEligible) {
      return {
        phase: 'not_eligible',
        message: `This type of parcel was not eligible for a ${type.toLowerCase()} exemption in FY${year}.`
      };
    }
    if (grantedCount > 0) {
      return {
        phase: 'granted',
        message: `A ${type} Exemption has been granted for this parcel in FY${year}.`
      };
    }
    // Eligible and not granted
    return {
      phase: 'open',
      message: `To file a ${type} Exemption Application for the currently open FY${year}, use the link(s) below. The deadline for submission is ${formatDateForDisplay(deadline, { withTime: true })}.`,
      deadline
    };
  }
  // After deadline until July 1st
  if (date > deadline && date < july1) {
    if (!isEligible) {
      return {
        phase: 'not_eligible',
        message: `This type of parcel was not eligible for a ${type.toLowerCase()} exemption in FY${year}.`
      };
    }
    if (grantedCount > 0) {
      return {
        phase: 'granted',
        message: `A ${type} Exemption was granted for this parcel in FY${year}.`
      };
    }
    // Not granted
    return {
      phase: 'after_deadline',
      message: `This parcel was eligible but not granted a ${type} Exemption in FY${year}. The deadline for filing a ${type} Exemption application for FY${year} was ${formatDateForDisplay(deadline)}. Applications for the upcoming FY${year + 1} will become available for download beginning ${formatDateForDisplay(nextJan1)}.`,
      deadline
    };
  }
  // After July 1st and before next Jan 1: show reference to last FY
  if (date >= july1 && date < nextJan1) {
    if (!isEligible) {
      return {
        phase: 'not_eligible',
        message: `This type of parcel was not eligible for a ${type.toLowerCase()} exemption in FY${year}.`
      };
    }
    if (grantedCount > 0) {
      return {
        phase: 'granted',
        message: `A ${type} Exemption was granted for this parcel in FY${year}.`
      };
    }
    // Not granted
    return {
      phase: 'reference_only',
      message: `This parcel was eligible but not granted a ${type} Exemption in the past FY${year}. FY${year + 1} values will become available in January (${formatDateForDisplay(nextJan1)}).`,
      deadline
    };
  }
  // Fallback
  return { phase: 'unknown', message: '' };
} 