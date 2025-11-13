import Image from "next/image";
import { cn } from "@/lib/utils";
import Pina from "@/public/pina.png";

export default function AnanaLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Image
        alt="Anana Loading"
        className="aspect-auto w-20 animate-pulse"
        src={Pina}
      />
      Loading...
    </div>
  );
}
