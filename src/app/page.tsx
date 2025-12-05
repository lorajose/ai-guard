import dynamic from "next/dynamic";

const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => <div className="h-[500px]" />,
});
const Features = dynamic(() => import("@/components/Features"), {
  ssr: false,
});
const Pricing = dynamic(() => import("@/components/Pricing"), {
  ssr: false,
});
const FAQ = dynamic(() => import("@/components/FAQ"), {
  ssr: false,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
