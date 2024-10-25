export async function getCurrentPrices(token: string) {
  try {
    const productResponse = await fetch(
      `http://testsvr.shunkhlai.mn:8073/api/shts.register.line?filters=[["type","=","gasol"]]`,
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

export async function getGasStations(token: string) {
  try {
    const productResponse = await fetch(
      `http://testsvr.shunkhlai.mn:8073/api/shts.register`,
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
      JSON.stringify({ error: "Failed to fetch current gas stations" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
