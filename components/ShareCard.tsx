"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';

// 扩展接口，支持更多属性
interface ShareCardProps {
  // 基础数据
  value: string;
  assessment: string;
  assessmentColor: string;
  cityFactor: string;
  workHours: string;
  commuteHours: string;
  restTime: string;
  dailySalary: string;
  isYuan: string;
  workDaysPerYear: string;
  countryCode: string;
  countryName: string;
  currencySymbol: string;
  
  // 详细工作信息
  workDaysPerWeek: string;
  wfhDaysPerWeek: string;
  annualLeave: string;
  paidSickLeave: string;
  publicHolidays: string;
  
  // 工作环境
  workEnvironment: string;
  leadership: string;
  teamwork: string;
  homeTown: string;
  shuttle: string;
  canteen: string;
  
  // 学历和工作经验
  degreeType: string;
  schoolType: string;
  bachelorType: string;
  education: string;
  workYears: string;
  jobStability: string;
}

// 将中文评级转换为翻译键
const getAssessmentKey = (assessment: string): string => {
  // 如果已经是翻译键，直接返回
  if (assessment.startsWith('rating_')) {
    return assessment;
  }
  
  // 否则，将中文评级转换为翻译键
  switch (assessment) {
    case '惨绝人寰': return 'rating_terrible';
    case '略惨': return 'rating_poor';
    case '一般': return 'rating_average';
    case '还不错': return 'rating_good';
    case '很爽': return 'rating_great';
    case '爽到爆炸': return 'rating_excellent';
    case '人生巅峰': return 'rating_perfect';
    case '请输入年薪': return 'rating_enter_salary';
    default: return assessment;
  }
};

// 获取CSS颜色代码
const getColorFromClassName = (className: string): string => {
  switch(className) {
    case 'text-pink-800': return '#9d174d';
    case 'text-red-500': return '#ef4444';
    case 'text-orange-500': return '#f97316';
    case 'text-blue-500': return '#3b82f6';
    case 'text-green-500': return '#22c55e';
    case 'text-purple-500': return '#a855f7';
    case 'text-yellow-400': return '#facc15';
    default: return '#1f2937'; // text-gray-900
  }
};

// 获取城市名称
const getCityName = (cityFactor: string, t: (key: string) => string): string => {
  if (cityFactor === '0.70') return t('city_tier1');
  else if (cityFactor === '0.80') return t('city_newtier1');
  else if (cityFactor === '1.0') return t('city_tier2');
  else if (cityFactor === '1.10') return t('city_tier3');
  else if (cityFactor === '1.25') return t('city_tier4');
  else if (cityFactor === '1.40') return t('city_county');
  else if (cityFactor === '1.50') return t('city_town');
  return t('city_tier3'); // 默认值
};

// 获取工作环境描述
const getWorkEnvironmentDesc = (env: string, t: (key: string) => string): string => {
  if (env === '0.8') return t('env_remote');
  else if (env === '0.9') return t('env_factory');
  else if (env === '1.0') return t('env_normal');
  else if (env === '1.1') return t('env_cbd');
  return t('env_normal');
};

// 获取领导评价
const getLeadershipDesc = (rating: string, t: (key: string) => string): string => {
  if (rating === '0.7') return t('leader_bad');
  else if (rating === '0.9') return t('leader_strict');
  else if (rating === '1.0') return t('leader_normal');
  else if (rating === '1.1') return t('leader_good');
  else if (rating === '1.3') return t('leader_favorite');
  return t('leader_normal');
};

// 获取同事环境评价
const getTeamworkDesc = (rating: string, t: (key: string) => string): string => {
  if (rating === '0.9') return t('team_bad');
  else if (rating === '1.0') return t('team_normal');
  else if (rating === '1.1') return t('team_good');
  else if (rating === '1.2') return t('team_excellent');
  return t('team_normal');
};

// 获取班车服务描述
const getShuttleDesc = (shuttle: string, t: (key: string) => string): string => {
  if (shuttle === '1.0') return t('shuttle_none');
  else if (shuttle === '0.9') return t('shuttle_inconvenient');
  else if (shuttle === '0.7') return t('shuttle_convenient');
  else if (shuttle === '0.5') return t('shuttle_direct');
  return t('shuttle_none');
};

// 获取食堂情况描述
const getCanteenDesc = (canteen: string, t: (key: string) => string): string => {
  if (canteen === '1.0') return t('canteen_none');
  else if (canteen === '1.05') return t('canteen_average');
  else if (canteen === '1.1') return t('canteen_good');
  else if (canteen === '1.15') return t('canteen_excellent');
  return t('canteen_none');
};

