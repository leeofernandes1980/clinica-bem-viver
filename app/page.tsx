import ComoFunciona from "@/components/ComoFunciona";
import Depoimentos from "@/components/Depoimentos";
import Equipe from "@/components/Equipe";
import Especialidades from "@/components/Especialidades";
import Footer from "@/components/Footer";
import Formulario from "@/components/Formulario";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Especialidades />
        <ComoFunciona />
        <Depoimentos />
        <Equipe />
        <Formulario />
      </main>
      <Footer />
    </>
  );
}
