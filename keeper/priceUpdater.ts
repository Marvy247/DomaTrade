const { ethers } = require("ethers");
const dotenv = require("dotenv");
const { oracleAdapterABI } = require("../Frontend/lib/abi/oracle-adapter");
const { stringToBytes32 } = require("../Frontend/lib/utils");

dotenv.config();

const ORACLE_ADAPTER_ADDRESS = "0x2a3C594853706B43893F3f977815B03F622af78b";
const DOMAIN_ID: `0x${string}` = stringToBytes32("hackathon.doma") as `0x${string}`;

const provider = new ethers.providers.JsonRpcProvider(process.env.DOMATRADE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const oracle = new ethers.Contract(ORACLE_ADAPTER_ADDRESS, oracleAdapterABI, wallet);

let currentPrice = 1500;

async function updatePrice() {
    // random walk
    const priceChange = Math.random() * 20 - 10; // between -10 and 10
    currentPrice += priceChange;

    const scaledPrice = Math.round(currentPrice * 1e6);

    try {
        const tx = await oracle.setPrice(DOMAIN_ID, BigInt(scaledPrice));
        console.log(`Updating price to ${currentPrice}, tx: ${tx.hash}`);
        await tx.wait();
        console.log("Price updated successfully");
    } catch (error) {
        console.error("Error updating price:", error);
    }
}

setInterval(updatePrice, 30000);
