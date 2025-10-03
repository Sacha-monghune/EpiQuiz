"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import BasicTabs from './navbar';

export default function Home() {

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 gap-8">
      <div className="mt-8">
        <BasicTabs />
      </div>
    </div>
  )
}
