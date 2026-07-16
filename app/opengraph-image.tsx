import { ImageResponse } from "next/og";
import { OG_SIZE, ogImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "UI Lab · A visual vocabulary for the web — components, blocks & design styles";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(ogImage(), OG_SIZE);
}
