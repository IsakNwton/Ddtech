import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryHref, getCategory } from "@/data/categories";
import { getProduct, getRelated, productImage, products, summaries, toSummary } from "@/data/catalog";
import { getQuestions, getReviews, ratingDistribution } from "@/data/reviews";
import { ART_VIEWS, VIEW_LABELS } from "@/lib/art";
import { getProductCompat } from "@/lib/product-compat";
import { DISCLAIMER, SITE_URL, pageMetadata } from "@/lib/seo";
import { BuyBox } from "@/components/product/buy-box";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductRail } from "@/components/product/product-rail";
import { CompatSection, DescriptionSection, QuestionsSection, ReviewsSection, SpecsSection } from "@/components/product/product-sections";
import { SectionNav } from "@/components/product/section-nav";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductTags } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Rating } from "@/components/ui/rating";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Producto no encontrado" };
  return pageMetadata({
    title: `${p.brand} ${p.name}`,
    description: `${p.description.slice(0, 140)}… Precio demostrativo. ${DISCLAIMER}`,
    path: `/producto/${p.slug}`,
    image: productImage(p.slug),
  });
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const summary = toSummary(product);
  const compat = getProductCompat(product);
  const reviews = getReviews(product);
  const images = [
    { src: productImage(product.slug), label: VIEW_LABELS.main },
    ...ART_VIEWS.map((v) => ({ src: productImage(product.slug, v), label: VIEW_LABELS[v] })),
  ];
  const sections = [
    { id: "descripcion", label: "Descripción" },
    { id: "especificaciones", label: "Especificaciones" },
    { id: "compatibilidad", label: "Compatibilidad" },
    { id: "opiniones", label: "Opiniones" },
    { id: "preguntas", label: "Preguntas" },
  ];
  const crumbs = [
    product.category === "pc"
      ? { label: "PCs Gaming", href: "/pcs-gaming" }
      : category.group === "perifericos"
        ? { label: "Periféricos", href: "/perifericos" }
        : { label: "Componentes", href: "/componentes" },
    ...(product.category === "pc" ? [] : [{ label: category.name, href: categoryHref(product.category) }]),
    { label: product.name },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: `${product.brand} ${product.name}`,
          sku: product.sku,
          brand: { "@type": "Brand", name: product.brand },
          category: category.name,
          image: `${SITE_URL}${productImage(product.slug)}`,
          description: product.description,
          aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviews },
          offers: {
            "@type": "Offer",
            priceCurrency: "MXN",
            price: product.price,
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/producto/${product.slug}`,
          },
        }}
      />
      <div className="container-page pt-5">
        <Breadcrumbs items={crumbs} />
        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <ProductGallery images={images} name={product.name} badges={<ProductTags tags={product.tags} max={3} />} />
          <div className="min-w-0">
            <Link href={`/buscar?q=${encodeURIComponent(product.brand)}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-text hover:underline">
              {product.brand}
            </Link>
            <h1 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-fg sm:text-[2rem]">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-fg-subtle">
              <a href="#opiniones" className="hover:text-fg">
                <Rating value={product.rating} count={product.reviews} />
              </a>
              <span>SKU {product.sku}</span>
              <span>{category.singular}</span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Especificaciones clave">
              {product.highlights.map((h) => (
                <li key={h} className="rounded-md border border-line bg-surface-2 px-2.5 py-1.5 font-mono text-xs text-fg">
                  {h}
                </li>
              ))}
            </ul>
            <div id="buybox" className="mt-6">
              <BuyBox product={summary} msi={product.msi} builderSlot={compat?.builderSlot} />
            </div>
          </div>
        </div>

        <div className="mt-14">
          <SectionNav sections={sections} />
          <div className="mt-10 space-y-16">
            <DescriptionSection description={product.description} features={product.features} />
            <SpecsSection specs={product.specs} />
            <CompatSection compat={compat} slug={product.slug} />
            <ReviewsSection rating={product.rating} count={product.reviews} distribution={ratingDistribution(product)} reviews={reviews} />
            <QuestionsSection questions={getQuestions(product)} />
          </div>
        </div>

        <section aria-labelledby="related-title" className="mt-20">
          <ProductRail
            products={summaries(getRelated(product))}
            label="Productos relacionados"
            header={{ id: "related-title", title: "También te puede interesar", href: categoryHref(product.category), hrefLabel: `Ver ${category.name.toLowerCase()}` }}
          />
        </section>
      </div>
      <StickyBuyBar product={summary} anchorId="buybox" />
    </>
  );
}
