import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../../database/client";
import { gasStation, product } from "../../database/schema";
import getShunkhlaiToken from "./get-shunkhlai-token";
import { getCurrentPrices, getGasStations } from "./get-current-prices";

const productRoute = new Hono().post("/sync-product-prices", async (c) => {
  try {
    const token = await getShunkhlaiToken();

    if (!token) {
      console.log("Failed to get token.");
      return;
    }

    await db.delete(gasStation);
    await db.delete(product);

    const gasStations = await getGasStations(token);
    await db.insert(gasStation).values(
      gasStations.map((station: any) => {
        return {
          shtsCode: station.shts_code,
          companyId: station.company_id,
          ...station,
        };
      })
    );

    const products = await getCurrentPrices(token);
    await db.insert(product).values(
      products.map((product: any) => {
        return {
          productId: product.product_id,
          shtsCode: product.shts_code,
          productCode: product.product_code,
          productName: product.product_name,
          ...product,
        };
      })
    );

    return c.json({ result: "success" }, 200);
  } catch (error) {
    console.log(error, "error during product update or insert");
    return c.json({ error: error }, 500);
  }
});

export default productRoute;
