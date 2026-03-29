import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

async function embed(text: string): Promise<number[]> {
	const response = await client.send(
		new InvokeModelCommand({
			modelId: "amazon.titan-embed-text-v2:0",
			contentType: "application/json",
			accept: "application/json",
			body: JSON.stringify({ inputText: text }),
		}),
	);
	const result = JSON.parse(new TextDecoder().decode(response.body));
	return result.embedding;
}

function cosineSimilarity(a: number[], b: number[]): number {
	let dot = 0;
	let magA = 0;
	let magB = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		magA += a[i] * a[i];
		magB += b[i] * b[i];
	}
	return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function spinner(message: string) {
	const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
	let i = 0;
	const id = setInterval(() => {
		process.stdout.write(`\r${frames[i++ % frames.length]} ${message}`);
	}, 80);
	return () => {
		clearInterval(id);
		process.stdout.write(`\r✓ ${message}\n`);
	};
}

// Fictional JIRA tickets — realistic mix of bugs, perf, features, and infra work.
const tickets = [
	{ id: "PROJ-101", summary: "Perf: Lazy-load hero image on landing page" },
	{ id: "PROJ-102", summary: "Perf: Remove render-blocking CSS from above-the-fold content" },
	{ id: "PROJ-103", summary: "Perf: Add srcset to product image component for responsive loading" },
	{ id: "PROJ-201", summary: "Bug: useMemo dependency array missing in CartProvider" },
	{ id: "PROJ-202", summary: "Bug: useMemo returns stale value in UserProfileContext" },
	{ id: "PROJ-203", summary: "Bug: useEffect cleanup not running on SearchFilter unmount" },
	{ id: "PROJ-301", summary: "Integrate SonarQube static analysis into CI/CD pipeline" },
	{ id: "PROJ-302", summary: "Add Datadog RUM monitoring to checkout flow" },
	{ id: "PROJ-401", summary: "Update color tokens for dark mode across navigation components" },
	{ id: "PROJ-402", summary: "Redesign mobile nav drawer to match new brand guidelines" },
];

// Embed all ticket summaries
const stop = spinner(`Embedding ${tickets.length} tickets via Titan v2...`);
const embeddings = await Promise.all(tickets.map((t) => embed(t.summary)));
stop();

// Compute all pairwise similarities
const pairs: { a: string; b: string; sim: number }[] = [];
for (let i = 0; i < tickets.length; i++) {
	for (let j = i + 1; j < tickets.length; j++) {
		pairs.push({
			a: tickets[i].id,
			b: tickets[j].id,
			sim: cosineSimilarity(embeddings[i], embeddings[j]),
		});
	}
}
pairs.sort((a, b) => b.sim - a.sim);

// Show the top 5 most similar pairs
console.log("\nTop 5 most similar ticket pairs:\n");
for (const pair of pairs.slice(0, 5)) {
	const a = tickets.find((t) => t.id === pair.a)!;
	const b = tickets.find((t) => t.id === pair.b)!;
	console.log(`  ${pair.sim.toFixed(4)}  ${a.id}: ${a.summary}`);
	console.log(`           ${b.id}: ${b.summary}\n`);
}

// Show the bottom 3 least similar pairs
console.log("Bottom 3 least similar ticket pairs:\n");
for (const pair of pairs.slice(-3)) {
	const a = tickets.find((t) => t.id === pair.a)!;
	const b = tickets.find((t) => t.id === pair.b)!;
	console.log(`  ${pair.sim.toFixed(4)}  ${a.id}: ${a.summary}`);
	console.log(`           ${b.id}: ${b.summary}\n`);
}

// Find nearest neighbor for a new query
const query = "performance optimization for web page loading";
console.log("---\n");
console.log(`Query: "${query}"\n`);
console.log("Most relevant tickets:\n");

const stopQuery = spinner("Embedding query...");
const queryEmbedding = await embed(query);
stopQuery();

const ranked = tickets
	.map((t, i) => ({ ...t, sim: cosineSimilarity(queryEmbedding, embeddings[i]) }))
	.sort((a, b) => b.sim - a.sim);

for (const t of ranked.slice(0, 3)) {
	console.log(`  ${t.sim.toFixed(4)}  ${t.id}: ${t.summary}`);
}
console.log();
