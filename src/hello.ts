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

const terms = ["cat", "kitten", "spaceship"];

const embeddings = await Promise.all(terms.map(embed));

console.log("Cosine similarities:");
for (let i = 0; i < terms.length; i++) {
	for (let j = i + 1; j < terms.length; j++) {
		const sim = cosineSimilarity(embeddings[i], embeddings[j]);
		console.log(`  "${terms[i]}" <-> "${terms[j]}": ${sim.toFixed(4)}`);
	}
}
