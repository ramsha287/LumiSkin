 import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between bg-white">
      <Navbar />
      <Hero />
      <Footer />

    </main>
  );
}
