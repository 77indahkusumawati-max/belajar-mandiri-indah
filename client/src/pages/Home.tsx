import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Flame,
  Filter,
  LayoutDashboard,
  Library,
  Lightbulb,
  ListTodo,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Star,
  StickyNote,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const heroImage = "/manus-storage/belajar-hero_83f85bcd.png";
const cardsImage = "/manus-storage/study-cards_f4abd3e5.png";

type Section = "Beranda" | "Materi" | "Rencana belajar" | "Progres" | "Catatan" | "Teman belajar";

const navItems: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Beranda", icon: LayoutDashboard },
  { label: "Materi", icon: Library },
  { label: "Rencana belajar", icon: ListTodo },
  { label: "Progres", icon: BarChart3 },
  { label: "Catatan", icon: StickyNote },
  { label: "Teman belajar", icon: Users },
];

const materialData = [
  {
    id: "aljabar",
    subject: "Matematika",
    title: "Persamaan Linear Dua Variabel",
    description: "Pahami konsep dasar, grafik, dan cara menyelesaikan SPLDV secara bertahap.",
    level: "Menengah",
    duration: "18 menit",
    progress: 68,
    accent: "orange",
    icon: "∑",
    featured: true,
  },
  {
    id: "biologi",
    subject: "Biologi",
    title: "Sistem Pernapasan Manusia",
    description: "Ringkasan organ, mekanisme inspirasi, dan gangguan pernapasan.",
    level: "Dasar",
    duration: "12 menit",
    progress: 24,
    accent: "teal",
    icon: "◌",
    featured: false,
  },
  {
    id: "inggris",
    subject: "Bahasa Inggris",
    title: "Descriptive Text",
    description: "Temukan struktur teks dan gunakan adjectives untuk mendeskripsikan objek.",
    level: "Dasar",
    duration: "15 menit",
    progress: 0,
    accent: "mustard",
    icon: "Aa",
    featured: false,
  },
  {
    id: "sejarah",
    subject: "Sejarah Indonesia",
    title: "Pergerakan Nasional",
    description: "Kenali organisasi, tokoh, dan alur peristiwa menuju kemerdekaan.",
    level: "Menengah",
    duration: "21 menit",
    progress: 42,
    accent: "plum",
    icon: "✦",
    featured: false,
  },
];

const quizQuestions = [
  {
    question: "Manakah yang merupakan bentuk umum persamaan linear dua variabel?",
    options: ["ax² + bx + c = 0", "ax + by = c", "a/b = c/d", "y = ax²"],
    answer: 1,
    explanation: "Bentuk umum SPLDV adalah ax + by = c, dengan x dan y sebagai variabel.",
  },
  {
    question: "Jika x + y = 10 dan x = 4, berapa nilai y?",
    options: ["4", "5", "6", "14"],
    answer: 2,
    explanation: "Substitusikan x = 4: 4 + y = 10, sehingga y = 6.",
  },
  {
    question: "Titik potong dua garis pada grafik SPLDV menunjukkan…",
    options: ["Tidak ada solusi", "Nilai maksimum", "Himpunan penyelesaian", "Gradien garis"],
    answer: 2,
    explanation: "Titik potong dua garis adalah pasangan (x, y) yang memenuhi kedua persamaan.",
  },
];

function ProgressBar({ value, color = "bg-[#e97848]" }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebe5dc]">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">{eyebrow}</p>}
        <h2 className="font-display text-[26px] leading-none tracking-[-0.035em] text-[#26323a]">{title}</h2>
      </div>
      {action && (
        <Button variant="ghost" className="h-auto gap-1 rounded-full px-2 py-1 text-xs font-bold text-[#b75c39] hover:bg-[#f3e9df] hover:text-[#8f4025]" onClick={onAction}>
          {action} <ArrowUpRight size={14} />
        </Button>
      )}
    </div>
  );
}

function MiniStat({ icon: Icon, value, label, tint, iconColor }: { icon: typeof Flame; value: string; label: string; tint: string; iconColor: string }) {
  return (
    <div className="rounded-[18px] border border-[#e8e0d6] bg-[#fffdf9] p-4 shadow-[0_8px_25px_rgba(61,48,35,0.04)]">
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}>
          <Icon size={17} className={iconColor} strokeWidth={2.4} />
        </div>
        <MoreHorizontal size={17} className="text-[#b7aa9c]" />
      </div>
      <p className="font-display text-[28px] leading-none tracking-[-0.04em] text-[#26323a]">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-[#9a8e81]">{label}</p>
    </div>
  );
}

