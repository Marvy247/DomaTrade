import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { domainFuturesABI } from "../Frontend/lib/abi/domain-futures";

dotenv.config();

const DOMAIN_FUTURES_ADDRESS = "0x2cb425975626593A35D570C6E0bCEe53fca1eaFE";

const provider = new ethers.providers.JsonRpcProvider(process.env.DOMATRADE_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const futures = new ethers.Contract(DOMAIN_FUTURES_ADDRESS, domainFuturesABI, wallet);

const MAINTENANCE_MARGIN = 60000000000000000; // 6%

async function liquidatePositions() {
    console.log("Checking for positions to liquidate...");

    const positionOpenedFilter = futures.filters.PositionOpened();
    const events = await futures.queryFilter(positionOpenedFilter);

    const users = events.map((event: any) => event.args!.user);
    const uniqueUsers = [...new Set(users)];

    for (const user of uniqueUsers) {
        try {
            const marginRatio = await futures.getMarginRatio(user);
            console.log(`User ${user} margin ratio: ${marginRatio}`);

            if (marginRatio.lt(MAINTENANCE_MARGIN)) {
                console.log(`Liquidating user ${user}`);
                const tx = await futures.liquidate(user);
                await tx.wait();
                console.log(`User ${user} liquidated successfully`);
            }
        } catch (error) {
            console.error(`Error liquidating user ${user}:`, error);
        }
    }
}

setInterval(liquidatePositions, 60000);
