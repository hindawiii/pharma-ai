-- ============ EXTENSIONS ============
create extension if not exists pg_trgm;

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age int,
  allergies text[] not null default '{}',
  chronic_conditions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "users delete own profile" on public.profiles
  for delete to authenticated using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ DRUGS ============
create table public.drugs (
  id uuid primary key default gen_random_uuid(),
  brand_ar text not null,
  brand_en text not null,
  scientific_ar text not null,
  scientific_en text not null,
  category_ar text,
  manufacturer text,
  price_sdg numeric,
  form text, -- tablet | syrup | injection
  description_ar text,
  search_doc tsvector
    generated always as (
      to_tsvector('simple',
        coalesce(brand_ar,'') || ' ' || coalesce(brand_en,'') || ' ' ||
        coalesce(scientific_ar,'') || ' ' || coalesce(scientific_en,'') || ' ' ||
        coalesce(category_ar,'')
      )
    ) stored,
  created_at timestamptz not null default now()
);

create index drugs_search_idx on public.drugs using gin(search_doc);
create index drugs_brand_ar_trgm on public.drugs using gin(brand_ar gin_trgm_ops);
create index drugs_brand_en_trgm on public.drugs using gin(brand_en gin_trgm_ops);
create index drugs_sci_ar_trgm on public.drugs using gin(scientific_ar gin_trgm_ops);
create index drugs_sci_en_trgm on public.drugs using gin(scientific_en gin_trgm_ops);

alter table public.drugs enable row level security;
create policy "drugs public read" on public.drugs for select using (true);

-- ============ INTERACTIONS ============
create type public.interaction_severity as enum ('danger','warning','safe');

create table public.drug_interactions (
  id uuid primary key default gen_random_uuid(),
  drug_a uuid not null references public.drugs(id) on delete cascade,
  drug_b uuid not null references public.drugs(id) on delete cascade,
  severity public.interaction_severity not null,
  description_ar text not null,
  created_at timestamptz not null default now(),
  unique(drug_a, drug_b)
);

alter table public.drug_interactions enable row level security;
create policy "interactions public read" on public.drug_interactions for select using (true);

-- ============ REMINDERS ============
create type public.reminder_frequency as enum ('daily','weekdays','interval');

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  drug_id uuid references public.drugs(id) on delete set null,
  drug_name text not null,
  frequency public.reminder_frequency not null default 'daily',
  weekdays smallint[] default '{}', -- 0=Sun..6=Sat
  interval_hours smallint, -- when frequency='interval'
  times time[] default '{}', -- when daily/weekdays
  start_date date not null default current_date,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.reminders enable row level security;
create policy "reminders own select" on public.reminders for select to authenticated using (auth.uid() = user_id);
create policy "reminders own insert" on public.reminders for insert to authenticated with check (auth.uid() = user_id);
create policy "reminders own update" on public.reminders for update to authenticated using (auth.uid() = user_id);
create policy "reminders own delete" on public.reminders for delete to authenticated using (auth.uid() = user_id);

-- ============ PHARMACIES ============
create table public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  lat numeric,
  lng numeric,
  phone text,
  open_24h boolean default false,
  created_at timestamptz not null default now()
);

alter table public.pharmacies enable row level security;
create policy "pharmacies public read" on public.pharmacies for select using (true);

