import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import type { Category, Product } from "@/lib/catalog";
import { slugify } from "@/lib/catalog";
import { productSchema, type ProductFormValues } from "@/lib/product-schema";

type Props = {
  categories: Category[];
  product?: Product | undefined;
  pending: boolean;
  onSubmit: (values: ProductFormValues) => void;
};

const PRICE_BANDS = ["Budget", "Mid-range", "Premium"] as const;

export function ProductForm({ categories, product, pending, onSubmit }: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title ?? "",
      slug: product?.slug ?? "",
      short_description: product?.short_description ?? "",
      description: product?.description ?? "",
      image_url: product?.image_url ?? "",
      affiliate_url: product?.affiliate_url ?? "",
      category_id: product?.category_id ?? null,
      pros: product?.pros?.length ? product.pros : [""],
      cons: product?.cons?.length ? product.cons : [""],
      price_indicator:
        (product?.price_indicator as ProductFormValues["price_indicator"]) ?? "Mid-range",
      is_featured: product?.is_featured ?? false,
      is_published: product?.is_published ?? true,
      seo_title: product?.seo_title ?? "",
      seo_description: product?.seo_description ?? "",
    },
  });

  const { register, handleSubmit, formState, setValue, watch, control } = form;
  const pros = useFieldArray({ control, name: "pros" as never });
  const cons = useFieldArray({ control, name: "cons" as never });
  const errors = formState.errors;

  const submit = handleSubmit((values) => {
    onSubmit({
      ...values,
      pros: values.pros.map((item) => item.trim()).filter(Boolean),
      cons: values.cons.map((item) => item.trim()).filter(Boolean),
      seo_title: values.seo_title?.trim() ? values.seo_title.trim() : null,
      seo_description: values.seo_description?.trim() ? values.seo_description.trim() : null,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl">Basics</h2>

        <Field label="Title" error={errors.title?.message}>
          <input
            {...register("title", {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                if (!product) setValue("slug", slugify(event.target.value));
              },
            })}
            className={inputClass}
            maxLength={160}
          />
        </Field>

        <Field label="Slug" error={errors.slug?.message} hint="Used in the review URL.">
          <input {...register("slug")} className={inputClass} maxLength={160} />
        </Field>

        <Field
          label="Short description"
          error={errors.short_description?.message}
          hint="Shown on cards and in search results."
        >
          <textarea
            {...register("short_description")}
            rows={2}
            maxLength={240}
            className={inputClass}
          />
        </Field>

        <Field label="Full review" error={errors.description?.message}>
          <textarea
            {...register("description")}
            rows={10}
            maxLength={20000}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl">Links &amp; category</h2>

        <Field label="Image URL" error={errors.image_url?.message} hint="Must be https.">
          <input {...register("image_url")} className={inputClass} maxLength={2048} />
        </Field>

        <Field
          label="Affiliate URL"
          error={errors.affiliate_url?.message}
          hint="Amazon links only (amazon.com, amzn.to, a.co)."
        >
          <input {...register("affiliate_url")} className={inputClass} maxLength={2048} />
        </Field>

        <Field label="Category" error={errors.category_id?.message}>
          <select
            value={watch("category_id") ?? ""}
            onChange={(event) => setValue("category_id", event.target.value || null)}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Price band">
          <select
            value={watch("price_indicator") ?? ""}
            onChange={(event) =>
              setValue(
                "price_indicator",
                (event.target.value || null) as ProductFormValues["price_indicator"],
              )
            }
            className={inputClass}
          >
            <option value="">Not set</option>
            {PRICE_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <ArrayField
          title="Pros"
          name="pros"
          fields={pros.fields.map((field) => field.id)}
          register={register}
          onAdd={() => pros.append("" as never)}
          onRemove={(index) => pros.remove(index)}
        />
        <ArrayField
          title="Cons"
          name="cons"
          fields={cons.fields.map((field) => field.id)}
          register={register}
          onAdd={() => cons.append("" as never)}
          onRemove={(index) => cons.remove(index)}
        />
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl">SEO</h2>
        <Field label="SEO title" error={errors.seo_title?.message} hint="Max 70 characters.">
          <input {...register("seo_title")} className={inputClass} maxLength={70} />
        </Field>
        <Field
          label="SEO description"
          error={errors.seo_description?.message}
          hint="Max 180 characters."
        >
          <textarea
            {...register("seo_description")}
            rows={2}
            maxLength={180}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-6">
        <h2 className="font-display text-xl">Visibility</h2>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Featured</p>
            <p className="text-xs text-muted-foreground">
              Shown as the Editor's Choice on the homepage.
            </p>
          </div>
          <Switch
            checked={watch("is_featured")}
            onCheckedChange={(value) => setValue("is_featured", value)}
            aria-label="Featured"
          />
        </div>
        <div className="flex items-center justify-between gap-4 border-t pt-4">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-xs text-muted-foreground">Visible to readers on the site.</p>
          </div>
          <Switch
            checked={watch("is_published")}
            onCheckedChange={(value) => setValue("is_published", value)}
            aria-label="Published"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
      >
        {pending ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint ? <span className="ml-2 text-xs text-muted-foreground">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
      {error ? <span className="mt-1.5 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function ArrayField({
  title,
  name,
  fields,
  register,
  onAdd,
  onRemove,
}: {
  title: string;
  name: "pros" | "cons";
  fields: string[];
  register: ReturnType<typeof useForm<ProductFormValues>>["register"];
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <h2 className="font-display text-xl">{title}</h2>
      <ul className="mt-4 space-y-2">
        {fields.map((id, index) => (
          <li key={id} className="flex gap-2">
            <input
              {...register(`${name}.${index}` as const)}
              maxLength={180}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${title} item ${index + 1}`}
              className="rounded-md border px-2.5 text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add {title.toLowerCase().slice(0, -1)}
      </button>
    </section>
  );
}