// 获取合同类型描述
const getJobStabilityDesc = (type: string, t: (key: string) => string): string => {
  if (type === 'private') return t('job_private');
  else if (type === 'foreign') return t('job_foreign');
  else if (type === 'state') return t('job_state');
  else if (type === 'government') return t('job_government');
  return t('job_private');
};

// 获取学历描述
const getDegreeDesc = (type: string, t: (key: string) => string): string => {
  if (type === 'belowBachelor') return t('below_bachelor');
  else if (type === 'bachelor') return t('bachelor');
  else if (type === 'masters') return t('masters');
  else if (type === 'phd') return t('phd');
  return t('bachelor');
};

// 获取学校类型描述
const getSchoolTypeDesc = (type: string, degree: string, t: (key: string) => string): string => {
  if (type === 'secondTier') return t('school_second_tier');
  else if (type === 'firstTier') {
    if (degree === 'bachelor') return t('school_first_tier_bachelor');
    return t('school_first_tier_higher');
  } 
  else if (type === 'elite') {
    if (degree === 'bachelor') return t('school_elite_bachelor');
    return t('school_elite_higher');
  }
  return t('school_first_tier_bachelor');
};

// 获取emoji表情
const getEmoji = (value: number): string => {
  if (value < 0.6) return '😭';
  if (value < 1.0) return '😔';
  if (value <= 1.8) return '😐';
  if (value <= 2.5) return '😊';
  if (value <= 3.2) return '😁';
  if (value <= 4.0) return '🤩';
  return '🎉';
};

// 获取工作年限描述
const getWorkYearsDesc = (years: string, t: (key: string) => string): string => {
  if (years === '0') return t('fresh_graduate');
  else if (years === '1') return t('years_1_3');
  else if (years === '2') return t('years_3_5');
  else if (years === '4') return t('years_5_8');
  else if (years === '6') return t('years_8_10');
  else if (years === '10') return t('years_10_12');
  else if (years === '15') return t('years_above_12');
  return t('fresh_graduate');
};

