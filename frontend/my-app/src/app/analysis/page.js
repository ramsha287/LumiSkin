"use client";

import DermaScan from '@/components/DermaScan';
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <DermaScan type="derma" />
    </div>
  )
  ;
}
