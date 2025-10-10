"use client";

import * as React from 'react';
import Quizzes from './quizzes';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BasicTabs from './navbar';
import Navbar from '../home/components/navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="font-sans grid items-center justify-items-center min-h-screen p-8 gap-8">
        <div className="mt-8">
          {/* <BasicTabs /> */}
          <Quizzes />
        </div>
      </div>
    </div>
  );
}
