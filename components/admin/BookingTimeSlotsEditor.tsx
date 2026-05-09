"use client";

import {
  DEFAULT_BOOKING_TIME_SLOTS_TEXT,
  joinBookingTimeSlotLines,
  minutesSinceMidnightToSlotLabel,
  parseBookingSlotToMinutesSinceMidnight,
  slotLabelToTimeInputValue,
  splitBookingTimeSlotLines,
  timeInputValueToSlotLabel,
} from "@/lib/booking-time-slots";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  legendId?: string;
};

export default function BookingTimeSlotsEditor({ value, onChange, legendId }: Props) {
  const lines = splitBookingTimeSlotLines(value);

  const setLines = (next: string[]) => {
    onChange(joinBookingTimeSlotLines(next));
  };

  const addSlot = () => {
    if (lines.length === 0) {
      setLines([minutesSinceMidnightToSlotLabel(9 * 60)]);
      return;
    }
    const last = lines[lines.length - 1];
    const base = parseBookingSlotToMinutesSinceMidnight(last);
    const mins = base != null ? Math.min(base + 60, 23 * 60 + 59) : 17 * 60;
    setLines([...lines, minutesSinceMidnightToSlotLabel(mins)]);
  };

  const loadDefaults = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Replace all slots with the built-in default list? Current list will be lost until you save.")
    ) {
      return;
    }
    onChange(DEFAULT_BOOKING_TIME_SLOTS_TEXT);
  };

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= lines.length) return;
    const copy = [...lines];
    [copy[index], copy[j]] = [copy[j], copy[index]];
    setLines(copy);
  };

  const removeAt = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateTimeAt = (index: number, iso: string) => {
    if (!iso) return;
    const label = timeInputValueToSlotLabel(iso);
    if (!label) return;
    const next = [...lines];
    next[index] = label;
    setLines(next);
  };

  const updateCustomAt = (index: number, raw: string) => {
    const next = [...lines];
    next[index] = raw;
    setLines(next);
  };

  return (
    <div className="space-y-4" aria-labelledby={legendId}>
      <p className="text-xs text-gray-500">
        These times appear on the public book-a-session form. Use 12-hour labels like{" "}
        <span className="font-mono text-gray-700">9:00 AM</span> — pick a time or edit the text if
        you need a custom label.
      </p>

      {lines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center text-sm text-gray-600">
          <p className="mb-3">No slots saved — the site uses built-in defaults until you add times here.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={addSlot}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add first slot
            </button>
            <button
              type="button"
              onClick={loadDefaults}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Load default set
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {lines.map((line, index) => {
            const parsed = parseBookingSlotToMinutesSinceMidnight(line);
            const timeVal = parsed != null ? slotLabelToTimeInputValue(line) : "";
            const inputId = `booking-slot-${index}`;
            return (
              <li
                key={`${index}-${line}`}
                className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor={`${inputId}-time`} className="sr-only">
                      Time for slot {index + 1}
                    </label>
                    <input
                      id={`${inputId}-time`}
                      type="time"
                      step={300}
                      value={timeVal}
                      disabled={parsed === null}
                      onChange={(e) => updateTimeAt(index, e.target.value)}
                      className={cn(
                        "rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-900",
                        parsed === null && "cursor-not-allowed opacity-50"
                      )}
                    />
                    {parsed === null && (
                      <span className="text-xs text-amber-700">
                        Unrecognized format — edit label on the right.
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`${inputId}-label`} className="sr-only">
                      Stored label for slot {index + 1}
                    </label>
                    <input
                      id={`${inputId}-label`}
                      type="text"
                      value={line}
                      onChange={(e) => updateCustomAt(index, e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm text-gray-800"
                      spellCheck={false}
                    />
                    <p className="mt-1 text-[10px] text-gray-500">
                      This exact text is sent to the booking form; keep it in sync with the time
                      picker when possible.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1 border-t border-gray-100 pt-3 sm:border-t-0 sm:pt-0 sm:pl-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move slot up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index >= lines.length - 1}
                    onClick={() => move(index, 1)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move slot down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                    aria-label="Remove slot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {lines.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={addSlot}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/50 px-4 py-2.5 text-sm font-semibold text-primary-900 hover:bg-primary-50"
          >
            <Plus className="h-4 w-4" />
            Add slot
          </button>
          <button
            type="button"
            onClick={loadDefaults}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Replace with defaults
          </button>
        </div>
      )}
    </div>
  );
}
