import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";

export function Welcome({ message }: { message: string }) {
	return (
		<main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
			<div className="flex flex-col items-center gap-12">
				<header className="text-center">
					<h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
						LONG HA NGOC
					</h1>
					<p className="text-xl text-white/90">Was here ✨</p>
				</header>
				
				<div className="w-[400px] max-w-[90vw]">
					<img
						src={logoLight}
						alt="Logo"
						className="block w-full dark:hidden"
					/>
					<img
						src={logoDark}
						alt="Logo"
						className="hidden w-full dark:block"
					/>
				</div>

				<div className="w-[400px] max-w-[90vw]">
					<ul className="space-y-2">
						{resources.map(({ href, text }) => (
							<li key={href}>
								<a
									className="block w-full p-3 text-center bg-white/90 text-purple-900 rounded-lg hover:bg-white transition"
									href={href}
									target="_blank"
									rel="noreferrer"
								>
									{text}
								</a>
							</li>
						))}
						<li className="block w-full p-3 text-center bg-orange-100 text-orange-900 rounded-lg font-semibold">
							{message || "Made with ❤️ by LONG HA NGOC"}
						</li>
					</ul>
				</div>
			</div>
		</main>
	);
}

const resources = [
	{
		href: "https://reactrouter.com/docs",
		text: "React Router Docs",
	},
	{
		href: "https://rmx.as/discord",
		text: "Join Discord",
	},
];