function MaterialCard({ material, onOpen, isFavorite, onFavorite }: { material: (typeof materialData)[number]; onOpen: () => void; isFavorite: boolean; onFavorite: () => void }) {
  const accentStyles = ({
    orange: { bg: "bg-[#f7d4c1]", ink: "text-[#a94f2d]", progress: "bg-[#e97848]" },
    teal: { bg: "bg-[#c9ddd5]", ink: "text-[#456e63]", progress: "bg-[#6e9e8e]" },
    mustard: { bg: "bg-[#f0ddb0]", ink: "text-[#8d6c27]", progress: "bg-[#d2a23f]" },
    plum: { bg: "bg-[#ded4dc]", ink: "text-[#765a73]", progress: "bg-[#9b7892]" },
  } as Record<string, { bg: string; ink: string; progress: string }>)[material.accent] ?? { bg: "bg-[#f7d4c1]", ink: "text-[#a94f2d]", progress: "bg-[#e97848]" };

  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-[#e7ded4] bg-[#fffdf9] p-4 shadow-[0_8px_26px_rgba(61,48,35,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(61,48,35,0.09)]">
      <div className={`relative mb-4 flex h-[118px] items-center justify-center overflow-hidden rounded-[16px] ${accentStyles.bg}`}>
        {material.id === "aljabar" && <img src={cardsImage} alt="Ilustrasi kartu belajar" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-20" />}
        <div className={`relative flex h-16 w-16 rotate-[-6deg] items-center justify-center rounded-[18px] border-2 border-current bg-[#fff9ef]/80 font-display text-[30px] font-bold shadow-[4px_5px_0_rgba(38,50,58,0.13)] ${accentStyles.ink}`}>
          {material.icon}
        </div>
        <button aria-label={isFavorite ? "Hapus dari tersimpan" : "Simpan materi"} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#fffaf1]/80 text-[#8c7d6e] backdrop-blur transition hover:bg-white hover:text-[#a94f2d]" onClick={onFavorite}>
          <Bookmark size={15} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-[#fffaf1]/85 px-2.5 py-1 text-[10px] font-bold text-[#675d53] backdrop-blur">{material.level}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a49384]">
        <span className={`h-1.5 w-1.5 rounded-full ${accentStyles.progress}`} /> {material.subject}
      </div>
      <h3 className="mt-2 min-h-[42px] font-display text-[18px] leading-[1.05] tracking-[-0.02em] text-[#26323a]">{material.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-[34px] text-xs leading-relaxed text-[#8e8174]">{material.description}</p>
      <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-[#9b8f82]">
        <span className="flex items-center gap-1"><Clock3 size={13} /> {material.duration}</span>
        {material.progress > 0 ? <span>{material.progress}% selesai</span> : <span>Belum mulai</span>}
      </div>
      <div className="mt-2"><ProgressBar value={material.progress} color={accentStyles.progress} /></div>
      <Button className="mt-4 h-9 w-full rounded-xl bg-[#26323a] text-xs font-bold text-[#fffaf1] shadow-none hover:bg-[#3b4b55]" onClick={onOpen}>
        {material.progress > 0 ? "Lanjutkan" : "Mulai belajar"} <ChevronRight size={15} />
      </Button>
    </article>
  );
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("Beranda");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(["aljabar"]);
  const [selectedMaterial, setSelectedMaterial] = useState<(typeof materialData)[number] | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(68);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredMaterials = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) return materialData;
    return materialData.filter((item) => `${item.subject} ${item.title} ${item.description}`.toLowerCase().includes(normalized));
  }, [searchTerm]);

  const openSection = (section: Section) => {
    setActiveSection(section);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === quizQuestions[quizIndex].answer;
    const nextScore = quizScore + (isCorrect ? 1 : 0);
    setQuizScore(nextScore);
    if (quizIndex === quizQuestions.length - 1) {
      setQuizDone(true);
      toast.success(`Kuis selesai — skor kamu ${Math.round((nextScore / quizQuestions.length) * 100)}!`);
    } else {
      setQuizIndex((index) => index + 1);
      setSelectedAnswer(null);
    }
  };

  const startQuiz = () => {
    resetQuiz();
    setQuizOpen(true);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    toast.success(favorites.includes(id) ? "Materi dihapus dari tersimpan" : "Materi disimpan untuk nanti");
  };

  const startLesson = () => {
    setLessonProgress((value) => Math.min(value + 8, 100));
    toast.success("Progres diperbarui — satu langkah lagi!");
  };

  const renderDashboard = () => (
    <>
      <section className="relative min-h-[276px] overflow-hidden rounded-[28px] bg-[#f6cfad] shadow-[0_18px_45px_rgba(153,91,54,0.12)]">
        <img src={heroImage} alt="Siswa sedang belajar di meja" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6cfad] via-[#f6cfad]/90 to-transparent" />
        <div className="relative z-10 max-w-[460px] p-7 sm:p-9">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b66b47]/20 bg-[#fff8ed]/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a65332] backdrop-blur">
            <Target size={13} /> Target minggu ini · 2/4
          </div>
          <h1 className="font-display text-[39px] leading-[0.96] tracking-[-0.06em] text-[#26323a] sm:text-[45px]">Belajar lebih <em className="font-serif font-normal text-[#a9502f]">terarah.</em></h1>
          <p className="mt-4 max-w-[330px] text-sm leading-relaxed text-[#755c4b]">Satu langkah kecil hari ini bisa membuat kamu lebih siap menghadapi ujian besok.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button className="h-10 gap-2 rounded-xl bg-[#26323a] px-4 text-xs font-bold text-[#fffaf1] shadow-[0_5px_0_#172126] hover:translate-y-[1px] hover:bg-[#354750] hover:shadow-[0_3px_0_#172126]" onClick={startLesson}>
              <Play size={14} fill="currentColor" /> Lanjutkan belajar
            </Button>
            <Button variant="outline" className="h-10 rounded-xl border-[#b66b47]/35 bg-[#fffaf1]/45 px-4 text-xs font-bold text-[#81452d] hover:bg-[#fffaf1]/80" onClick={() => openSection("Materi")}>Lihat semua materi</Button>
          </div>
        </div>
        <div className="absolute bottom-5 right-5 hidden rounded-2xl border border-white/60 bg-[#fffaf1]/75 px-4 py-3 backdrop-blur-md sm:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9c725b]">Fokus hari ini</p>
          <p className="mt-1 font-display text-[18px] tracking-[-0.02em] text-[#26323a]">SPLDV · 18 menit</p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat icon={Flame} value="4 hari" label="Streak belajar" tint="bg-[#fae3cf]" iconColor="text-[#d56537]" />
        <MiniStat icon={CheckCircle2} value="12" label="Materi selesai" tint="bg-[#dceae4]" iconColor="text-[#4f8875]" />
        <MiniStat icon={Trophy} value="86" label="Skor kuis terakhir" tint="bg-[#f5e8be]" iconColor="text-[#bd8b2c]" />
        <MiniStat icon={Clock3} value="03j 20m" label="Waktu belajar" tint="bg-[#e7deea]" iconColor="text-[#806388]" />
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1.55fr_0.85fr]">
        <section>
          <SectionHeading eyebrow="MATERI TERAKHIR" title="Lanjutkan belajarmu" action="Semua materi" onAction={() => openSection("Materi")} />
          <div className="group overflow-hidden rounded-[24px] border border-[#e4dbd0] bg-[#fffdf9] shadow-[0_10px_30px_rgba(61,48,35,0.045)]">
            <div className="grid md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[220px] overflow-hidden bg-[#d8e4dd] p-6">
                <img src={cardsImage} alt="Kartu belajar dan timer" className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-55 transition duration-500 group-hover:scale-105" />
                <div className="relative flex h-full flex-col justify-between">
                  <span className="w-fit rounded-full bg-[#fff9ef]/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#5f766a]">Matematika · Bab 2</span>
                  <div className="flex items-center justify-between">
                    <div className="rounded-[14px] border border-[#30453f]/25 bg-[#fff9ef]/75 px-3 py-2 backdrop-blur-sm">
                      <p className="font-display text-[22px] leading-none text-[#30453f]">3 / 5</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#668176]">Langkah</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#426f60] bg-[#fff9ef]/80 text-sm font-bold text-[#426f60]">68%</div>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a49384]">Penjelasan bertahap</p>
                    <h3 className="mt-2 font-display text-[25px] leading-[1.02] tracking-[-0.035em] text-[#26323a]">Persamaan Linear<br className="hidden sm:block" /> Dua Variabel</h3>
                  </div>
                  <button aria-label="Opsi materi" className="text-[#aa9c8d] hover:text-[#26323a]"><MoreHorizontal size={19} /></button>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#8e8174]">Kamu sudah memahami bentuk umum. Yuk lanjut ke cara menemukan titik potongnya.</p>
                <div className="mt-5 flex items-center justify-between text-xs font-bold text-[#8c7d6e]"><span>Progres materi</span><span className="text-[#c4613b]">{lessonProgress}%</span></div>
                <div className="mt-2"><ProgressBar value={lessonProgress} /></div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button className="h-10 gap-2 rounded-xl bg-[#26323a] px-4 text-xs font-bold text-[#fffaf1] hover:bg-[#3b4b55]" onClick={startLesson}><Play size={14} fill="currentColor" /> Mulai lagi</Button>
                  <Button variant="outline" className="h-10 gap-2 rounded-xl border-[#ddd1c4] bg-transparent px-4 text-xs font-bold text-[#6f6256] hover:bg-[#f6efe7]" onClick={() => { setSelectedMaterial(materialData[0]); }}><BookOpen size={14} /> Baca ringkasan</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading eyebrow="RUTE BELAJAR" title="Hari ini" />
          <div className="rounded-[24px] border border-[#e4dbd0] bg-[#fffdf9] p-5 shadow-[0_10px_30px_rgba(61,48,35,0.045)]">
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-[#f4ede4] px-4 py-3">
              <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#26323a] text-[#fffaf1]"><CalendarDays size={16} /></div><div><p className="text-xs font-bold text-[#4b423a]">Senin, 24 Juni</p><p className="mt-0.5 text-[11px] text-[#9a8e81]">2 aktivitas tersisa</p></div></div>
              <button aria-label="Tambah jadwal" className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d9cdbf] text-[#8e7d6d] hover:bg-[#fffaf1]" onClick={() => toast.success("Jadwal baru siap ditambahkan") }><Plus size={15} /></button>
            </div>
            <div className="relative space-y-5 pl-2 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-[#e3d9ce]">
              <div className="relative flex gap-3"><div className="z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-[#fffdf9] bg-[#e97848] text-white"><Check size={12} strokeWidth={3} /></div><div><p className="text-xs font-bold text-[#6f6256] line-through">Baca rangkuman SPLDV</p><p className="mt-1 text-[11px] text-[#a09385]">15 menit · selesai</p></div></div>
              <div className="relative flex gap-3"><div className="z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-[#fffdf9] bg-[#fffaf1] text-[#e97848] shadow-[0_0_0_1px_#e97848]"><Play size={11} fill="currentColor" /></div><div><p className="text-xs font-bold text-[#3e484c]">Latihan 5 soal</p><p className="mt-1 text-[11px] text-[#a09385]">10 menit · berikutnya</p></div></div>
              <div className="relative flex gap-3"><div className="z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-4 border-[#fffdf9] bg-[#e4ddd4] text-[#a39484]"><LockIcon /></div><div><p className="text-xs font-bold text-[#a09385]">Kuis singkat</p><p className="mt-1 text-[11px] text-[#b2a598]">5 menit · terkunci</p></div></div>
            </div>
            <Button variant="ghost" className="mt-5 h-9 w-full rounded-xl text-xs font-bold text-[#b75c39] hover:bg-[#f7eee5]" onClick={() => openSection("Rencana belajar")}>Lihat rencana lengkap <ChevronRight size={14} /></Button>
          </div>
        </section>
      </div>

      <section className="mt-10">
        <SectionHeading eyebrow="PILIHAN UNTUKMU" title="Belajar tanpa terasa berat" action="Lihat semua" onAction={() => openSection("Materi")} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {materialData.map((material) => <MaterialCard key={material.id} material={material} isFavorite={favorites.includes(material.id)} onFavorite={() => toggleFavorite(material.id)} onOpen={() => setSelectedMaterial(material)} />)}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] bg-[#26323a] p-6 text-[#fffaf1] shadow-[0_12px_30px_rgba(38,50,58,0.13)] sm:p-7">
          <div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1bda6]">CEK PEMAHAMAN</p><h3 className="mt-2 font-display text-[28px] leading-none tracking-[-0.04em]">Siap untuk kuis singkat?</h3><p className="mt-3 max-w-[400px] text-sm leading-relaxed text-[#c6c5b9]">Uji materi SPLDV dengan 3 pertanyaan cepat. Dapatkan pembahasan setiap jawaban.</p></div><div className="hidden h-14 w-14 rotate-6 items-center justify-center rounded-2xl bg-[#e97848] text-[#fffaf1] sm:flex"><CircleHelp size={27} /></div></div>
          <div className="mt-6 flex flex-wrap items-center gap-4"><Button className="h-10 gap-2 rounded-xl bg-[#f6cfad] px-4 text-xs font-bold text-[#70402d] hover:bg-[#ffe0c6]" onClick={startQuiz}>Mulai kuis <ArrowUpRight size={14} /></Button><span className="flex items-center gap-1.5 text-xs font-semibold text-[#aeb9b7]"><Clock3 size={14} /> ± 5 menit</span><span className="flex items-center gap-1.5 text-xs font-semibold text-[#aeb9b7]"><Award size={14} /> 30 XP</span></div>
        </div>
        <div className="rounded-[24px] border border-[#e4dbd0] bg-[#f6e6bd] p-6 shadow-[0_10px_30px_rgba(61,48,35,0.045)] sm:p-7"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff7dd] text-[#b78729]"><Lightbulb size={19} /></div><span className="rounded-full bg-[#fff7dd]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#a47c2c]">Catatan kecil</span></div><p className="mt-7 font-serif text-[23px] leading-[1.1] text-[#6f5526]">“Tidak apa-apa kalau belum paham. Yang penting, kamu tahu langkah berikutnya.”</p><p className="mt-4 text-xs font-bold text-[#a47c2c]">— prinsip belajar mandiri</p></div>
      </section>
    </>
  );

  const renderMaterials = () => (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">PERPUSTAKAAN BELAJAR</p><h1 className="mt-2 font-display text-[42px] leading-none tracking-[-0.055em] text-[#26323a]">Cari materi yang <em className="font-serif font-normal text-[#b75c39]">pas.</em></h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-[#8e8174]">Materi singkat, runtut, dan dilengkapi referensi agar kamu bisa belajar dengan lebih percaya diri.</p></div><Button className="h-10 gap-2 rounded-xl bg-[#26323a] px-4 text-xs font-bold text-[#fffaf1] hover:bg-[#3b4b55]" onClick={() => toast.success("Fitur usulan materi akan segera hadir") }><Plus size={15} /> Usulkan materi</Button></div>
      <div className="mb-6 flex flex-wrap gap-2"><Badge className="rounded-full bg-[#26323a] px-3 py-1.5 text-[11px] font-bold text-[#fffaf1] hover:bg-[#26323a]">Semua materi</Badge><Badge variant="outline" className="rounded-full border-[#ddcfc0] bg-transparent px-3 py-1.5 text-[11px] font-bold text-[#796b5e]">Matematika</Badge><Badge variant="outline" className="rounded-full border-[#ddcfc0] bg-transparent px-3 py-1.5 text-[11px] font-bold text-[#796b5e]">Bahasa</Badge><Badge variant="outline" className="rounded-full border-[#ddcfc0] bg-transparent px-3 py-1.5 text-[11px] font-bold text-[#796b5e]">Sains</Badge><Button variant="ghost" className="h-8 gap-1 rounded-full px-3 text-[11px] font-bold text-[#967f6b] hover:bg-[#f2e9df]"><Filter size={13} /> Filter</Button></div>
      {filteredMaterials.length > 0 ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredMaterials.map((material) => <MaterialCard key={material.id} material={material} isFavorite={favorites.includes(material.id)} onFavorite={() => toggleFavorite(material.id)} onOpen={() => setSelectedMaterial(material)} />)}</div> : <div className="rounded-[24px] border border-dashed border-[#d8cabb] bg-[#fffaf1] p-12 text-center"><Search className="mx-auto text-[#b2a394]" /><p className="mt-3 font-display text-xl text-[#4a4037]">Materi belum ditemukan</p><p className="mt-1 text-sm text-[#9a8e81]">Coba kata kunci lain atau hapus pencarian.</p></div>}
    </>
  );

  const renderPlan = () => (
    <>
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">RUTE PERSONAL</p><h1 className="mt-2 font-display text-[42px] leading-none tracking-[-0.055em] text-[#26323a]">Rencana belajar</h1><p className="mt-3 text-sm leading-relaxed text-[#8e8174]">Sedikit demi sedikit, konsisten jadi lebih mudah.</p></div><Button className="h-10 gap-2 rounded-xl bg-[#e97848] px-4 text-xs font-bold text-white hover:bg-[#c85d35]" onClick={() => toast.success("Rencana baru siap dibuat") }><Plus size={15} /> Buat rencana</Button></div>
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div className="space-y-4">{[{title: "Persiapan ujian Matematika", meta: "4 dari 6 materi selesai", pct: 68, color: "bg-[#e97848]", tag: "Prioritas"}, {title: "Pahami dasar Biologi", meta: "1 dari 4 materi selesai", pct: 24, color: "bg-[#6e9e8e]", tag: "Minggu ini"}, {title: "Latihan Bahasa Inggris", meta: "2 dari 5 materi selesai", pct: 42, color: "bg-[#d2a23f]", tag: "Santai"}].map((plan) => <div key={plan.title} className="rounded-[22px] border border-[#e4dbd0] bg-[#fffdf9] p-5 shadow-[0_8px_24px_rgba(61,48,35,0.04)]"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="rounded-full bg-[#f5eee6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#957e6b]">{plan.tag}</span><span className="text-[11px] font-semibold text-[#a19485]">25 Jun — 02 Jul</span></div><h3 className="mt-3 font-display text-[22px] tracking-[-0.03em] text-[#26323a]">{plan.title}</h3><p className="mt-1 text-xs text-[#988b7e]">{plan.meta}</p></div><div className="font-display text-2xl tracking-[-0.04em] text-[#26323a]">{plan.pct}%</div></div><div className="mt-5"><ProgressBar value={plan.pct} color={plan.color} /></div></div>)}</div><div className="rounded-[22px] bg-[#dceae4] p-6"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4fbf7] text-[#4f8875]"><Target size={21} /></div><h3 className="mt-7 font-display text-[27px] leading-none tracking-[-0.04em] text-[#31584f]">Atur target yang masuk akal.</h3><p className="mt-3 text-sm leading-relaxed text-[#5f7c71]">Mulai dari satu materi dan 15 menit per hari. Rencana yang kecil lebih mudah dijalankan sampai selesai.</p><Button variant="outline" className="mt-6 h-10 rounded-xl border-[#9cc1b3] bg-transparent text-xs font-bold text-[#3d7162] hover:bg-[#eff9f3]" onClick={() => toast.success("Target harian disimpan")}>Atur target harian</Button></div></div>
    </>
  );

  const renderProgress = () => (
    <>
      <div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">PERKEMBANGANMU</p><h1 className="mt-2 font-display text-[42px] leading-none tracking-[-0.055em] text-[#26323a]">Kamu terus <em className="font-serif font-normal text-[#b75c39]">bertumbuh.</em></h1><p className="mt-3 text-sm leading-relaxed text-[#8e8174]">Lihat kebiasaan dan pemahamanmu dalam satu tempat.</p></div>
      <div className="grid gap-4 md:grid-cols-3"><div className="rounded-[22px] bg-[#26323a] p-5 text-[#fffaf1]"><div className="flex items-center justify-between"><TrendingUp size={19} className="text-[#f6cfad]" /><span className="text-xs font-bold text-[#bdcbc8]">+18% bulan ini</span></div><p className="mt-7 font-display text-[39px] leading-none tracking-[-0.06em]">72%</p><p className="mt-2 text-xs text-[#b8c1bf]">Progres keseluruhan</p></div><div className="rounded-[22px] border border-[#e4dbd0] bg-[#fffdf9] p-5"><div className="flex items-center justify-between"><Trophy size={19} className="text-[#bd8b2c]" /><span className="text-xs font-bold text-[#8f8378]">Target 80</span></div><p className="mt-7 font-display text-[39px] leading-none tracking-[-0.06em] text-[#26323a]">86</p><p className="mt-2 text-xs text-[#998c7e]">Rata-rata skor kuis</p></div><div className="rounded-[22px] border border-[#e4dbd0] bg-[#f6e6bd] p-5"><div className="flex items-center justify-between"><Flame size={19} className="text-[#cf6e3f]" /><span className="text-xs font-bold text-[#9a7531]">Terbaik: 7 hari</span></div><p className="mt-7 font-display text-[39px] leading-none tracking-[-0.06em] text-[#6f5526]">4</p><p className="mt-2 text-xs text-[#9a7531]">Hari streak saat ini</p></div></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"><div className="rounded-[22px] border border-[#e4dbd0] bg-[#fffdf9] p-6"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a49384]">AKTIVITAS MINGGUAN</p><h3 className="mt-2 font-display text-[24px] text-[#26323a]">Waktu belajar</h3></div><Badge className="rounded-full bg-[#f5eee6] px-3 py-1 text-[10px] font-bold text-[#806d5d] hover:bg-[#f5eee6]">3j 20m total</Badge></div><div className="mt-8 flex h-40 items-end justify-between gap-3 border-b border-[#e7dfd6] pb-0">{[{day: "Sen", val: 42}, {day: "Sel", val: 65}, {day: "Rab", val: 35}, {day: "Kam", val: 78}, {day: "Jum", val: 56}, {day: "Sab", val: 88}, {day: "Min", val: 18}].map((item, index) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className={`w-full max-w-[34px] rounded-t-[8px] ${index === 5 ? "bg-[#e97848]" : "bg-[#e8d9c9]"}`} style={{ height: `${item.val}%` }} /><span className="mb-[-21px] text-[10px] font-bold text-[#a09182]">{item.day}</span></div>)}</div></div><div className="rounded-[22px] bg-[#e7deea] p-6"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8f2fa] text-[#806388]"><Award size={21} /></div><h3 className="mt-7 font-display text-[26px] leading-none tracking-[-0.04em] text-[#604c65]">Pencapaian baru</h3><p className="mt-3 text-sm leading-relaxed text-[#806d83]">Kamu sudah menyelesaikan 12 materi. Tinggal 3 materi lagi untuk membuka lencana <strong>Tekun Belajar</strong>.</p><div className="mt-5"><ProgressBar value={80} color="bg-[#9b7892]" /></div><p className="mt-2 text-right text-[11px] font-bold text-[#806388]">12 / 15 materi</p></div></div>
    </>
  );

  const renderNotes = () => (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">RUANG BERPIKIR</p><h1 className="mt-2 font-display text-[42px] leading-none tracking-[-0.055em] text-[#26323a]">Catatan pribadi</h1><p className="mt-3 text-sm leading-relaxed text-[#8e8174]">Simpan insight, pertanyaan, dan hal penting yang ingin kamu ingat.</p></div><Button className="h-10 gap-2 rounded-xl bg-[#26323a] px-4 text-xs font-bold text-[#fffaf1] hover:bg-[#3b4b55]" onClick={() => toast.success("Catatan baru siap ditulis") }><Plus size={15} /> Catatan baru</Button></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><div className="min-h-[210px] rotate-[-1deg] rounded-[5px] border border-[#ead69d] bg-[#f8e8b8] p-6 shadow-[0_10px_18px_rgba(100,79,36,0.08)]"><div className="flex items-center justify-between text-[#9a7934]"><StickyNote size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.15em]">Matematika</span></div><h3 className="mt-8 font-serif text-[23px] leading-tight text-[#6e5729]">“Garis berpotongan = satu jawaban yang memenuhi dua persamaan.”</h3><p className="mt-8 text-[11px] font-bold text-[#a78339]">24 Juni 2024</p></div><div className="min-h-[210px] rotate-[1deg] rounded-[5px] border border-[#e3c2b3] bg-[#f4d8cb] p-6 shadow-[0_10px_18px_rgba(100,64,45,0.07)]"><div className="flex items-center justify-between text-[#a95b3c]"><Lightbulb size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.15em]">Ide belajar</span></div><h3 className="mt-8 font-serif text-[23px] leading-tight text-[#7d4935]">Coba jelaskan ulang materi dengan bahasa sendiri.</h3><p className="mt-8 text-[11px] font-bold text-[#ad694d]">22 Juni 2024</p></div><button className="flex min-h-[210px] flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d8cabb] bg-[#fffaf1] text-[#a49384] transition hover:border-[#c98b6d] hover:bg-[#fff5e9]" onClick={() => toast.success("Catatan baru siap ditulis")}><Plus size={22} /><span className="mt-3 text-xs font-bold">Tambah catatan</span></button></div>
    </>
  );

  const renderFriends = () => (
    <>
      <div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9a8e81]">BELAJAR BERSAMA</p><h1 className="mt-2 font-display text-[42px] leading-none tracking-[-0.055em] text-[#26323a]">Teman belajar</h1><p className="mt-3 text-sm leading-relaxed text-[#8e8174]">Ruang opsional untuk bertanya, saling menyemangati, dan tetap fokus.</p></div>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]"><div className="rounded-[24px] bg-[#dceae4] p-7"><div className="flex items-center justify-between"><div className="flex -space-x-2"><Avatar className="h-10 w-10 border-2 border-[#dceae4]"><AvatarFallback className="bg-[#e97848] text-xs font-bold text-white">NA</AvatarFallback></Avatar><Avatar className="h-10 w-10 border-2 border-[#dceae4]"><AvatarFallback className="bg-[#e4b951] text-xs font-bold text-white">RF</AvatarFallback></Avatar><Avatar className="h-10 w-10 border-2 border-[#dceae4]"><AvatarFallback className="bg-[#81688b] text-xs font-bold text-white">+3</AvatarFallback></Avatar></div><span className="flex items-center gap-1.5 rounded-full bg-[#f4fbf7] px-3 py-1.5 text-[10px] font-bold text-[#4f8875]"><span className="h-1.5 w-1.5 rounded-full bg-[#5da285]" /> Aktif</span></div><h3 className="mt-9 font-display text-[30px] leading-none tracking-[-0.045em] text-[#31584f]">Pejuang SPLDV</h3><p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5f7c71]">3 teman sedang mempelajari materi yang sama denganmu.</p><div className="mt-7 flex flex-wrap gap-2"><Button className="h-10 rounded-xl bg-[#31584f] px-4 text-xs font-bold text-[#f4fbf7] hover:bg-[#264941]" onClick={() => toast.success("Ruang belajar dibuka")}>Masuk ruang belajar</Button><Button variant="outline" className="h-10 gap-2 rounded-xl border-[#9cc1b3] bg-transparent text-xs font-bold text-[#3d7162] hover:bg-[#eff9f3]" onClick={() => toast.success("Tautan undangan disalin")}><Send size={14} /> Undang teman</Button></div></div><div className="rounded-[24px] border border-[#e4dbd0] bg-[#fffdf9] p-7"><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a49384]">AKTIVITAS TERBARU</p><h3 className="mt-2 font-display text-[24px] text-[#26323a]">Saling menyemangati</h3></div><Users size={20} className="text-[#b9aa9b]" /></div><div className="mt-6 space-y-5"><div className="flex gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[#f5e0d4] text-xs font-bold text-[#a65332]">NA</AvatarFallback></Avatar><p className="text-xs leading-relaxed text-[#76695e]"><strong className="text-[#3f484b]">Nadia</strong> menyelesaikan latihan <span className="font-bold text-[#b75c39]">SPLDV dasar</span><span className="mt-1 block text-[10px] text-[#a09385]">8 menit lalu</span></p></div><div className="flex gap-3"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[#f3e5bb] text-xs font-bold text-[#a27e27]">RF</AvatarFallback></Avatar><p className="text-xs leading-relaxed text-[#76695e]"><strong className="text-[#3f484b]">Rafi</strong> mengirim pesan di ruang belajar<span className="mt-1 block text-[10px] text-[#a09385]">32 menit lalu</span></p></div></div><Button variant="ghost" className="mt-6 h-9 gap-1 px-0 text-xs font-bold text-[#b75c39] hover:bg-transparent hover:text-[#8f4025]" onClick={() => toast.success("Belum ada aktivitas lain")}>Lihat semua aktivitas <ChevronRight size={14} /></Button></div></div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#26323a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[244px] flex-col border-r border-[#e8e0d6] bg-[#fbf8f4] px-5 py-6 lg:flex">
        <button className="flex items-center gap-2 px-2 text-left" onClick={() => openSection("Beranda")} aria-label="Kembali ke beranda"><span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#26323a] font-display text-[21px] font-bold text-[#f7d1b3]">b.</span><span className="font-display text-[22px] font-bold tracking-[-0.06em] text-[#26323a]">belajar<span className="text-[#e97848]">.</span></span></button>
        <div className="mt-12"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b1a397]">Menu utama</p><nav className="mt-3 space-y-1">{navItems.map(({ label, icon: Icon }) => <button key={label} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition ${activeSection === label ? "bg-[#26323a] text-[#fffaf1] shadow-[0_6px_14px_rgba(38,50,58,0.12)]" : "text-[#8e8174] hover:bg-[#f2ebe3] hover:text-[#3d484d]"}`} onClick={() => openSection(label)}><Icon size={17} strokeWidth={activeSection === label ? 2.5 : 2} /><span>{label}</span>{label === "Teman belajar" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e97848]" />}</button>)}</nav></div>
        <div className="mt-auto rounded-[18px] bg-[#f4e5d5] p-4"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff8ed] text-[#b75c39]"><Sparkles size={15} /></div><p className="mt-3 text-xs font-bold text-[#79533e]">Tips hari ini</p><p className="mt-1 text-[11px] leading-relaxed text-[#9a735c]">Belajar 15 menit lebih baik daripada menunggu waktu yang sempurna.</p><button className="mt-3 text-[11px] font-bold text-[#a65332] hover:underline" onClick={() => toast.success("Tips disimpan")}>Simpan tips →</button></div>
        <div className="mt-5 flex items-center gap-3 border-t border-[#e8e0d6] pt-5"><Avatar className="h-9 w-9"><AvatarFallback className="bg-[#e97848] text-xs font-bold text-white">PB</AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#4b423a]">Profil pengguna</p><p className="truncate text-[10px] text-[#a19485]">Pelajar SMA/SMK</p></div><button aria-label="Pengaturan profil" className="text-[#a99b8e] hover:text-[#26323a]" onClick={() => setProfileOpen((open) => !open)}><MoreHorizontal size={17} /></button></div>
      </aside>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-30 border-b border-[#ebe3da]/90 bg-[#f7f3ee]/90 px-4 py-4 backdrop-blur-xl sm:px-7 lg:px-10"><div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4"><div className="flex items-center gap-3"><button className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3d9ce] bg-[#fffaf1] lg:hidden" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Buka menu"><Menu size={18} /></button><div className="lg:hidden"><p className="font-display text-[21px] font-bold tracking-[-0.06em]">belajar<span className="text-[#e97848]">.</span></p></div><div className="hidden lg:block"><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a49384]">{activeSection === "Beranda" ? "DASHBOARD BELAJAR" : activeSection}</p><p className="mt-1 font-display text-[20px] tracking-[-0.03em] text-[#26323a]">{activeSection === "Beranda" ? "Selamat pagi, teman belajar" : activeSection}</p></div></div><div className="flex items-center gap-2 sm:gap-3"><div className="relative hidden w-[220px] md:block"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a99b8e]" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari materi..." className="h-10 rounded-xl border-[#e3d9ce] bg-[#fffaf1] pl-9 text-xs text-[#4b423a] placeholder:text-[#b4a79a] focus-visible:ring-[#e97848]" /></div><button aria-label="Notifikasi" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3d9ce] bg-[#fffaf1] text-[#8f8173] transition hover:bg-white hover:text-[#26323a]" onClick={() => toast.success("Tidak ada notifikasi baru")}><Bell size={17} /><span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#e97848]" /></button><button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e97848] text-xs font-bold text-white shadow-[0_4px_10px_rgba(233,120,72,0.25)]" onClick={() => setProfileOpen((open) => !open)} aria-label="Buka profil">PB</button></div></div>{mobileNavOpen && <div className="mt-4 rounded-2xl border border-[#e3d9ce] bg-[#fffaf1] p-2 shadow-lg lg:hidden"><div className="mb-2 flex items-center justify-between px-3 py-2"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a49384]">Menu belajar</span><button onClick={() => setMobileNavOpen(false)} aria-label="Tutup menu"><X size={16} className="text-[#a49384]" /></button></div>{navItems.map(({ label, icon: Icon }) => <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold ${activeSection === label ? "bg-[#26323a] text-white" : "text-[#8e8174]"}`} onClick={() => openSection(label)}><Icon size={16} />{label}</button>)}</div>}</header>

        <main className="mx-auto max-w-[1400px] px-4 py-7 sm:px-7 lg:px-10 lg:py-9">
          {activeSection === "Beranda" && renderDashboard()}
          {activeSection === "Materi" && renderMaterials()}
          {activeSection === "Rencana belajar" && renderPlan()}
          {activeSection === "Progres" && renderProgress()}
          {activeSection === "Catatan" && renderNotes()}
          {activeSection === "Teman belajar" && renderFriends()}
        </main>
        <footer className="mx-auto max-w-[1400px] px-4 pb-8 pt-2 text-[11px] text-[#ae9f91] sm:px-7 lg:px-10">Belajar Mandiri · dirancang dari sintesis kebutuhan 26 responden pelajar SMA/SMK.</footer>
      </div>

      {profileOpen && <div className="fixed right-4 top-[74px] z-50 w-56 rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-3 shadow-[0_15px_40px_rgba(61,48,35,0.14)] sm:right-7 lg:right-10"><div className="flex items-center gap-3 border-b border-[#efe8e0] px-2 pb-3"><Avatar className="h-10 w-10"><AvatarFallback className="bg-[#e97848] text-xs font-bold text-white">PB</AvatarFallback></Avatar><div><p className="text-xs font-bold text-[#3f484b]">Profil pengguna</p><p className="text-[10px] text-[#a19485]">Pelajar SMA/SMK</p></div></div><button className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-bold text-[#827568] hover:bg-[#f6eee5]" onClick={() => { setProfileOpen(false); toast.success("Profil siap disesuaikan") }}><Star size={14} /> Sesuaikan profil</button><button className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-bold text-[#827568] hover:bg-[#f6eee5]" onClick={() => { setProfileOpen(false); toast.success("Pengaturan disimpan") }}><Target size={14} /> Pengaturan target</button></div>}

      <Dialog open={Boolean(selectedMaterial)} onOpenChange={(open) => !open && setSelectedMaterial(null)}><DialogContent className="max-w-lg rounded-[24px] border-[#e5dbd0] bg-[#fffdf9] p-0 text-[#26323a]"><div className="h-28 rounded-t-[24px] bg-[#f6cfad] p-6"><Badge className="rounded-full bg-[#fffaf1]/75 px-3 py-1 text-[10px] font-bold text-[#9a5a3c] hover:bg-[#fffaf1]/75">{selectedMaterial?.subject} · {selectedMaterial?.level}</Badge></div><div className="p-6 sm:p-7"><DialogHeader><DialogTitle className="font-display text-[30px] leading-none tracking-[-0.045em]">{selectedMaterial?.title}</DialogTitle><DialogDescription className="pt-2 text-sm leading-relaxed text-[#8e8174]">{selectedMaterial?.description}</DialogDescription></DialogHeader><div className="mt-6 grid grid-cols-3 gap-2"><div className="rounded-xl bg-[#f4ede4] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a49384]">Durasi</p><p className="mt-1 text-xs font-bold text-[#5f554b]">{selectedMaterial?.duration}</p></div><div className="rounded-xl bg-[#f4ede4] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a49384]">Format</p><p className="mt-1 text-xs font-bold text-[#5f554b]">Bertahap</p></div><div className="rounded-xl bg-[#f4ede4] p-3"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a49384]">Sumber</p><p className="mt-1 text-xs font-bold text-[#5f554b]">Terpercaya</p></div></div><div className="mt-6 rounded-2xl border border-[#e8dfd6] bg-[#fffaf1] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#5f554b]"><CheckCircle2 size={15} className="text-[#5b927f]" /> Rute belajar yang disarankan</div><div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold text-[#a29384]"><span className="rounded-lg bg-[#f2d1bd] px-1 py-2 text-[#a65332]">Ringkas</span><span className="rounded-lg bg-[#f2d1bd] px-1 py-2 text-[#a65332]">Pahami</span><span className="rounded-lg bg-[#e9e1d6] px-1 py-2">Latih</span><span className="rounded-lg bg-[#e9e1d6] px-1 py-2">Cek</span></div></div><DialogFooter className="mt-6 flex-row gap-2 sm:justify-start"><Button className="h-10 rounded-xl bg-[#26323a] px-5 text-xs font-bold text-white hover:bg-[#3b4b55]" onClick={() => { setSelectedMaterial(null); startLesson(); }}>Mulai materi <ArrowUpRight size={14} /></Button><Button variant="outline" className="h-10 rounded-xl border-[#ded2c5] bg-transparent text-xs font-bold text-[#76695e]" onClick={() => setSelectedMaterial(null)}>Nanti saja</Button></DialogFooter></div></DialogContent></Dialog>

      <Dialog open={quizOpen} onOpenChange={(open) => { setQuizOpen(open); if (!open) resetQuiz(); }}><DialogContent className="max-w-lg rounded-[24px] border-[#e5dbd0] bg-[#fffdf9] text-[#26323a]"><DialogHeader><div className="mb-2 flex items-center justify-between"><Badge className="rounded-full bg-[#f5e5d5] px-3 py-1 text-[10px] font-bold text-[#a65332] hover:bg-[#f5e5d5]">KUIS SPLDV</Badge>{!quizDone && <span className="text-xs font-bold text-[#a49384]">{quizIndex + 1} / {quizQuestions.length}</span>}</div><DialogTitle className="font-display text-[28px] leading-tight tracking-[-0.04em]">{quizDone ? "Kuis selesai!" : quizQuestions[quizIndex].question}</DialogTitle><DialogDescription className="text-sm text-[#8e8174]">{quizDone ? `Kamu menjawab ${quizScore} dari ${quizQuestions.length} pertanyaan dengan benar.` : "Pilih jawaban yang menurutmu paling tepat."}</DialogDescription></DialogHeader>{quizDone ? <div className="py-7 text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f6e6bd] text-[#bd8b2c]"><Trophy size={36} /></div><p className="mt-5 font-display text-[42px] leading-none tracking-[-0.06em] text-[#26323a]">{Math.round((quizScore / quizQuestions.length) * 100)}</p><p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#a49384]">Skor kamu</p><Button className="mt-6 h-10 gap-2 rounded-xl bg-[#26323a] px-5 text-xs font-bold text-white hover:bg-[#3b4b55]" onClick={resetQuiz}><RotateCcw size={14} /> Coba lagi</Button></div> : <><div className="mt-5 space-y-2.5">{quizQuestions[quizIndex].options.map((option, index) => <button key={option} className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition ${selectedAnswer === index ? "border-[#e97848] bg-[#fff0e6] text-[#a65332]" : "border-[#e6ddd3] bg-[#fffaf1] text-[#6f6256] hover:border-[#ddb198] hover:bg-white"}`} onClick={() => setSelectedAnswer(index)}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${selectedAnswer === index ? "bg-[#e97848] text-white" : "bg-[#eee6dc] text-[#9a8e81]"}`}>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{selectedAnswer !== null && <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#f4ede4] p-3 text-xs leading-relaxed text-[#7b6d60]"><AlertCircle size={15} className="mt-0.5 shrink-0 text-[#c47a51]" />Jawaban akan langsung dibahas setelah kamu lanjut ke pertanyaan berikutnya.</div>}<DialogFooter className="mt-6"><Button disabled={selectedAnswer === null} className="h-10 w-full rounded-xl bg-[#26323a] text-xs font-bold text-white hover:bg-[#3b4b55]" onClick={handleQuizSubmit}>{quizIndex === quizQuestions.length - 1 ? "Lihat hasil" : "Pertanyaan berikutnya"} <ChevronRight size={15} /></Button></DialogFooter></>}</DialogContent></Dialog>
    </div>
  );
}

function LockIcon() {
  return <span className="text-[10px]">•••</span>;
}
