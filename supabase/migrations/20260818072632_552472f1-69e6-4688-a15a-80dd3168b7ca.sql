CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  pros TEXT[] NOT NULL DEFAULT '{}',
  cons TEXT[] NOT NULL DEFAULT '{}',
  price_indicator TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_published ON public.products(is_published);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update categories" ON public.categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete categories" ON public.categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Public can read published products" ON public.products FOR SELECT TO anon USING (is_published = true);
CREATE POLICY "Authenticated can read all products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete products" ON public.products FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (name, slug, description) VALUES
('Home Office', 'home-office', 'Desks, chairs and accessories that make working from home feel deliberate.'),
('Kitchen', 'kitchen', 'Tools we reach for every single day, tested over months of real cooking.'),
('Audio', 'audio', 'Headphones and speakers judged on sound, comfort and longevity.'),
('Outdoors', 'outdoors', 'Gear that survives weather, mileage and repeated abuse.'),
('Sleep', 'sleep', 'Bedding and bedroom essentials for cooler, quieter nights.'),
('Everyday Carry', 'everyday-carry', 'Small objects with outsized impact on your daily routine.');

INSERT INTO public.products (title, slug, short_description, description, image_url, affiliate_url, category_id, pros, cons, price_indicator, is_featured, is_published, seo_title, seo_description) VALUES
('Herman Miller Aeron Chair', 'herman-miller-aeron-chair', 'The reference standard for all-day sitting, still unmatched after 200 hours of testing.', 'We sat in the Aeron for eight hours a day across four months, alternating between three testers of different heights. The suspension mesh remains the best solution we have found for long sessions: it disperses heat instead of trapping it, and it does not compress into a hammock the way foam cushions do. Assembly is essentially zero, the adjustment levers are legible without a manual, and the 12-year warranty means this is likely the last chair you buy this decade. The price is genuinely high, but amortised across that warranty it costs less per year than most mid-range chairs you will replace twice.', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B01N1QW6NW?tag=example-20', (SELECT id FROM public.categories WHERE slug='home-office'), ARRAY['Breathable mesh stays cool over long sessions','Twelve-year warranty covers nearly every part','Adjustments are intuitive and hold their position'], ARRAY['Very expensive up front','Firm seat feels stark for the first week'], 'Premium', true, true, 'Herman Miller Aeron Review — Our Top Office Chair Pick', 'After 200 hours of testing, the Aeron remains our top recommendation for all-day desk work.'),
('Anker 737 Power Bank', 'anker-737-power-bank', 'A 24,000mAh brick that charges a laptop and still fits in a tote bag.', 'Most power banks that claim laptop charging quietly deliver 30W and stall. The 737 pushes a genuine 140W over USB-C and refilled a 14-inch laptop from 10 to 80 percent in under an hour in our tests. The small display is more useful than it sounds: knowing exact remaining watt-hours removes the guesswork before a flight. It is heavy and it is not cheap, but it replaces three separate chargers in a bag.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B0B4DHRJPS?tag=example-20', (SELECT id FROM public.categories WHERE slug='everyday-carry'), ARRAY['True 140W output charges laptops quickly','Readout shows exact remaining capacity','Replaces multiple travel chargers'], ARRAY['Heavy at over 600 grams','Overkill if you only carry a phone'], 'Mid-range', false, true, 'Anker 737 Power Bank Review', 'A 140W power bank that genuinely charges laptops — here is how it held up in testing.'),
('Lodge Cast Iron Skillet 12"', 'lodge-cast-iron-skillet-12', 'The cheapest pan that will outlive every other pan in your kitchen.', 'We seared, roasted, baked cornbread and shallow-fried in this skillet for six months without a single failure. Pre-seasoning out of the box is serviceable rather than great; two rounds of oil at high heat gave us a slick surface that released eggs cleanly. Heat retention is the real argument here — steaks come off with a crust that thin stainless simply cannot produce. The handle gets dangerously hot, so budget for a leather sleeve.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B00006JSUA?tag=example-20', (SELECT id FROM public.categories WHERE slug='kitchen'), ARRAY['Exceptional heat retention for searing','Costs a fraction of clad stainless','Effectively unbreakable with basic care'], ARRAY['Handle gets very hot','Needs drying and oiling after washing'], 'Budget', true, true, 'Lodge 12-inch Cast Iron Skillet Review', 'Six months of daily cooking with the Lodge 12-inch skillet — still our best value pan.'),
('Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5-headphones', 'Class-leading noise cancelling with a lighter, quieter fit than the previous generation.', 'On three long-haul flights and dozens of commutes, the XM5 removed low-frequency engine noise more completely than anything else we tested. The redesigned headband spreads weight better, and after four hours we forgot they were on. Call quality is the biggest upgrade: callers stopped asking us to repeat ourselves. The trade-off is that they no longer fold flat, so the case is bulkier than before.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B09XS7JWHH?tag=example-20', (SELECT id FROM public.categories WHERE slug='audio'), ARRAY['Best-in-class low-frequency cancellation','Comfortable for four-hour stretches','Noticeably clearer call microphones'], ARRAY['No longer folds flat','Glossy plastic shows fingerprints'], 'Premium', false, true, 'Sony WH-1000XM5 Review', 'Our long-haul testing notes on Sony''s flagship noise cancelling headphones.'),
('Zojirushi Water Boiler', 'zojirushi-water-boiler', 'Instant hot water at four preset temperatures, all day, without rebooting a kettle.', 'If you drink tea or pour-over coffee more than twice a day, a holding boiler changes the ritual. Ours held 195F for weeks at a time with negligible drift and the dispense button gave us a controllable, slow pour. It is a large appliance for a small job, and it must live near an outlet — but we stopped waiting for water entirely.', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B000IBXBMY?tag=example-20', (SELECT id FROM public.categories WHERE slug='kitchen'), ARRAY['Holds precise temperature indefinitely','Slow dispense suits pour-over coffee','Very well built and quiet'], ARRAY['Takes up real counter space','Must stay plugged in to hold heat'], 'Mid-range', false, true, 'Zojirushi Water Boiler Review', 'Why a holding water boiler beats a kettle if you brew more than twice a day.'),
('Uplift V2 Standing Desk', 'uplift-v2-standing-desk', 'The most stable sit-stand frame we tested at any price under $1,000.', 'We loaded the V2 with two monitors, a laptop arm and a speaker pair, then raised and lowered it a hundred times. Wobble at standing height — the failure point for most desks — stayed minimal thanks to the crossbar frame. The memory presets are reliable, and the cable management accessories are worth adding at checkout rather than later.', 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B07YKGBHW7?tag=example-20', (SELECT id FROM public.categories WHERE slug='home-office'), ARRAY['Minimal wobble at full standing height','Wide accessory ecosystem','Quiet, quick motors with memory presets'], ARRAY['Assembly takes about an hour','Desktop finishes vary in quality'], 'Premium', false, true, 'Uplift V2 Standing Desk Review', 'Stability testing notes on the Uplift V2 sit-stand desk frame.'),
('Darn Tough Hiker Socks', 'darn-tough-hiker-socks', 'Merino socks with an unconditional lifetime guarantee that we have actually used.', 'Four pairs, two seasons, roughly 300 trail miles. No holes, no thinning at the heel, and no blisters on multi-day trips. The merino blend manages moisture well enough that we wore the same pair two days running without regret. They cost three times what a supermarket pack does; they lasted longer than four such packs.', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B002TOHRO0?tag=example-20', (SELECT id FROM public.categories WHERE slug='outdoors'), ARRAY['Unconditional lifetime guarantee','No blisters over long trail days','Merino manages odour well'], ARRAY['Expensive per pair','Limited colour choices'], 'Mid-range', false, true, 'Darn Tough Hiker Socks Review', '300 trail miles in Darn Tough merino hiking socks.'),
('Coop Original Pillow', 'coop-original-pillow', 'An adjustable shredded-foam pillow you can tune to your sleeping position.', 'The premise is simple: unzip it and remove fill until the loft matches your neck. Our side sleeper kept nearly all of it, our back sleeper removed about a third, and both reported less morning stiffness within a week. There is an initial off-gassing smell that faded in two days, and the foam needs occasional fluffing to avoid clumping.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B00EINBSEW?tag=example-20', (SELECT id FROM public.categories WHERE slug='sleep'), ARRAY['Fill is fully adjustable to your position','Machine-washable cover','Holds shape better than down alternatives'], ARRAY['Mild off-gassing for the first days','Needs periodic fluffing'], 'Mid-range', false, true, 'Coop Original Pillow Review', 'How the adjustable Coop Original pillow performed for side and back sleepers.'),
('Kindle Paperwhite', 'kindle-paperwhite', 'The reading device that finally feels closer to paper than to a screen.', 'Warm front lighting is the feature that made the difference in our testing: reading in bed no longer felt like staring at a lamp. Battery life ran to roughly six weeks at thirty minutes a night, and the waterproofing survived a genuinely careless bath incident. Page turns are fast enough that we stopped noticing them.', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B08KTZ8249?tag=example-20', (SELECT id FROM public.categories WHERE slug='everyday-carry'), ARRAY['Adjustable warm front light','Weeks of battery per charge','Waterproof and genuinely pocketable'], ARRAY['Locked to one bookstore ecosystem','Lock screen ads unless you pay to remove them'], 'Mid-range', false, true, 'Kindle Paperwhite Review', 'Why the warm-light Paperwhite is our default recommendation for readers.'),
('Hydro Flask Wide Mouth 32oz', 'hydro-flask-wide-mouth-32oz', 'Ice survives a full workday in a hot car — we timed it.', 'We filled it with ice water at 8am and still had ice at 6pm after the bottle sat in a parked car. The wide mouth accepts standard ice cubes and a bottle brush, which matters more for cleaning than for drinking. The powder coat chips if you drop it on concrete, and the flex cap adds noticeable height in a cup holder.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B084NW9K5T?tag=example-20', (SELECT id FROM public.categories WHERE slug='outdoors'), ARRAY['Holds ice for a full day','Wide mouth is easy to clean','No metallic aftertaste'], ARRAY['Powder coat chips when dropped','Tall for some cup holders'], 'Mid-range', false, true, 'Hydro Flask 32oz Review', 'Insulation testing results for the Hydro Flask Wide Mouth 32oz.'),
('Kasa Smart Plug Mini', 'kasa-smart-plug-mini', 'The most reliable cheap smart plug we have kept plugged in for a year.', 'We ran four of these on lamps and a coffee grinder for a year. Schedules fired on time, the plugs reconnected after two router changes without intervention, and the app never required an account migration. They are compact enough not to block the second outlet, which is where most rivals fail.', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B08D6RN3TC?tag=example-20', (SELECT id FROM public.categories WHERE slug='home-office'), ARRAY['Reliable schedules and reconnection','Compact enough to pair on one outlet','Very inexpensive'], ARRAY['Requires a cloud account','2.4GHz Wi-Fi only'], 'Budget', false, true, 'Kasa Smart Plug Mini Review', 'A year of daily use with the Kasa Smart Plug Mini.'),
('OXO Good Grips Peeler', 'oxo-good-grips-peeler', 'A three-dollar tool that shipped the design language of an entire industry.', 'We peeled roughly twenty kilos of vegetables comparing five peelers. The OXO stayed comfortable longest, largely because the cushioned handle does not press into the palm as you apply force. The blade dulls after a couple of years of heavy use, at which point replacement costs less than sharpening anything else.', 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=1200&q=80', 'https://www.amazon.com/dp/B00004OCNS?tag=example-20', (SELECT id FROM public.categories WHERE slug='kitchen'), ARRAY['Comfortable through long prep sessions','Sharp out of the box','Costs almost nothing'], ARRAY['Blade eventually dulls and is not replaceable','Handle is bulky in small drawers'], 'Budget', false, true, 'OXO Good Grips Peeler Review', 'The peeler that beat four rivals across twenty kilos of vegetables.');