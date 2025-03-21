"use client";

import { useSearchParams } from 'next/navigation';
import ShareCard from '@/components/ShareCard';
import React from 'react';

export default function SharePage() {
  const searchParams = useSearchParams();
  
  // 从URL参数中获取数据 - 基础数据
  const value = searchParams.get('value') || '0';
  const assessment = searchParams.get('assessment') || '请输入年薪';
  const assessmentColor = searchParams.get('assessmentColor') || 'text-gray-500';
  const cityFactor = searchParams.get('cityFactor') || '1.0';
  const workHours = searchParams.get('workHours') || '10';
  const commuteHours = searchParams.get('commuteHours') || '2';
  const restTime = searchParams.get('restTime') || '2';
  const dailySalary = searchParams.get('dailySalary') || '0';
  const isYuan = searchParams.get('isYuan') === 'true';
  const workDaysPerYear = searchParams.get('workDaysPerYear') || '250';
  
  // 额外参数 - 详细工作信息
  const workDaysPerWeek = searchParams.get('workDaysPerWeek') || '5';
  const wfhDaysPerWeek = searchParams.get('wfhDaysPerWeek') || '0';
  const annualLeave = searchParams.get('annualLeave') || '5';
  const paidSickLeave = searchParams.get('paidSickLeave') || '12';
  const publicHolidays = searchParams.get('publicHolidays') || '13';
  
  // 额外参数 - 工作环境
  const workEnvironment = searchParams.get('workEnvironment') || '1.0';
  const leadership = searchParams.get('leadership') || '1.0';
  const teamwork = searchParams.get('teamwork') || '1.0';
  const homeTown = searchParams.get('homeTown') || 'no';
  const shuttle = searchParams.get('shuttle') || '1.0';
  const canteen = searchParams.get('canteen') || '1.0';
  
  // 额外参数 - 学历和工作经验
  const degreeType = searchParams.get('degreeType') || 'bachelor';
  const schoolType = searchParams.get('schoolType') || 'elite';
  const bachelorType = searchParams.get('bachelorType') || 'elite';
  const education = searchParams.get('education') || '1.2';
  const workYears = searchParams.get('workYears') || '0';
  const jobStability = searchParams.get('jobStability') || 'private';
  
  return (
    <ShareCard
      // 基础数据
      value={value}
      assessment={assessment}
      assessmentColor={assessmentColor}
      cityFactor={cityFactor}
      workHours={workHours}
      commuteHours={commuteHours}
      restTime={restTime}
      dailySalary={dailySalary}
      isYuan={isYuan}
      workDaysPerYear={workDaysPerYear}
      
      // 详细工作信息
      workDaysPerWeek={workDaysPerWeek}
      wfhDaysPerWeek={wfhDaysPerWeek}
      annualLeave={annualLeave}
      paidSickLeave={paidSickLeave}
      publicHolidays={publicHolidays}
      
      // 工作环境
      workEnvironment={workEnvironment}
      leadership={leadership}
      teamwork={teamwork}
      homeTown={homeTown}
      shuttle={shuttle}
      canteen={canteen}
      
      // 学历和工作经验
      degreeType={degreeType}
      schoolType={schoolType}
      bachelorType={bachelorType}
      education={education}
      workYears={workYears}
      jobStability={jobStability}
    />
  );
} 