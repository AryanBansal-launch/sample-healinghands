/**
 * Updates the existing "Healing Bliss Aura Cleansing Spray" document
 * (slug: healing-bliss-spray) — only variants + derived price/stock fields.
 * Name, description, benefits, images, etc. are left unchanged.
 *
 * Run: npx tsx scripts/update-healing-bliss-spray-variants.ts
 * Or:  npm run db:update-healing-bliss-spray
 */

import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import dbConnect from "../lib/mongodb";
import { syncRootFromVariants } from "../lib/productVariants";
import Product from "../models/Product";

const SLUG = "healing-bliss-spray";

/** MRP per size — stock split preserves ~100 total units (adjust in admin if needed). */
const VARIANTS = [
  { label: "20 ml", price: 172, stockLeft: 35 },
  { label: "100 ml", price: 721, stockLeft: 35 },
  { label: "200 ml", price: 1270, stockLeft: 30 },
] as const;

async function main() {
  await dbConnect();

  const existing = await Product.findOne({ slug: SLUG }).lean();
  if (!existing) {
    console.error(`No product found with slug "${SLUG}". Nothing to update.`);
    process.exit(1);
  }

  const root = syncRootFromVariants([...VARIANTS]);

  const doc = await Product.findOneAndUpdate(
    { slug: SLUG },
    {
      $set: {
        variants: VARIANTS.map((v) => ({ ...v })),
        price: root.price,
        stockLeft: root.stockLeft,
        inStock: root.inStock,
      },
    },
    { returnDocument: "after", runValidators: true }
  );

  if (!doc) {
    console.error("Update failed (no document returned).");
    process.exit(1);
  }

  console.log("OK — Healing Bliss spray variants updated:");
  console.log(`  _id:   ${doc._id}`);
  console.log(`  slug:  ${doc.slug}`);
  console.log(`  name:  ${doc.name}`);
  console.log(
    `  variants:\n${VARIANTS.map((v) => `    - ${v.label}: ₹${v.price} MRP (stock ${v.stockLeft})`).join("\n")}`
  );
  console.log(`  listing price (min): ₹${doc.price}, total stock: ${doc.stockLeft}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
