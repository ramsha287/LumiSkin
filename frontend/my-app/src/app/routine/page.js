"use client";

import SkinRoutine from '@/components/SkinRoutine';
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <SkinRoutine type="routine" />
    </div>
  )
  ;
}
