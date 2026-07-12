import type { Metadata } from "next";
import { Playground } from "@/components/app/playground/playground";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Tweak spring, tween and stagger properties, watch them play, and copy the motion code. Built on UI Lab's motion tokens.",
};

export default function PlaygroundPage() {
  return <Playground />;
}