-- ============ SEED: DRUGS (sample of common AR/EN meds) ============
insert into public.drugs (brand_ar, brand_en, scientific_ar, scientific_en, category_ar, manufacturer, price_sdg, form, description_ar) values
('بنادول', 'Panadol', 'باراسيتامول', 'Paracetamol', 'مسكن وخافض حرارة', 'GSK', 850, 'tablet', 'مسكن للألم وخافض للحرارة آمن في معظم الحالات.'),
('بنادول إكسترا', 'Panadol Extra', 'باراسيتامول وكافيين', 'Paracetamol + Caffeine', 'مسكن قوي', 'GSK', 1100, 'tablet', 'مسكن مع كافيين لزيادة الفعالية.'),
('بروفين', 'Brufen', 'إيبوبروفين', 'Ibuprofen', 'مضاد التهاب', 'Abbott', 950, 'tablet', 'مضاد التهاب غير ستيرويدي.'),
('فولتارين', 'Voltaren', 'ديكلوفيناك', 'Diclofenac', 'مضاد التهاب', 'Novartis', 1200, 'tablet', 'لتخفيف آلام المفاصل والروماتيزم.'),
('أوجمنتين', 'Augmentin', 'أموكسيسيلين وحمض الكلافولانيك', 'Amoxicillin + Clavulanic Acid', 'مضاد حيوي', 'GSK', 3500, 'tablet', 'مضاد حيوي واسع الطيف.'),
('أموكسيل', 'Amoxil', 'أموكسيسيلين', 'Amoxicillin', 'مضاد حيوي', 'GSK', 1800, 'tablet', 'مضاد حيوي بنسليني.'),
('زيثروماكس', 'Zithromax', 'أزيثرومايسين', 'Azithromycin', 'مضاد حيوي', 'Pfizer', 4200, 'tablet', 'مضاد حيوي ماكروليد.'),
('سيبروباي', 'Ciprobay', 'سيبروفلوكساسين', 'Ciprofloxacin', 'مضاد حيوي', 'Bayer', 2800, 'tablet', 'مضاد حيوي كينولوني.'),
('فلاجيل', 'Flagyl', 'ميترونيدازول', 'Metronidazole', 'مضاد طفيليات', 'Sanofi', 900, 'tablet', 'علاج العدوى البكتيرية واللاهوائية.'),
('فنتولين', 'Ventolin', 'سالبيوتامول', 'Salbutamol', 'موسع شعب', 'GSK', 2200, 'syrup', 'موسع للشعب الهوائية لعلاج الربو.'),
('سيريتايد', 'Seretide', 'فلوتيكازون وسالميتيرول', 'Fluticasone + Salmeterol', 'علاج الربو', 'GSK', 8500, 'injection', 'بخاخ لعلاج الربو المزمن.'),
('كونكور', 'Concor', 'بيسوبرولول', 'Bisoprolol', 'علاج ضغط', 'Merck', 2400, 'tablet', 'حاصر بيتا لعلاج ضغط الدم.'),
('نورفاسك', 'Norvasc', 'أملوديبين', 'Amlodipine', 'علاج ضغط', 'Pfizer', 2600, 'tablet', 'حاصر قنوات الكالسيوم.'),
('كابوتين', 'Capoten', 'كابتوبريل', 'Captopril', 'علاج ضغط', 'BMS', 1900, 'tablet', 'مثبط للإنزيم المحول للأنجيوتنسين.'),
('لوزارتان', 'Cozaar', 'لوسارتان', 'Losartan', 'علاج ضغط', 'MSD', 2300, 'tablet', 'حاصر مستقبلات الأنجيوتنسين.'),
('غلوكوفاج', 'Glucophage', 'ميتفورمين', 'Metformin', 'علاج سكري', 'Merck', 1500, 'tablet', 'علاج خط أول لمرض السكري النوع الثاني.'),
('أماريل', 'Amaryl', 'غليميبرايد', 'Glimepiride', 'علاج سكري', 'Sanofi', 1700, 'tablet', 'يحفز إفراز الإنسولين.'),
('لانتوس', 'Lantus', 'إنسولين غلارجين', 'Insulin Glargine', 'علاج سكري', 'Sanofi', 9500, 'injection', 'إنسولين طويل المفعول.'),
('أسبرين', 'Aspirin', 'حمض أسيتيل الساليسيليك', 'Acetylsalicylic Acid', 'مسيل دم', 'Bayer', 700, 'tablet', 'مسكن ومضاد تخثر بجرعات منخفضة.'),
('وارفارين', 'Marevan', 'وارفارين', 'Warfarin', 'مسيل دم', 'Orion', 2100, 'tablet', 'مضاد تخثر يحتاج متابعة دورية.'),
('بلافيكس', 'Plavix', 'كلوبيدوغريل', 'Clopidogrel', 'مسيل دم', 'Sanofi', 5500, 'tablet', 'يمنع التصاق الصفائح الدموية.'),
('أوميبرازول', 'Losec', 'أوميبرازول', 'Omeprazole', 'علاج معدة', 'AstraZeneca', 1600, 'tablet', 'مثبط مضخة البروتون لقرحة المعدة.'),
('نيكسيوم', 'Nexium', 'إيزوميبرازول', 'Esomeprazole', 'علاج معدة', 'AstraZeneca', 3200, 'tablet', 'مثبط مضخة البروتون.'),
('زانتاك', 'Zantac', 'رانيتيدين', 'Ranitidine', 'علاج معدة', 'GSK', 1400, 'tablet', 'حاصر مستقبلات الهيستامين H2.'),
('موتيليوم', 'Motilium', 'دومبيريدون', 'Domperidone', 'علاج غثيان', 'Janssen', 1800, 'tablet', 'لعلاج الغثيان وعسر الهضم.'),
('بريدنيزون', 'Deltasone', 'بريدنيزولون', 'Prednisolone', 'كورتيزون', 'Pfizer', 1300, 'tablet', 'كورتيكوستيرويد مضاد التهاب قوي.'),
('كلاريتين', 'Claritine', 'لوراتادين', 'Loratadine', 'مضاد حساسية', 'Bayer', 1200, 'tablet', 'مضاد هيستامين غير مسبب للنعاس.'),
('زيرتك', 'Zyrtec', 'سيتيريزين', 'Cetirizine', 'مضاد حساسية', 'UCB', 1100, 'tablet', 'مضاد هيستامين لعلاج الحساسية.'),
('تيلفاست', 'Telfast', 'فيكسوفينادين', 'Fexofenadine', 'مضاد حساسية', 'Sanofi', 2400, 'tablet', 'مضاد هيستامين طويل المفعول.'),
('ليبيتور', 'Lipitor', 'أتورفاستاتين', 'Atorvastatin', 'علاج كوليسترول', 'Pfizer', 3800, 'tablet', 'يخفض الكوليسترول الضار.'),
('كرستور', 'Crestor', 'روسوفاستاتين', 'Rosuvastatin', 'علاج كوليسترول', 'AstraZeneca', 4500, 'tablet', 'ستاتين قوي لخفض الكوليسترول.'),
('ليفوثيروكسين', 'Eltroxin', 'ليفوثيروكسين', 'Levothyroxine', 'هرمون درقي', 'GSK', 1700, 'tablet', 'لعلاج قصور الغدة الدرقية.'),
('ميتوبرولول', 'Betaloc', 'ميتوبرولول', 'Metoprolol', 'علاج قلب', 'AstraZeneca', 2100, 'tablet', 'حاصر بيتا للقلب.'),
('ديجوكسين', 'Lanoxin', 'ديجوكسين', 'Digoxin', 'علاج قلب', 'GSK', 1500, 'tablet', 'يقوي ضربات القلب.'),
('فاليوم', 'Valium', 'ديازيبام', 'Diazepam', 'مهدئ', 'Roche', 1900, 'tablet', 'بنزوديازيبين لعلاج القلق.'),
('زاناكس', 'Xanax', 'ألبرازولام', 'Alprazolam', 'مهدئ', 'Pfizer', 2700, 'tablet', 'لعلاج اضطرابات القلق.'),
('بروزاك', 'Prozac', 'فلوكسيتين', 'Fluoxetine', 'مضاد اكتئاب', 'Eli Lilly', 3100, 'tablet', 'مضاد اكتئاب من فئة SSRI.'),
('ترامادول', 'Tramal', 'ترامادول', 'Tramadol', 'مسكن قوي', 'Grunenthal', 2900, 'tablet', 'مسكن أفيوني للألم المتوسط والشديد.'),
('كودايين', 'Codipront', 'كودايين', 'Codeine', 'مسكن سعال', 'Mack', 2300, 'syrup', 'مسكن للسعال يحتوي على أفيون خفيف.'),
('فيتامين د', 'Vidrop', 'كوليكالسيفيرول', 'Cholecalciferol', 'فيتامين', 'Medical Union', 1800, 'syrup', 'مكمل فيتامين د.'),
('سنتروم', 'Centrum', 'فيتامينات متعددة', 'Multivitamin', 'مكمل غذائي', 'Pfizer', 4200, 'tablet', 'فيتامينات ومعادن متعددة.'),
('فيروز', 'Ferose', 'سلفات الحديد', 'Ferrous Sulfate', 'علاج أنيميا', 'Pharco', 1100, 'tablet', 'علاج فقر الدم بنقص الحديد.'),
('فولتارين جل', 'Voltaren Gel', 'ديكلوفيناك جل', 'Diclofenac Gel', 'مسكن موضعي', 'Novartis', 1900, 'tablet', 'جل موضعي لآلام المفاصل.'),
('باراسيتامول شراب', 'Adol Syrup', 'باراسيتامول شراب', 'Paracetamol Syrup', 'مسكن للأطفال', 'JPI', 950, 'syrup', 'شراب خافض حرارة للأطفال.'),
('أزولين', 'Otrivin', 'زيلوميتازولين', 'Xylometazoline', 'علاج زكام', 'Novartis', 1300, 'syrup', 'بخاخ أنف لعلاج الاحتقان.'),
('سترودال', 'Strepsils', 'أميل ميتاكريسول', 'Amylmetacresol', 'علاج حلق', 'Reckitt', 800, 'tablet', 'أقراص استحلاب لالتهاب الحلق.'),
('سبازمو', 'Buscopan', 'هيوسين بوتيل بروميد', 'Hyoscine Butylbromide', 'مضاد تشنج', 'Boehringer', 1500, 'tablet', 'لعلاج المغص والتشنجات.'),
('إموكس', 'Imodium', 'لوبيراميد', 'Loperamide', 'علاج إسهال', 'Janssen', 1200, 'tablet', 'لعلاج الإسهال الحاد.'),
('سيرفيلاكس', 'Lactulose', 'لاكتولوز', 'Lactulose', 'علاج إمساك', 'Solvay', 2100, 'syrup', 'ملين لعلاج الإمساك المزمن.'),
('ميوكوسولفان', 'Mucosolvan', 'أمبروكسول', 'Ambroxol', 'طارد بلغم', 'Boehringer', 1700, 'syrup', 'طارد للبلغم.'),
('ديكستروميتورفان', 'Tussidex', 'ديكستروميتورفان', 'Dextromethorphan', 'مثبط سعال', 'Sanofi', 1400, 'syrup', 'مثبط للسعال الجاف.');

