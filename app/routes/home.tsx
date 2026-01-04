import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "LONG HA NGOC" },
		{ name: "description", content: "Was here ✨" },
	];
}

export default function Home() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
			<div className="text-center">
				<h1 className="text-6xl md:text-8xl font-bold text-black dark:text-white mb-4">
					LONG HA NGOC
				</h1>
				<p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-400">
					Was here ✨
				</p>
			</div>
		</main>
	);
}
