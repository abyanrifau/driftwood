/**
 * The "dates to confirmed" stopwatch. Starts on the first interaction with
 * any booking widget (hero form, room panel, seasonal calendar, the flow
 * itself) and is read on the confirmation screen.
 */
export const T0_KEY = 'dw:t0';

export const markBookingStart = () => {
  try {
    if (!sessionStorage.getItem(T0_KEY)) sessionStorage.setItem(T0_KEY, String(Date.now()));
  } catch {
    /* storage unavailable: the timer simply won't show */
  }
};

export const readBookingStart = (): number | null => {
  try {
    const v = Number(sessionStorage.getItem(T0_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
};

export const clearBookingStart = () => {
  try {
    sessionStorage.removeItem(T0_KEY);
  } catch {
    /* ignore */
  }
};
