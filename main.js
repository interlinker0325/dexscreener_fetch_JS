const fetch = require("node-fetch");
const fs = require("fs");

(async () => {
  try {
    // Step 1: Fetch token profiles
    const profilesRes = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
      headers: { Accept: "*/*" },
    });

    const tokenProfiles = await profilesRes.json();

    const tokenData = [];

    for (const token of tokenProfiles) {
      const chainId = token.chainId;
      const tokenAddress = token.tokenAddress;
      console.log(chainId, tokenAddress, "firstround ===>");

      const pairUrl = `https://api.dexscreener.com/token-pairs/v1/${chainId}/${tokenAddress}`;

      const pairRes = await fetch(pairUrl, { headers: { Accept: "*/*" } });

      const tokenPairs = await pairRes.json();

      for (const pair of tokenPairs) {
        const chain = pair.chainId;
        const name = pair.baseToken?.name || "N/A";
        const symbol = pair.baseToken?.symbol || "N/A";
        const priceNative = pair.priceNative;
        const priceUsd = pair.priceUsd;
        const volume = pair.volume?.h24 || 0;

        tokenData.push({
          chain,
          symbol,
          name,
          priceNative,
          priceUsd,
          volume,
        });
      }
    }

    // Step 2: Write to result.json
    fs.writeFileSync("result.json", JSON.stringify(tokenData, null, 2), "utf-8");
    console.log("✅ Data saved to result.json");

  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
