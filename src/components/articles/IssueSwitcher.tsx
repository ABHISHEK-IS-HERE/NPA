'use client';

/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';
import { useRouter } from 'next/navigation';

interface IssueOption {
  id: number;
  title: string;
  isCurrent: boolean;
}

interface IssueSwitcherProps {
  issues: IssueOption[];
  currentSelectedId?: number;
}

export const IssueSwitcher: React.FC<IssueSwitcherProps> = ({ issues, currentSelectedId }) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    router.push(`/current-issue?issueId=${newId}`);
  };

  return (
    <select
      value={currentSelectedId}
      onChange={handleChange}
      className="text-xs py-2 px-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 font-medium cursor-pointer shadow-xs"
    >
      {issues.map((iss) => (
        <option key={iss.id} value={iss.id}>
          {iss.title} {iss.isCurrent ? '(Current)' : ''}
        </option>
      ))}
    </select>
  );
};
