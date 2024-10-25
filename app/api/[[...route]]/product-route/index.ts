import { Hono } from "hono";
import getCurrentPrices from "./get-current-prices";
import { db } from "../../database/client";
import { gas_station, product } from "../../database/schema";
import getShunkhlaiToken from "./get-shunkhlai-token";
import { eq } from "drizzle-orm";

const productRoute = new Hono().post("sync-product-prices", async (c) => {
  try {
    const token = await getShunkhlaiToken();
    if (token) {
      const stations = await db.query.gas_station.findMany({});

      for (let station of stations) {
        const shtsCode = station.shtsCode;
        if (shtsCode) {
          const products = await getCurrentPrices(token, shtsCode);

          for (let prod of products) {
            console.log(`Processing product with ID: ${prod.product_id}`);

            const singleProduct = await db.query.product.findFirst({
              where: eq(product.productId, prod.product_id),
            });

            if (singleProduct) {
              console.log(
                `Updating existing product with ID: ${singleProduct.productId}`
              );
              const transaction = await db.transaction(async (tx) => {
                const updatedProduct = await tx
                  .update(product)
                  .set({ price: prod.price })
                  .where(
                    eq(product.productId, Number(singleProduct.productId))
                  );

                return updatedProduct;
              });
              console.log("Product updated successfully.");
            } else {
              console.log(`Inserting new product with ID: ${prod.product_id}`);
              const transaction = await db.transaction(async (tx) => {
                const newProduct = await tx.insert(product).values({
                  updatedAt: new Date(),
                  type: prod.type,
                  productId: prod.product_id,
                  shtsCode: prod.shts_code,
                  productCode: prod.product_code,
                  productName: prod.product_name,
                  uom: prod.uom,
                  vattype: prod.vattype,
                  price: prod.price,
                  barcode: prod.barcode,
                });

                return newProduct;
              });
              console.log("Product inserted");
            }
          }
        }
      }
      return c.json({ result: "success" }, 200);
    } else {
      console.log("Failed to get token.");
    }
  } catch (error) {
    console.log(error, "error during product update or insert");
    return c.json({ error: error }, 500);
  }
});

export default productRoute;
