'use client';

import React from 'react';
import Navbar, { Era } from './Navbar';

export interface HeaderProps {
  currentEra?: Era;
}

export default function Header({ currentEra = '90s' }: HeaderProps): React.JSX.Element {
  return <Navbar currentEra={currentEra} />;
}
