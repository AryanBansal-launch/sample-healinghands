"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ProductImageGallery from "@/components/shop/ProductImageGallery";
import ProductBuyActions, {
  type ProductBuyActionsProduct,
} from "@/components/shop/ProductBuyActions";
import { mergeGalleryForVariant } from "@/lib/normalizeProductImages";

type Product = ProductBuyActionsProduct & {
  description: string;
  benefits: string[];
  usageInstructions: string[];
  safetyNotes: string;
  images: string[];
};

function initialVariantId(variants: ProductBuyActionsProduct["variants"]): string {
  const first = variants.find((v) => v.inStock) ?? variants[0];
  return first?.id ?? "";
}

export default function ProductShopColumn({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() =>
    initialVariantId(product.variants)
  );

  useEffect(() => {
    setSelectedVariantId(initialVariantId(product.variants));
  }, [product.slug, product.variants]);

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId),
    [product.variants, selectedVariantId]
  );

  const galleryImages = useMemo(
    () => mergeGalleryForVariant(product.images, selected?.image),
    [product.images, selected?.image]
  );

  const onSelectVariant = useCallback((id: string) => {
    setSelectedVariantId(id);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
      <ProductImageGallery images={galleryImages} alt={product.name} />
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-700 mb-2">
            The Healing Hands — Shop
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <ProductBuyActions
            product={product}
            selectedVariantId={selectedVariantId}
            onSelectVariant={onSelectVariant}
          />
        </div>
        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>
    </div>
  );
}
