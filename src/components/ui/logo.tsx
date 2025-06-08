import { LogoPitel } from "@/public/svg";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
	return (
		<Link className="block" href="/">
			<Image priority src={LogoPitel} alt="Logo Pitel" width={40} />
		</Link>
	);
}
