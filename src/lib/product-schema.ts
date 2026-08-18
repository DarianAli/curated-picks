import { z } from "zod";

const safeUrl = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required` })
    .max(2048, { message: `${label} is too long` })
    .refine((value) => /^https:\/\//i.test(value), {
      message: `${label} must start with https://`,
    })
    .refine((value) => !/^(javascript|data|vbscript|file):/i.test(value.trim()), {
      message: "Unsafe URL protocol",
    })
    .refine((value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, { message: `${label} must be a valid URL` });

const AMAZON_HOSTS = /(^|\.)(amazon\.[a-z.]{2,6}|amzn\.to|a\.co)$/i;

export const productSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters" }).max(160),
  slug: z
    .string()
    .trim()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug may only contain lowercase letters, numbers and dashes",
    }),
  short_description: z
    .string()
    .trim()
    .min(20, { message: "Write at least 20 characters" })
    .max(240, { message: "Keep the summary under 240 characters" }),
  description: z
    .string()
    .trim()
    .min(50, { message: "The review needs at least 50 characters" })
    .max(20000),
  image_url: safeUrl("Image URL"),
  affiliate_url: safeUrl("Affiliate URL").refine(
    (value) => {
      try {
        return AMAZON_HOSTS.test(new URL(value).hostname);
      } catch {
        return false;
      }
    },
    { message: "Must be an Amazon link (amazon.com, amzn.to or a.co)" },
  ),
  category_id: z.string().uuid().nullable(),
  pros: z.array(z.string().trim().min(1).max(180)).max(10),
  cons: z.array(z.string().trim().min(1).max(180)).max(10),
  price_indicator: z.enum(["Budget", "Mid-range", "Premium"]).nullable(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
  seo_title: z.string().trim().max(70).nullable(),
  seo_description: z.string().trim().max(180).nullable(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Use lowercase letters, numbers and dashes" }),
  description: z.string().trim().max(400).nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
