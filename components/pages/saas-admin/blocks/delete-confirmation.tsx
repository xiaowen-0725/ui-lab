"use client";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useSaasAdmin } from "../environment";
import { AdminSubmitFeedback } from "../use-submit";

/** Page composition using the official AlertDialog; owns no data or requests. */
export function DeleteConfirmation({
	open,
	onOpenChange,
	name,
	pending = false,
	error = "",
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	name: string;
	pending?: boolean;
	error?: string;
	onConfirm: () => void | Promise<void>;
}) {
	const { t } = useSaasAdmin();
	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				if (!pending) onOpenChange(next);
			}}
		>
			<AlertDialogContent className="overscroll-contain">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("Confirm deletion")}</AlertDialogTitle>
					<AlertDialogDescription>
						{t("Delete this record?")} {name}{" "}
						{t("This action cannot be undone.")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AdminSubmitFeedback pending={pending} error={error} complete={false} />
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>
						{t("Cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						disabled={pending}
						onClick={() => void onConfirm()}
					>
						{pending ? t("Submitting…") : t("Delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
