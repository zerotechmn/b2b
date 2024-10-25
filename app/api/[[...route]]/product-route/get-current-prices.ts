export default async function getCurrentPrices(
  token: string,
  shtsCode: string | null
) {
  try {
    const productResponse = await fetch(
      `http://testsvr.shunkhlai.mn:8073/api/shts.register.line?filters=[["type","=","gasol"],["shts_code","=","${shtsCode}"]]`,
      {
        headers: {
          "Access-token": token,
        },
      }
    );
    const products = await productResponse.json();
    return products.result;
  } catch (error) {
    console.error("Error fetching current prices:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch current prices" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
