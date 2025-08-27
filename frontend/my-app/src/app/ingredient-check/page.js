"use client";

import IngredientChecker from '@/components/IngredientChecker';
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <IngredientChecker type="ingredient" />
    </div>
  )
  ;
}
