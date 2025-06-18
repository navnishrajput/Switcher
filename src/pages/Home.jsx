import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import ToolsSection from '../components/sections/ToolsSection';
import { motion } from 'framer-motion';


export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
   
      <Features />
      <ToolsSection />
    </motion.div>
  );
}