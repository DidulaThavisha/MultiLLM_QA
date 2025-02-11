import { DataAPIClient } from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer"
import OpenAI from "openai"
import axios from "axios"

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

import "dotenv/config"

type SimilarityMetric = "cosine" | "euclidean" | "dot_product"

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, GROQ_API_KEY, HUGGINGFACE_API_KEY } = process.env


const openai = new OpenAI({
    apiKey: GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const f1Data = [
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com/',
    'https://www.bbc.co.uk/sport/formula1',
    'https://www.skysports.com/f1',
    'https://www.espn.com/f1/',
    'https://www.formula1.com/en/latest.html',
    'https://www.formula1.com/en/drivers.html',
    'https://www.formula1.com/en/teams.html',
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE })


// Define the Hugging Face model you want to use
const HF_MODEL = "sentence-transformers/all-mpnet-base-v2"

const getEmbedding = async (text) => {
  try {
    const response = await axios.post('http://192.248.10.120:8000/embedding', { text });
    return response.data.embedding;
  } catch (error) {
    console.error('Error fetching embedding:', error);
    throw error;
  }
};

  

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
})

const createCollection = async (similarity: SimilarityMetric  = "dot_product") => {
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            metric: similarity,
            dimension: 768
        }
    })
    console.log(res)
}

const loadSampleData = async () => {
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of f1Data) {
        const content = await scrapePage(url)

        // const text = await loader.load()
        const chunks = await splitter.splitText(content)
        for (const chunk of chunks) {
   
            const vector = await getEmbedding(chunk)

            const res = await collection.insertOne({
                $vector: vector,
                text: chunk
            })
            console.log(res)
        }
    }
}

const scrapePage = async (url: string) => {
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true
        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser) => {
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }

    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}

createCollection().then(() => loadSampleData())