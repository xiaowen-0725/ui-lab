"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  Avatar,
  enterTransition,
  focusRing,
  IconButton,
  SearchField,
  textFor,
  useQuietMotion,
} from "../ui";
import {
  CUSTOMERS,
  CUSTOMER_STATUSES,
  type Customer,
  type CustomerStatus,
  filterCustomers,
  type StatusFilter,
} from "./model";

const STATUS_CLASS: Record<CustomerStatus, string> = {
  active: "bg-success/15 text-foreground",
  trial: "bg-warning/20 text-foreground",
  pastDue: "bg-destructive/10 text-destructive",
};

export function CustomersApp() {
  const t = useTranslations("apps");
  const locale = useLocale() as Locale;
  const quiet = useQuietMotion();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const visible = filterCustomers(CUSTOMERS, query, status);
  const selected = CUSTOMERS.find((customer) => customer.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-4 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{t("customersTitle")}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("customersDescription")}</p>
          </div>
          <SearchField
            label={t("searchCustomers")}
            placeholder={t("searchCustomers")}
            value={query}
            onChange={setQuery}
          />
        </div>
        <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-2 border-0 p-0">
          <legend className="sr-only">{t("status")}</legend>
          {(["all", ...CUSTOMER_STATUSES] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={status === item}
              onClick={() => setStatus(item)}
              className={cn(
                "rounded-full px-3 py-1 text-xs transition-colors motion-reduce:transition-none",
                focusRing,
                status === item
                  ? "bg-foreground text-background"
                  : "bg-foreground/[0.04] text-muted-foreground hover:text-foreground",
              )}
            >
              {item === "all" ? t("all") : t(`statuses.${item}`)}
            </button>
          ))}
          <p className="ml-auto text-xs tabular-nums text-muted-foreground">
            {t("results", { count: visible.length })}
          </p>
        </fieldset>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">
        {visible.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-muted-foreground">{t("emptySearch")}</p>
        ) : (
          <>
            <ul className="divide-y divide-border md:hidden">
              {visible.map((customer) => (
                <li key={customer.id}>
                  <CustomerButton
                    customer={customer}
                    locale={locale}
                    selected={customer.id === selectedId}
                    onSelect={setSelectedId}
                    meta={`${t(`plans.${customer.plan}`)} · ${money.format(customer.monthly)}`}
                  />
                </li>
              ))}
            </ul>
            <table className="hidden w-full min-w-[40rem] border-collapse text-left text-sm md:table">
              <caption className="sr-only">{t("customersTitle")}</caption>
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th scope="col" className="px-6 py-3 font-medium">{t("customer")}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{t("plan")}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{t("status")}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{t("monthly")}</th>
                  <th scope="col" className="px-3 py-3 font-medium">{t("since")}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((customer) => {
                  const current = customer.id === selectedId;
                  return (
                    <tr
                      key={customer.id}
                      className={cn("border-b border-border", current && "bg-foreground/[0.04]")}
                    >
                      <th scope="row" className="px-6 py-3 font-medium">
                        <button
                          type="button"
                          onClick={() => setSelectedId(customer.id)}
                          className={cn("flex items-center gap-3 rounded-lg text-left", focusRing)}
                          aria-pressed={current}
                        >
                          <Avatar name={textFor(locale, customer.name, customer.nameZh)} />
                          <span>
                            <span className="block">{textFor(locale, customer.name, customer.nameZh)}</span>
                            <span className="block text-xs font-normal text-muted-foreground">
                              {customer.company}
                            </span>
                          </span>
                        </button>
                      </th>
                      <td className="px-3 py-3">{t(`plans.${customer.plan}`)}</td>
                      <td className="px-3 py-3">
                        <StatusPill status={customer.status} label={t(`statuses.${customer.status}`)} />
                      </td>
                      <td className="px-3 py-3 tabular-nums">{money.format(customer.monthly)}</td>
                      <td className="px-3 py-3 tabular-nums text-muted-foreground">{customer.since}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
      <AnimatePresence>
        {selected ? (
          <motion.aside
            key={selected.id}
            {...enterTransition(quiet)}
            aria-label={t("profile")}
            className="absolute inset-y-0 right-0 z-10 flex w-full max-w-md flex-col border-l border-border bg-background shadow-xl md:shadow-none"
          >
            <header className="flex items-start gap-3 border-b border-border px-4 py-4">
              <Avatar
                name={textFor(locale, selected.name, selected.nameZh)}
                className="size-10"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold">
                  {textFor(locale, selected.name, selected.nameZh)}
                </h2>
                <p className="truncate text-sm text-muted-foreground">{selected.company}</p>
              </div>
              <IconButton label={t("closeProfile")} onClick={() => setSelectedId(null)}>
                <X aria-hidden="true" className="size-4" />
              </IconButton>
            </header>
            <dl className="grid gap-4 overflow-y-auto p-4 text-sm">
              <Fact term={t("status")}>
                <StatusPill status={selected.status} label={t(`statuses.${selected.status}`)} />
              </Fact>
              <Fact term={t("plan")}>{t(`plans.${selected.plan}`)}</Fact>
              <Fact term={t("monthly")}>{money.format(selected.monthly)}</Fact>
              <Fact term={t("city")}>{textFor(locale, selected.city, selected.cityZh)}</Fact>
              <Fact term={t("since")}>{selected.since}</Fact>
              <Fact term={t("email")}>{selected.email}</Fact>
              <Fact term={t("note")}>{textFor(locale, selected.note, selected.noteZh)}</Fact>
            </dl>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CustomerButton({
  customer,
  locale,
  selected,
  onSelect,
  meta,
}: {
  customer: Customer;
  locale: Locale;
  selected: boolean;
  onSelect: (id: string) => void;
  meta: string;
}) {
  const t = useTranslations("apps");
  return (
    <button
      type="button"
      onClick={() => onSelect(customer.id)}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left",
        focusRing,
        selected && "bg-foreground/[0.04]",
      )}
    >
      <Avatar name={textFor(locale, customer.name, customer.nameZh)} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {textFor(locale, customer.name, customer.nameZh)}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {customer.company} · {meta}
        </span>
      </span>
      <StatusPill status={customer.status} label={t(`statuses.${customer.status}`)} />
    </button>
  );
}

function StatusPill({ status, label }: { status: CustomerStatus; label: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", STATUS_CLASS[status])}>
      {label}
    </span>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{term}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}
