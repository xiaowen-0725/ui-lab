"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSaasAdmin } from "./environment";

/** Consumer action boundary; it neither creates accounts nor contacts services. */
export function useAdminSubmit(type: string) {
	const { submit, t } = useSaasAdmin();
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const [complete, setComplete] = useState(false);
	const inFlight = useRef(false);
	const mounted = useRef(true);
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const run = async (values: Record<string, unknown>) => {
		if (inFlight.current) return false;
		inFlight.current = true;
		setPending(true);
		setError("");
		setComplete(false);
		try {
			await submit({ type, values });
			if (mounted.current) setComplete(true);
			return true;
		} catch (cause) {
			if (mounted.current)
				setError(cause instanceof Error ? cause.message : t("Try again"));
			return false;
		} finally {
			inFlight.current = false;
			if (mounted.current) setPending(false);
		}
	};
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		void run(Object.fromEntries(new FormData(event.currentTarget)));
	};
	return { pending, error, complete, run, handleSubmit };
}

export function AdminSubmitFeedback({
	pending,
	error,
	complete,
}: {
	pending: boolean;
	error: string;
	complete: boolean;
}) {
	const { t } = useSaasAdmin();
	if (!pending && !error && !complete) return null;
	return (
		<Alert
			variant={error ? "destructive" : "default"}
			className="my-4"
			aria-live="polite"
			role={error ? "alert" : "status"}
		>
			<AlertTitle>
				{pending
					? t("Submitting…")
					: error
						? t("Try again")
						: t("Action completed.")}
			</AlertTitle>
			<AlertDescription>
				{error ||
					(complete ? t("Your consumer callback completed successfully.") : "")}
			</AlertDescription>
		</Alert>
	);
}
