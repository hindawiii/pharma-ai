import { MapPin, Bell, Pill, AlertTriangle, FileText, Share2, Heart, Zap } from "lucide-react";

const features = [
  { icon: MapPin, title: "خريطة سلسة داخل التطبيق", desc: "ملاحة كاملة للوصول إلى أقرب صيدلية، مستشفى، أو هلال أحمر دون مغادرة التطبيق.", color: "from-primary to-primary-glow" },
  { icon: Bell, title: "منبه الجرعات الذكي", desc: "تذكير دقيق بمواعيد الدواء مع تنبيهات مزدوجة للمراقبين من الأهل.", color: "from-secondary to-secondary-glow" },
  { icon: Pill, title: "محرك البدائل", desc: "اقتراح أدوية بديلة بنفس المادة الفعالة — أرخص أو أكثر توفراً.", color: "from-accent to-secondary" },
  { icon: AlertTriangle, title: "تداخلات الأدوية", desc: "تحذير آلي فوري عند وجود تعارض بين الأدوية الموصوفة.", color: "from-warning to-destructive" },
  { icon: FileText, title: "السجل الطبي الرقمي", desc: "أرشفة آمنة لكل روشتاتك السابقة للرجوع إليها وقتما تشاء.", color: "from-primary to-accent" },
  { icon: Heart, title: "نصائح صحية يومية", desc: "إشعارات توعوية مخصصة بناءً على ملفك الصحي واهتماماتك.", color: "from-secondary to-success" },
  { icon: Share2, title: "المشاركة الاجتماعية", desc: "شارك التطبيق على واتساب وفيسبوك وتويتر وإنستجرام بضغطة واحدة.", color: "from-primary-glow to-accent" },
  { icon: Zap, title: "حالة العمل الحية", desc: "مؤشر مباشر (يعمل الآن / مغلق) مع فلاتر لصيدليات الطوارئ 24/7.", color: "from-warning to-secondary" },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/40">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            رعاية متكاملة <span className="text-gradient">بين يديك</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            من تحليل الروشتة إلى توصيل الدواء — Pharma-i يرافقك في كل خطوة من رحلتك الصحية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-3xl gradient-card border border-border hover:shadow-elegant hover:-translate-y-2 transition-smooth overflow-hidden"
            >
              <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${f.color} opacity-10 group-hover:opacity-20 transition-smooth blur-2xl`} />
              <div className={`relative inline-flex h-12 w-12 rounded-2xl items-center justify-center bg-gradient-to-br ${f.color} shadow-soft mb-4`}>
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