-- ============ SEED: INTERACTIONS ============
-- Helper: insert by english brand pairs
do $$
declare a_id uuid; b_id uuid;
begin
  -- Warfarin + Aspirin -> DANGER
  select id into a_id from public.drugs where brand_en='Marevan' limit 1;
  select id into b_id from public.drugs where brand_en='Aspirin' limit 1;
  insert into public.drug_interactions(drug_a, drug_b, severity, description_ar)
  values (a_id, b_id, 'danger', 'خطر شديد: زيادة كبيرة في خطر النزيف عند الجمع بين الوارفارين والأسبرين.');

  -- Warfarin + Ibuprofen -> DANGER
  select id into b_id from public.drugs where brand_en='Brufen' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'danger', 'خطر: الإيبوبروفين يزيد من تأثير الوارفارين ويرفع خطر النزيف.', now());

  -- Plavix + Aspirin -> WARNING
  select id into a_id from public.drugs where brand_en='Plavix' limit 1;
  select id into b_id from public.drugs where brand_en='Aspirin' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'warning', 'تحذير: يزيد خطر النزيف. استشر الطبيب قبل الجمع بينهما.', now());

  -- Ciprofloxacin + Antacid (Omeprazole) -> WARNING
  select id into a_id from public.drugs where brand_en='Ciprobay' limit 1;
  select id into b_id from public.drugs where brand_en='Losec' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'warning', 'تحذير: قد يقلل امتصاص السيبروفلوكساسين. افصل بين الجرعتين ساعتين على الأقل.', now());

  -- Metformin + Captopril -> SAFE
  select id into a_id from public.drugs where brand_en='Glucophage' limit 1;
  select id into b_id from public.drugs where brand_en='Capoten' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'safe', 'آمن: لا يوجد تعارض معروف. يمكن استخدامهما معاً.', now());

  -- Paracetamol + Ibuprofen -> SAFE
  select id into a_id from public.drugs where brand_en='Panadol' limit 1;
  select id into b_id from public.drugs where brand_en='Brufen' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'safe', 'آمن: يستخدمان معاً بأمان للسيطرة على الألم.', now());

  -- Tramadol + Diazepam -> DANGER
  select id into a_id from public.drugs where brand_en='Tramal' limit 1;
  select id into b_id from public.drugs where brand_en='Valium' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'danger', 'خطر: قد يسبب تثبيط الجهاز التنفسي. تجنب الجمع.', now());

  -- Fluoxetine + Tramadol -> DANGER (serotonin syndrome)
  select id into a_id from public.drugs where brand_en='Prozac' limit 1;
  select id into b_id from public.drugs where brand_en='Tramal' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'danger', 'خطر: احتمال متلازمة السيروتونين. لا يجمعان إلا بإشراف طبي.', now());

  -- Atorvastatin + Erythromycin-like (Azithromycin) -> WARNING
  select id into a_id from public.drugs where brand_en='Lipitor' limit 1;
  select id into b_id from public.drugs where brand_en='Zithromax' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'warning', 'تحذير: قد يزيد من خطر الأعراض الجانبية للستاتين.', now());

  -- Bisoprolol + Salbutamol -> WARNING
  select id into a_id from public.drugs where brand_en='Concor' limit 1;
  select id into b_id from public.drugs where brand_en='Ventolin' limit 1;
  insert into public.drug_interactions values (gen_random_uuid(), a_id, b_id, 'warning', 'تحذير: قد يقلل البيسوبرولول من مفعول السالبيوتامول للربو.', now());
end $$;

-- ============ SEED: PHARMACIES (Khartoum sample) ============
insert into public.pharmacies (name, address, city, lat, lng, phone, open_24h) values
('صيدلية النيل', 'شارع الجمهورية', 'الخرطوم', 15.5007, 32.5599, '+249912345678', true),
('صيدلية الشفاء', 'العمارات شارع 15', 'الخرطوم', 15.5777, 32.5599, '+249912345679', false),
('صيدلية الحياة', 'بحري - شمبات', 'بحري', 15.6394, 32.5450, '+249912345680', true),
('صيدلية أم درمان المركزية', 'أم درمان - السوق الكبير', 'أم درمان', 15.6500, 32.4833, '+249912345681', false),
('صيدلية الأمل', 'الرياض - شارع المعونة', 'الخرطوم', 15.5950, 32.5800, '+249912345682', true);
