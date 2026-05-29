import fobs from "@/data/fob-products.json";
import type { FobData } from "@/lib/prompt-gen";
import { ImageClient } from "./_components/ImageClient";

export default function ImagePage() {
  return <ImageClient fobs={fobs as FobData[]} />;
}
