import { useState, useEffect } from "react";

// Dynamic import for client-side only
let pdfjsLib: any = null;

export function loader() {
	return null;
}

export function meta() {
	return [
		{ title: "PDF to Text - LONG HA NGOC" },
		{ name: "description", content: "Convert PDF to Text" },
	];
}

export default function PDFPage() {
	const [text, setText] = useState("");
	const [fileName, setFileName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [pdfLoaded, setPdfLoaded] = useState(false);

	useEffect(() => {
		// Load pdfjs only on client side
		import("pdfjs-dist").then((pdfjs) => {
			pdfjsLib = pdfjs;
			pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
			setPdfLoaded(true);
		}).catch(err => {
			console.error("Failed to load pdfjs:", err);
			setError("Failed to load PDF library");
		});
	}, []);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!pdfLoaded || !pdfjsLib) {
			setError("PDF library is still loading...");
			return;
		}

		const file = event.target.files?.[0];
		if (!file) return;

		setIsLoading(true);
		setError("");
		setText("");
		setFileName(file.name);

		try {
			// Read file as array buffer
			const arrayBuffer = await file.arrayBuffer();

			// Load PDF
			const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
			const pdf = await loadingTask.promise;

			// Extract text from all pages
			let fullText = "";
			for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
				const page = await pdf.getPage(pageNum);
				const textContent = await page.getTextContent();
				const pageText = textContent.items
					.map((item: any) => item.str)
					.join(" ");
				fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
			}

			setText(fullText);
		} catch (err) {
			console.error("Error reading PDF:", err);
			setError("Không thể đọc file PDF. Vui lòng kiểm tra lại file.");
		} finally {
			setIsLoading(false);
		}
	};

	const downloadText = () => {
		if (!text) return;

		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${fileName.replace(/\.pdf$/i, "")}.txt`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
						PDF to Text Converter
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Upload a PDF file and extract all text content
					</p>
				</div>

				{/* Upload Section */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
					<div className="flex flex-col items-center gap-4">
						<label className="cursor-pointer">
							<input
								type="file"
								accept=".pdf"
								onChange={handleFileUpload}
								className="hidden"
								id="pdf-upload"
							/>
							<div className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
								Choose PDF File
							</div>
						</label>
						{fileName && (
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Selected: <span className="font-semibold">{fileName}</span>
							</p>
						)}
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
						<div className="flex items-center justify-center gap-3">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<p className="text-gray-700 dark:text-gray-300">
								Đang xử lý PDF...
							</p>
						</div>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
						{error}
					</div>
				)}

				{/* Result Section */}
				{text && (
					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800 dark:text-white">
								Kết quả
							</h2>
							<button
								onClick={downloadText}
								className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
							>
								Download .txt
							</button>
						</div>
						<textarea
							readOnly
							value={text}
							className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm overflow-auto resize-none"
						/>
					</div>
				)}

				{/* Instructions */}
				<div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
					<p>
						💡 Supports multi-page PDFs. Text will be extracted page by page.
					</p>
				</div>
			</div>
		</main>
	);
}
