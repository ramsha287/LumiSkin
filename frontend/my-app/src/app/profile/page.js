"use client";

import Profile from '@/components/Profile';
import Navbar from '@/components/Navbar';

export default function Page() {
  return (
    <div>
      <Navbar />
      <Profile type="profile" />
    </div>
  )
  ;
}