const ShareCard: React.FC<ShareCardProps> = (props) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const simpleReportRef = useRef<HTMLDivElement>(null); // 添加简化版报告的引用
  const [isDownloading, setIsDownloading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const { t, language } = useLanguage();
  
  // 页面载入动画效果
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 生成个性化评价
  const personalizedComments = (() => {
    const comments = [];
    const valueNum = parseFloat(props.value);
    
    // 1. 根据总体性价比生成主评价
    let mainComment = "";
    if (valueNum < 0.6) {
      mainComment = t('share_low_value_assessment_1');
    } else if (valueNum < 1.0) {
      mainComment = t('share_low_value_assessment_2');
    } else if (valueNum <= 1.8) {
      mainComment = t('share_medium_value_assessment_1');
    } else if (valueNum <= 2.5) {
      mainComment = t('share_medium_value_assessment_2');
    } else if (valueNum <= 3.2) {
      mainComment = t('share_high_value_assessment_1');
    } else if (valueNum <= 4.0) {
      mainComment = t('share_high_value_assessment_2');
    } else {
      mainComment = t('share_high_value_assessment_3');
    }
    comments.push({ 
      title: t('share_final_assessment'), 
      content: mainComment, 
      emoji: getEmoji(valueNum),
      details: [
        { label: t('share_final_assessment'), value: `${props.value} (${t(getAssessmentKey(props.assessment))})` }
      ]
    });
    
    // 2. 工作城市评价
    const cityName = getCityName(props.cityFactor, t);
    const isHomeTown = props.homeTown === 'yes';
    let cityComment = "";
    if (isHomeTown) {
      cityComment = t('share_hometown_comment');
    } else {
      if (props.cityFactor === '0.70' || props.cityFactor === '0.80') {
        cityComment = t('share_tier1_city_comment');
      } else if (props.cityFactor === '1.0' || props.cityFactor === '1.10') {
        cityComment = t('share_tier2_city_comment');
      } else {
        cityComment = t('share_tier3_city_comment');
      }
    }
    comments.push({ 
      title: t('share_work_city'), 
      content: cityComment, 
      emoji: isHomeTown ? "🏡" : "🌆",
      details: [
        { label: t('share_work_city'), value: cityName },
        { label: t('share_is_hometown'), value: isHomeTown ? t('share_yes') : t('share_no') },
        { label: t('share_country'), value: props.countryName }
      ]
    });
    
    // 3. 通勤与WFH评价
    const commuteHoursNum = parseFloat(props.commuteHours);
    const wfhDaysNum = parseFloat(props.wfhDaysPerWeek);
    const workDaysNum = parseFloat(props.workDaysPerWeek);
    const wfhRatio = workDaysNum > 0 ? (wfhDaysNum / workDaysNum) : 0;
    
    let commuteComment = "";
    
    if (commuteHoursNum <= 1) {
      commuteComment = t('share_commute_short');
    } else if (commuteHoursNum <= 2) {
      commuteComment = t('share_commute_medium');
    } else {
      commuteComment = t('share_commute_long');
    }
    
    if (wfhRatio >= 0.6) {
      commuteComment += " " + t('share_wfh_high');
    } else if (wfhRatio >= 0.2) {
      commuteComment += " " + t('share_wfh_medium');
    }
    
    if (props.shuttle === '0.7' || props.shuttle === '0.5') {
      commuteComment += " " + t('share_shuttle_service_good');
    }
    
    comments.push({ 
      title: t('share_daily_commute_hours'), 
      content: commuteComment, 
      emoji: wfhRatio >= 0.5 ? "🏠" : "🚌",
      details: [
        { label: t('share_daily_commute_hours'), value: `${props.commuteHours} ${t('share_hours')}` },
        { label: t('share_remote_work'), value: `${props.wfhDaysPerWeek}/${props.workDaysPerWeek} ${t('share_days_per_week')} (${Math.round(wfhRatio * 100)}%)` },
        { label: t('share_shuttle_service'), value: getShuttleDesc(props.shuttle, t) }
      ]
    });
    
    // 4. 工作环境与人际关系评价
    const leadershipRating = props.leadership;
    const teamworkRating = props.teamwork;
    const workEnvironment = props.workEnvironment;
    
    let environmentComment = "";
    
    if (workEnvironment === '1.1') {
      environmentComment = t('share_cbd_environment');
    } else if (workEnvironment === '0.8' || workEnvironment === '0.9') {
      environmentComment = t('share_factory_environment');
    } else {
      environmentComment = t('share_normal_environment');
    }
    
    // 更细致的领导关系评价
    if (leadershipRating === '1.3') {
      environmentComment += " " + t('share_leadership_excellent');
    } else if (leadershipRating === '1.1') {
      environmentComment += " " + t('share_leadership_good');
    } else if (leadershipRating === '1.0') {
      environmentComment += " " + t('share_leadership_normal');
    } else if (leadershipRating === '0.9') {
      environmentComment += " " + t('share_leadership_strict');
    } else if (leadershipRating === '0.7') {
      environmentComment += " " + t('share_leadership_bad');
    }
    
    // 更细致的同事关系评价
    if (teamworkRating === '1.2') {
      environmentComment += " " + t('share_teamwork_excellent');
    } else if (teamworkRating === '1.1') {
      environmentComment += " " + t('share_teamwork_good');
    } else if (teamworkRating === '1.0') {
      environmentComment += " " + t('share_teamwork_normal');
    } else if (teamworkRating === '0.9') {
      environmentComment += " " + t('share_teamwork_bad');
    }
    
    comments.push({ 
      title: t('share_work_environment_title'), 
      content: environmentComment, 
      emoji: "🏢",
      details: [
        { label: t('share_office_environment'), value: getWorkEnvironmentDesc(workEnvironment, t) },
        { label: t('share_leadership_relation'), value: getLeadershipDesc(leadershipRating, t) },
        { label: t('share_colleague_relationship'), value: getTeamworkDesc(teamworkRating, t) },
        { label: t('share_canteen_quality'), value: getCanteenDesc(props.canteen, t) }
      ]
    });
    
    // 5. 工作时间与强度评价
    const workHoursNum = parseFloat(props.workHours);
    const restTimeNum = parseFloat(props.restTime);
    const effectiveWorkTime = workHoursNum + parseFloat(props.commuteHours) - 0.5 * restTimeNum;
    
    let workTimeComment = "";
    if (effectiveWorkTime <= 8) {
      workTimeComment = t('share_workhours_balanced');
    } else if (effectiveWorkTime <= 11) {
      workTimeComment = t('share_workhours_long');
    } else {
      workTimeComment = t('share_workhours_excessive');
    }
    
    if (restTimeNum >= 2.5) {
      workTimeComment += " " + t('share_rest_adequate');
    } else if (restTimeNum <= 1) {
      workTimeComment += " " + t('share_rest_insufficient');
    }
    
    const annualLeaveNum = parseFloat(props.annualLeave);
    if (annualLeaveNum >= 15) {
      workTimeComment += " " + t('share_leave_abundant');
    } else if (annualLeaveNum <= 5) {
      workTimeComment += " " + t('share_leave_limited');
    }
    
    const totalLeave = parseFloat(props.annualLeave) + parseFloat(props.publicHolidays) + parseFloat(props.paidSickLeave) * 0.6;
    
    comments.push({ 
      title: t('share_work_hours_title'), 
      content: workTimeComment, 
      emoji: "⏱️",
      details: [
        { label: t('work_hours'), value: `${props.workHours} ${t('share_hours')}` },
        { label: t('share_daily_work_hours'), value: `${effectiveWorkTime.toFixed(1)} ${t('share_hours')}` },
        { label: t('rest_time'), value: `${props.restTime} ${t('share_hours')}` },
        { label: t('annual_leave'), value: `${props.annualLeave} ${t('share_days_per_year')}` },
        { label: t('paid_sick_leave'), value: `${props.paidSickLeave} ${t('share_days_per_year')}` },
        { label: t('public_holidays'), value: `${props.publicHolidays} ${t('share_days_per_year')}` }
      ]
    });
    
    // 6. 教育背景与职业发展评价
    const degreeType = props.degreeType;
    const workYears = props.workYears;
    const jobStability = props.jobStability;
    
    let careerComment = "";
    if (degreeType === 'phd') {
      careerComment = t('share_phd_comment');
    } else if (degreeType === 'masters') {
      careerComment = t('share_masters_comment');
    } else if (degreeType === 'bachelor') {
      careerComment = t('share_bachelor_comment');
    } else {
      careerComment = t('share_below_bachelor_comment');
    }
    
    if (workYears === '0') {
      careerComment += " " + t('share_fresh_graduate_comment');
    } else if (parseInt(workYears) >= 6) {
      careerComment += " " + t('share_experienced_comment');
    } else {
      careerComment += " " + t('share_mid_career_comment');
    }
    
    if (jobStability === 'government') {
      careerComment += " " + t('share_government_job_comment');
    } else if (jobStability === 'private') {
      careerComment += " " + t('share_private_job_comment');
    }
    
    comments.push({ 
      title: t('share_education_and_experience'), 
      content: careerComment, 
      emoji: "📚",
      details: [
        { label: t('share_highest_degree'), value: getDegreeDesc(degreeType, t) },
        { label: t('share_school_type_label'), value: getSchoolTypeDesc(props.schoolType, degreeType, t) },
        { label: t('share_work_years_label'), value: getWorkYearsDesc(workYears, t) },
        { label: t('share_contract_type_label'), value: getJobStabilityDesc(jobStability, t) }
      ]
    });
    
    // 7. 薪资评价
    const dailySalary = props.dailySalary;
    const isYuan = props.isYuan === 'true';
    
    let salaryComment = "";
    const salaryNumeric = parseFloat(dailySalary);
    if (isYuan) {
      if (salaryNumeric >= 1000) {
        salaryComment = t('share_salary_high_cny');
      } else if (salaryNumeric >= 500) {
        salaryComment = t('share_salary_medium_cny');
      } else {
        salaryComment = t('share_salary_low_cny');
      }
    } else {
      if (salaryNumeric >= 150) {
        salaryComment = t('share_salary_high_foreign');
      } else if (salaryNumeric >= 80) {
        salaryComment = t('share_salary_medium_foreign');
      } else {
        salaryComment = t('share_salary_low_foreign');
      }
    }
    
    // 考虑城市因素
    if (props.cityFactor === '0.70' || props.cityFactor === '0.80') {
      salaryComment += " " + t('share_high_cost_city');
    } else if (props.cityFactor === '1.25' || props.cityFactor === '1.40' || props.cityFactor === '1.50') {
      salaryComment += " " + t('share_low_cost_city');
    }
    
    comments.push({ 
      title: t('share_daily_salary'), 
      content: salaryComment, 
      emoji: "💰",
      details: [
        { label: t('share_daily_salary'), value: `${props.currencySymbol}${dailySalary}/${t('share_day')}` },
        { label: t('share_working_days_per_year'), value: `${props.workDaysPerYear} ${t('share_days')}` }
      ]
    });
    
    // 8. 总结性价比评价
    let valueComment = "";
    if (valueNum < 1.0) {
      valueComment = t('share_value_low');
    } else if (valueNum <= 2.0) {
      valueComment = t('share_value_medium');
    } else {
      valueComment = t('share_value_high');
    }
    
    comments.push({ 
      title: t('share_summary_advice'), 
      content: valueComment, 
      emoji: "💎",
      details: []
    });
    
    return comments;
  })();
  
  // 处理下载图片 - 使用简化版报告
  const handleDownload = async () => {
    if (!simpleReportRef.current || isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      // 获取简化版报告元素
      const element = simpleReportRef.current;
      
      // 使用html2canvas生成图片
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#FFFFFF',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // 转换为图片并下载
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = '工作性价比报告.png';
      link.click();
      
    } catch (error) {
      console.error('生成分享图片失败:', error);
      alert('生成分享图片失败，请稍后再试');
    } finally {
      setIsDownloading(false);
    }
  };

  // 获取背景样式
  const getBackground = () => {
    const valueNum = parseFloat(props.value);
    if (valueNum < 0.6) return 'from-pink-100 to-red-100 dark:from-pink-900 dark:to-red-900';
    if (valueNum < 1.0) return 'from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900';
    if (valueNum <= 1.8) return 'from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900';
    if (valueNum <= 2.5) return 'from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900';
    if (valueNum <= 3.2) return 'from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900';
    if (valueNum <= 4.0) return 'from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900';
    return 'from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackground()} flex flex-col items-center justify-start p-4 md:p-8 transition-opacity duration-1000 ${fadeIn ? 'opacity-100' : 'opacity-0'} dark:text-white`}>
      {/* 返回按钮 */}
      <div className="w-full max-w-4xl mb-6">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{t('share_back_to_calculator')}</span>
        </Link>
      </div>
      
      <div ref={reportRef} className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 md:p-10">
        {/* 标题 */}
        <div className="mb-10 text-center">
          <div className="text-6xl mb-4">{getEmoji(parseFloat(props.value))}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t('share_your_job_worth_report')}
          </h1>
          <div className="flex justify-center items-center gap-3">
            <span className="text-2xl font-bold px-3 py-1 rounded-lg" style={{ color: getColorFromClassName(props.assessmentColor), backgroundColor: `${getColorFromClassName(props.assessmentColor)}20` }}>
              {props.value}
            </span>
            <span className="text-lg text-gray-700">{t(getAssessmentKey(props.assessment))}</span>
          </div>
        </div>
        
        {/* 性价比评语卡片 */}
        <div className="space-y-8">
          {personalizedComments.map((comment, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 shadow-md transition-all hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{comment.emoji}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{comment.title}</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{comment.content}</p>
                  
                  {/* 用户选项详情 */}
                  {comment.details && comment.details.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2">
                        {comment.details.map((detail, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-xs text-gray-500">{detail.label}</span>
                            <span className="text-sm font-medium text-gray-800">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 底部信息 */}
        <div className="mt-10 text-center text-gray-500 space-y-1">
          <div>{t('share_custom_made')}</div>
          <div>worthjob.zippland.com</div>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? t('share_generating') : t('share_download_report')}
        </button>
      </div>
      
      {/* 简化版报告，仅用于下载，在页面中隐藏 */}
      <div className="fixed top-0 left-0 opacity-0 pointer-events-none">
        <div ref={simpleReportRef} className="w-[800px] bg-white p-8 text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {/* 报告头部 - 渐变背景 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 border-b border-gray-200">
              <div className="text-center">
                <div className="text-5xl mb-4">{getEmoji(parseFloat(props.value))}</div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('share_job_worth_report')}</h1>
                <div className="inline-block px-4 py-2 rounded-full bg-white shadow-sm">
                  <span className="font-semibold text-xl" style={{ color: getColorFromClassName(props.assessmentColor) }}>
                    {props.value} - {t(getAssessmentKey(props.assessment))}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 报告内容 */}
            <div className="p-6">
              {/* 数据表格 */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* 基础信息 */}
                <div className="col-span-2 mb-4">
                  <h2 className="font-bold text-gray-800 text-lg pb-2 mb-3 border-b border-gray-200 flex items-center">
                    <span className="mr-2">📊</span> {t('share_basic_info')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_work_city')}</div>
                      <div className="font-medium text-gray-800 mt-1">{getCityName(props.cityFactor, t)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_country')}</div>
                      <div className="font-medium text-gray-800 mt-1">{props.countryName}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_is_hometown')}</div>
                      <div className="font-medium text-gray-800 mt-1">{props.homeTown === 'yes' ? t('share_yes') : t('share_no')}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_daily_salary')}</div>
                      <div className="font-medium text-gray-800 mt-1">{props.currencySymbol}{props.dailySalary}/{t('share_day')}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_working_days_per_year')}</div>
                      <div className="font-medium text-gray-800 mt-1">{props.workDaysPerYear} {t('share_days')}</div>
                    </div>
                  </div>
                </div>
                
                {/* 工作时间 */}
                <div className="col-span-1">
                  <h2 className="font-bold text-gray-800 text-lg pb-2 mb-3 border-b border-gray-200 flex items-center">
                    <span className="mr-2">⏱️</span> {t('share_work_hours_title')}
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_daily_work_hours')}</span>
                      <span className="font-medium text-gray-800">{props.workHours} {t('share_hours')}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_daily_commute_hours')}</span>
                      <span className="font-medium text-gray-800">{props.commuteHours} {t('share_hours')}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_rest_time')}</span>
                      <span className="font-medium text-gray-800">{props.restTime} {t('share_hours')}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_weekly_work_days')}</span>
                      <span className="font-medium text-gray-800">{props.workDaysPerWeek} {t('share_days')}</span>
                    </div>
                  </div>
                </div>
                
                {/* 工作环境 */}
                <div className="col-span-1">
                  <h2 className="font-bold text-gray-800 text-lg pb-2 mb-3 border-b border-gray-200 flex items-center">
                    <span className="mr-2">🏢</span> {t('share_work_environment_title')}
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_office_environment')}</span>
                      <span className="font-medium text-gray-800">{getWorkEnvironmentDesc(props.workEnvironment, t)}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_leadership_relation')}</span>
                      <span className="font-medium text-gray-800">{getLeadershipDesc(props.leadership, t)}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_colleague_relationship')}</span>
                      <span className="font-medium text-gray-800">{getTeamworkDesc(props.teamwork, t)}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg flex justify-between">
                      <span className="text-sm text-gray-500">{t('share_canteen_quality')}</span>
                      <span className="font-medium text-gray-800">{getCanteenDesc(props.canteen, t)}</span>
                    </div>
                  </div>
                </div>
                
                {/* 教育背景 */}
                <div className="col-span-2 mt-2">
                  <h2 className="font-bold text-gray-800 text-lg pb-2 mb-3 border-b border-gray-200 flex items-center">
                    <span className="mr-2">📚</span> {t('share_education_and_experience')}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_highest_degree')}</div>
                      <div className="font-medium text-gray-800 mt-1">{getDegreeDesc(props.degreeType, t)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_school_type_label')}</div>
                      <div className="font-medium text-gray-800 mt-1">{getSchoolTypeDesc(props.schoolType, props.degreeType, t)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_work_years_label')}</div>
                      <div className="font-medium text-gray-800 mt-1">{getWorkYearsDesc(props.workYears, t)}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-500">{t('share_contract_type_label')}</div>
                      <div className="font-medium text-gray-800 mt-1">{getJobStabilityDesc(props.jobStability, t)}</div>
                    </div>
                  </div>
                </div>
                
                {/* 结论 */}
                <div className="col-span-2 mt-4">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-6 border border-gray-200">
                    <h2 className="font-bold text-gray-800 text-lg mb-3 flex items-center">
                      <span className="mr-2">💎</span> {t('share_final_assessment')}
                    </h2>
                    <div className="flex items-center mb-3">
                      <div className="text-4xl mr-3">{getEmoji(parseFloat(props.value))}</div>
                      <div className="text-xl font-bold" style={{ color: getColorFromClassName(props.assessmentColor) }}>
                        {props.value} - {t(getAssessmentKey(props.assessment))}
                      </div>
                    </div>
                    <p className="text-gray-700">
                      {parseFloat(props.value) < 1.0 
                        ? t('share_value_low') 
                        : parseFloat(props.value) <= 2.0 
                          ? t('share_value_medium') 
                          : t('share_value_high')
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 页脚 */}
            <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-700">{t('share_custom_made')}</div>
                  <div className="text-sm text-gray-500">worthjob.zippland.com</div>
                </div>
                <img 
                  src="/website.png" 
                  alt="" 
                  className="h-16 w-16 opacity-85" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCard; 