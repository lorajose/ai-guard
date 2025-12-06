import dynamic from "next/dynamic";

const HowItWorksLanding = dynamic(() => import("@/components/HowItWorksLanding"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-black" />,
});

export default function HowPage() {
  return <HowItWorksLanding />;
}
