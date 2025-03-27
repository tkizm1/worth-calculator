"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import Link from 'next/link';

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
  isYuan: boolean;
  workDaysPerYear: string;
  
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
const getCityName = (cityFactor: string): string => {
  if (cityFactor === '0.70') return "一线城市";
  else if (cityFactor === '0.80') return "新一线城市";
  else if (cityFactor === '1.0') return "二线城市";
  else if (cityFactor === '1.10') return "三线城市";
  else if (cityFactor === '1.25') return "四线城市";
  else if (cityFactor === '1.40') return "县城";
  else if (cityFactor === '1.50') return "乡镇";
  return "三线城市"; // 默认值
};

// 获取工作环境描述
const getWorkEnvironmentDesc = (env: string): string => {
  if (env === '0.8') return "偏僻的工厂/工地/户外";
  else if (env === '0.9') return "工厂/工地/户外";
  else if (env === '1.0') return "普通环境";
  else if (env === '1.1') return "CBD";
  return "普通环境";
};

// 获取领导评价
const getLeadershipDesc = (rating: string): string => {
  if (rating === '0.7') return "对我不爽";
  else if (rating === '0.9') return "管理严格";
  else if (rating === '1.0') return "中规中矩";
  else if (rating === '1.1') return "善解人意";
  else if (rating === '1.3') return "我是嫡系";
  return "中规中矩";
};

// 获取同事环境评价
const getTeamworkDesc = (rating: string): string => {
  if (rating === '0.9') return "都是傻逼";
  else if (rating === '1.0') return "萍水相逢";
  else if (rating === '1.1') return "和和睦睦";
  else if (rating === '1.2') return "私交甚好";
  return "萍水相逢";
};

// 获取班车服务描述
const getShuttleDesc = (shuttle: string): string => {
  if (shuttle === '1.0') return "无班车";
  else if (shuttle === '0.9') return "班车不便";
  else if (shuttle === '0.7') return "便利班车";
  else if (shuttle === '0.5') return "班车直达";
  return "无班车";
};

// 获取食堂情况描述
const getCanteenDesc = (canteen: string): string => {
  if (canteen === '1.0') return "无食堂/很难吃";
  else if (canteen === '1.05') return "食堂一般";
  else if (canteen === '1.1') return "食堂不错";
  else if (canteen === '1.15') return "食堂超赞";
  return "无食堂/很难吃";
};

// 获取合同类型描述
const getJobStabilityDesc = (type: string): string => {
  if (type === 'private') return "私企续签";
  else if (type === 'foreign') return "外企续签";
  else if (type === 'state') return "长期雇佣";
  else if (type === 'government') return "永久编制";
  return "私企续签";
};

// 获取学历描述
const getDegreeDesc = (type: string): string => {
  if (type === 'belowBachelor') return "专科及以下";
  else if (type === 'bachelor') return "本科";
  else if (type === 'masters') return "硕士";
  else if (type === 'phd') return "博士";
  return "本科";
};

// 获取学校类型描述
const getSchoolTypeDesc = (type: string, degree: string): string => {
  if (type === 'secondTier') return "二本三本";
  else if (type === 'firstTier') {
    if (degree === 'bachelor') return "双非/ QS200/ USnews80";
    return "双非/ QS100/ USnews50";
  } 
  else if (type === 'elite') {
    if (degree === 'bachelor') return "985211/ QS50/ USnews30";
    return "985211/ QS30/ USnews20";
  }
  return "双非";
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
const getWorkYearsDesc = (years: string): string => {
  if (years === '0') return "应届生";
  else if (years === '1') return "1-3年";
  else if (years === '2') return "3-5年";
  else if (years === '4') return "5-8年";
  else if (years === '6') return "8-10年";
  else if (years === '10') return "10-12年";
  else if (years === '15') return "12年以上";
  return "应届生";
};

// 根据工作内容和选择生成个性化评价
const generatePersonalizedComments = (props: ShareCardProps) => {
  const comments = [];
  const valueNum = parseFloat(props.value);
  
  // 1. 根据总体性价比生成主评价
  let mainComment = "";
  if (valueNum < 0.6) {
    mainComment = "这份工作对你来说简直是一场噩梦，每一天都是艰难的挑战。";
  } else if (valueNum < 1.0) {
    mainComment = "这份工作让你疲惫不堪，但或许是通往更好未来的必经之路。";
  } else if (valueNum <= 1.8) {
    mainComment = "这份工作平平淡淡，既没有太多惊喜，也没有太多失望。";
  } else if (valueNum <= 2.5) {
    mainComment = "这份工作给你带来了不少成就感，是一份令人满意的选择。";
  } else if (valueNum <= 3.2) {
    mainComment = "这份工作几乎满足了你的所有期望，每天都充满干劲。";
  } else if (valueNum <= 4.0) {
    mainComment = "这份工作简直是为你量身定做的，既有挑战又有回报，令你心满意足。";
  } else {
    mainComment = "恭喜你找到了人生中的理想工作，这样的机会可遇而不可求！";
  }
  comments.push({ 
    title: "整体评价", 
    content: mainComment, 
    emoji: getEmoji(valueNum),
    details: [
      { label: "总体得分", value: `${props.value} (${props.assessment})` }
    ]
  });
  
  // 2. 工作城市评价
  const cityName = getCityName(props.cityFactor);
  const isHomeTown = props.homeTown === 'yes';
  let cityComment = "";
  if (isHomeTown) {
    cityComment = `在家乡工作，让你既能追求事业，又能照顾家人，平衡感满满。家的温暖和熟悉的环境给你带来额外的安全感和幸福感。`;
  } else {
    if (props.cityFactor === '0.70' || props.cityFactor === '0.80') {
      cityComment = `虽然生活成本较高，但丰富的机会和广阔的平台能够助你更快成长。`;
    } else if (props.cityFactor === '1.0' || props.cityFactor === '1.10') {
      cityComment = `生活节奏虽然没有一线城市那么快，但依然提供了不错的发展空间。这里的生活压力适中，让你能找到工作与生活之间的平衡。`;
    } else {
      cityComment = `你享受着低成本高质量的生活。虽然机会相对较少，但悠闲的生活节奏和较低的压力让你能更从容地面对人生。`;
    }
    cityComment += " 要照顾好自己，按时吃饭休息，你一个人去得那么远。";
  }
  comments.push({ 
    title: "城市选择", 
    content: cityComment, 
    emoji: isHomeTown ? "🏡" : "🌆",
    details: [
      { label: "所在城市", value: cityName },
      { label: "是否家乡", value: isHomeTown ? "是" : "否" }
    ]
  });
  
  // 3. 通勤与WFH评价
  const commuteHoursNum = parseFloat(props.commuteHours);
  const wfhDaysNum = parseFloat(props.wfhDaysPerWeek);
  const workDaysNum = parseFloat(props.workDaysPerWeek);
  const wfhRatio = workDaysNum > 0 ? (wfhDaysNum / workDaysNum) : 0;
  let commuteComment = "";
  
  if (commuteHoursNum <= 1) {
    commuteComment = "你的通勤时间很短，让你每天都能多出宝贵的时间用于自我提升或休息。";
  } else if (commuteHoursNum <= 2) {
    commuteComment = "你的通勤时间适中，不会让你感到太大压力，也可以利用这段时间听书或补觉。";
  } else {
    commuteComment = "你长时间的通勤占用了大量宝贵时间，会对身心健康造成一定影响，建议考虑搬家或换工作以改善。";
  }
  
  if (wfhRatio >= 0.6) {
    commuteComment += " 而且你有大量居家办公的机会，进一步减轻了通勤负担，提高了工作生活质量。";
  } else if (wfhRatio >= 0.2) {
    commuteComment += " 你的部分居家办公安排也为你节省了不少通勤时间。";
  }
  
  if (props.shuttle === '0.7' || props.shuttle === '0.5') {
    commuteComment += " 公司提供的便利班车服务是一个不小的福利，让你的通勤更轻松愉快。";
  }
  
  comments.push({ 
    title: "通勤体验", 
    content: commuteComment, 
    emoji: wfhRatio >= 0.5 ? "🏠" : "🚌",
    details: [
      { label: "通勤时间", value: `${props.commuteHours} 小时/天` },
      { label: "远程办公", value: `${props.wfhDaysPerWeek}/${props.workDaysPerWeek} 天/周 (${Math.round(wfhRatio * 100)}%)` },
      { label: "班车服务", value: getShuttleDesc(props.shuttle) }
    ]
  });
  
  // 4. 工作环境与人际关系评价
  const leadershipRating = props.leadership;
  const teamworkRating = props.teamwork;
  const workEnvironment = props.workEnvironment;
  
  let environmentComment = "";
  
  if (workEnvironment === '1.1') {
    environmentComment = "在CBD的办公环境既专业又现代化，提供了良好的职业形象和便利的工作条件。";
  } else if (workEnvironment === '0.8' || workEnvironment === '0.9') {
    environmentComment = "在工厂/户外环境工作确实有些挑战，但也培养了你的坚韧品质和适应能力。";
  } else {
    environmentComment = "你的工作环境舒适适中，能满足基本需求，为高效工作提供了足够的保障。";
  }
  
  // 更细致的领导关系评价
  if (leadershipRating === '1.3') {
    environmentComment += " 你享受着作为嫡系的优越待遇和发展机会，但也面临着更高的期望和责任。";
  } else if (leadershipRating === '1.1') {
    environmentComment += " 你的领导能够理解你的工作状态并提供必要的支持，这在职场中非常难得。";
  } else if (leadershipRating === '1.0') {
    environmentComment += " 你和领导各司其职，这种关系虽然普通但稳定可靠。";
  } else if (leadershipRating === '0.9') {
    environmentComment += " 你领导的管理风格较为严格，这种严格虽然有时让人压力大，但也能促使你更加专业和自律。";
  } else if (leadershipRating === '0.7') {
    environmentComment += " 你与领导之间的关系有些紧张，这种情况下要学会保持情绪稳定，专注于工作本身，同时提升自己的沟通技巧。";
  }
  
  // 更细致的同事关系评价
  if (teamworkRating === '1.2') {
    environmentComment += " 你与同事们建立了深厚的私人友谊，工作之余还能互相支持和陪伴，这种关系让职场生活更加充实和有意义。";
  } else if (teamworkRating === '1.1') {
    environmentComment += " 团队氛围和谐友善，同事之间相互尊重和支持，这种积极的人际环境让工作过程更加愉快和高效。";
  } else if (teamworkRating === '1.0') {
    environmentComment += " 与同事们相处和平但不过分亲近，这种关系模式适合专注于工作的职场人士。";
  } else if (teamworkRating === '0.9') {
    environmentComment += " 同事关系略显紧张，这种环境虽然不太舒适，但也锻炼了你的独立工作能力和心理承受力。";
  }
  
  comments.push({ 
    title: "职场环境", 
    content: environmentComment, 
    emoji: "🏢",
    details: [
      { label: "办公环境", value: getWorkEnvironmentDesc(workEnvironment) },
      { label: "领导关系", value: getLeadershipDesc(leadershipRating) },
      { label: "同事氛围", value: getTeamworkDesc(teamworkRating) },
      { label: "食堂情况", value: getCanteenDesc(props.canteen) }
    ]
  });
  
  // 5. 工作时间与强度评价
  const workHoursNum = parseFloat(props.workHours);
  const restTimeNum = parseFloat(props.restTime);
  const effectiveWorkTime = workHoursNum + parseFloat(props.commuteHours) - 0.5 * restTimeNum;
  
  let workTimeComment = "";
  if (effectiveWorkTime <= 8) {
    workTimeComment = "你的工作强度适中，有足够的时间照顾个人生活，保持着良好的工作生活平衡。";
  } else if (effectiveWorkTime <= 11) {
    workTimeComment = "你的工作时间略长，但仍在可接受范围内。注意合理安排休息时间，避免长期疲劳。";
  } else {
    workTimeComment = "你的工作时间过长，长期如此可能影响健康和生活质量。建议寻找方法提高效率或与上级商量调整工作安排。";
  }
  
  if (restTimeNum >= 2.5) {
    workTimeComment += " 你有充足的休息和午休时间，这有助于恢复精力，提高下午的工作效率。";
  } else if (restTimeNum <= 1) {
    workTimeComment += " 你的休息时间较少，记得定期起身活动，防止久坐带来的健康问题。";
  }
  
  const annualLeaveNum = parseFloat(props.annualLeave);
  if (annualLeaveNum >= 15) {
    workTimeComment += " 丰富的年假让你有充分的时间休整和旅行，这对维持长期工作动力非常重要。";
  } else if (annualLeaveNum <= 5) {
    workTimeComment += " 你的年假较少，可以考虑更有效地规划和利用这些宝贵的休假时间。";
  }
  
  const totalLeave = parseFloat(props.annualLeave) + parseFloat(props.publicHolidays) + parseFloat(props.paidSickLeave) * 0.6;
  
  comments.push({ 
    title: "工作节奏", 
    content: workTimeComment, 
    emoji: "⏱️",
    details: [
      { label: "工作时长", value: `${props.workHours} 小时/天` },
      { label: "有效工作时间", value: `${effectiveWorkTime.toFixed(1)} 小时/天` },
      { label: "午休与摸鱼", value: `${props.restTime} 小时/天` },
      { label: "年假天数", value: `${props.annualLeave} 天/年` },
      { label: "带薪病假", value: `${props.paidSickLeave} 天/年` },
      { label: "法定假日", value: `${props.publicHolidays} 天/年` },
      { label: "总休假时间", value: `${totalLeave.toFixed(1)} 天/年` }
    ]
  });
  
  // 6. 教育背景与职业发展评价
  const degreeType = props.degreeType;
  const workYears = props.workYears;
  const jobStability = props.jobStability;
  
  let careerComment = "";
  if (degreeType === 'phd') {
    careerComment = "博士学历是你职场的一张重要名片，为你打开了许多高端研究和专业岗位的大门。";
  } else if (degreeType === 'masters') {
    careerComment = "硕士学历在当今就业市场仍有一定优势，证明了你的学习能力和专业素养。";
  } else if (degreeType === 'bachelor') {
    careerComment = "本科学历为你的职业生涯奠定了坚实基础，结合实际经验，你能在各个领域找到发展机会。";
  } else {
    careerComment = "专科及以下学历虽然在某些领域可能面临挑战，但实践经验和专业技能同样能帮你赢得认可。";
  }
  
  if (workYears === '0') {
    careerComment += " 作为应届生，你充满朝气和学习热情，有无限的可能性去探索和成长。";
  } else if (parseInt(workYears) >= 6) {
    careerComment += " 多年的工作经验是你最宝贵的财富，让你在职场中更加从容和自信。";
  } else {
    careerComment += " 几年的工作经验让你更加了解行业和自己的优势，职业发展正处于上升期。";
  }
  
  if (jobStability === 'government') {
    careerComment += " 体制内的工作稳定性高，让你无需过多担忧失业风险，可以更从容地规划未来。";
  } else if (jobStability === 'private') {
    careerComment += " 私企的工作虽然有一定风险，但也提供了更多成长和收入提升的机会。";
  }
  
  comments.push({ 
    title: "职业发展", 
    content: careerComment, 
    emoji: "📚",
    details: [
      { label: "最高学历", value: getDegreeDesc(degreeType) },
      { label: "学校类型", value: getSchoolTypeDesc(props.schoolType, degreeType) },
      { label: "工作年限", value: getWorkYearsDesc(workYears) },
      { label: "合同类型", value: getJobStabilityDesc(jobStability) }
    ]
  });
  
  // 7. 薪资评价
  const dailySalary = props.dailySalary;
  const isYuan = props.isYuan;
  
  let salaryComment = "";
  const salaryNumeric = parseFloat(dailySalary);
  if (isYuan) {
    if (salaryNumeric >= 1000) {
      salaryComment = "你的日薪处于较高水平，财务状况良好，能够满足日常生活和一定的休闲娱乐需求。";
    } else if (salaryNumeric >= 500) {
      salaryComment = "你的日薪处于中等水平，足以应对基本生活需求，但可能需要更细致的预算规划。";
    } else {
      salaryComment = "你的日薪较低，可能需要精打细算来管理财务，同时寻找提升收入的机会。";
    }
  } else {
    if (salaryNumeric >= 150) {
      salaryComment = "你的日薪处于较高水平，财务状况良好，能够满足日常生活和一定的休闲娱乐需求。";
    } else if (salaryNumeric >= 80) {
      salaryComment = "你的日薪处于中等水平，足以应对基本生活需求，但可能需要更细致的预算规划。";
    } else {
      salaryComment = "你的日薪较低，可能需要精打细算来管理财务，同时寻找提升收入的机会。";
    }
  }
  
  // 考虑城市因素
  if (props.cityFactor === '0.70' || props.cityFactor === '0.80') {
    salaryComment += " 在高生活成本的城市，你的薪资需要更精明地管理才能达到理想的生活质量。";
  } else if (props.cityFactor === '1.25' || props.cityFactor === '1.40' || props.cityFactor === '1.50') {
    salaryComment += " 在低生活成本的地区，你的薪资能够带来更高的生活质量和更多的储蓄机会。";
  }
  
  comments.push({ 
    title: "薪资水平", 
    content: salaryComment, 
    emoji: "💰",
    details: [
      { label: "日薪", value: `${isYuan ? '¥' : '$'}${dailySalary}/天` },
      { label: "年工作天数", value: `${props.workDaysPerYear} 天` }
    ]
  });
  
  // 8. 总结性价比评价
  let valueComment = "";
  if (valueNum < 1.0) {
    valueComment = "虽然目前的工作性价比较低，但这可能是积累经验的必经阶段。记住每份工作都有其价值，努力汲取经验，为下一步发展打好基础。";
  } else if (valueNum <= 2.0) {
    valueComment = "你的工作性价比处于中等水平，有优点也有不足。可以专注于现有优势，同时寻找提升不足方面的方法，让工作体验更加全面。";
  } else {
    valueComment = "恭喜你拥有高性价比的工作！这样的机会难得，要珍惜现在的环境，继续发挥自己的优势，享受工作带来的成就感和满足感。";
  }
  
  comments.push({ 
    title: "综合建议", 
    content: valueComment, 
    emoji: "💎",
    details: []
  });
  
  return comments;
};

const ShareCard: React.FC<ShareCardProps> = (props) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const simpleReportRef = useRef<HTMLDivElement>(null); // 添加简化版报告的引用
  const [isDownloading, setIsDownloading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  
  // 页面载入动画效果
  useEffect(() => {
    setFadeIn(true);
  }, []);

  // 生成个性化评价
  const personalizedComments = generatePersonalizedComments(props);
  
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
          <span>返回计算器</span>
        </Link>
      </div>
      
      <div ref={reportRef} className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 md:p-10">
        {/* 标题 */}
        <div className="mb-10 text-center">
          <div className="text-6xl mb-4">{getEmoji(parseFloat(props.value))}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            你的工作性价比报告
          </h1>
          <div className="flex justify-center items-center gap-3">
            <span className="text-2xl font-bold px-3 py-1 rounded-lg" style={{ color: getColorFromClassName(props.assessmentColor), backgroundColor: `${getColorFromClassName(props.assessmentColor)}20` }}>
              {props.value}
            </span>
            <span className="text-lg text-gray-700">{props.assessment}</span>
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
          <div>由&quot;这b班上得值不值·测算版&quot;精心定制</div>
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
          {isDownloading ? '生成中...' : '下载报告'}
        </button>
      </div>
      
      {/* 简化版报告，仅用于下载，在页面中隐藏 */}
      <div className="fixed top-0 left-0 opacity-0 pointer-events-none">
        <div ref={simpleReportRef} className="w-[800px] bg-white p-8 text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <div className="border border-gray-200 rounded-lg p-6">
            {/* 报告标题 */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-black">工作性价比报告</h1>
              <div className="mt-2 text-lg">
                <span className="font-semibold px-2 py-1 rounded" style={{ backgroundColor: `${getColorFromClassName(props.assessmentColor)}20`, color: getColorFromClassName(props.assessmentColor) }}>
                  {props.value} - {props.assessment}
                </span>
              </div>
            </div>
            
            {/* 数据表格 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 基础信息 */}
              <div className="col-span-2 border-b border-gray-200 pb-2 mb-2">
                <h2 className="font-bold text-gray-800">基础信息</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <div className="text-sm text-gray-600">工作城市</div>
                  <div className="font-medium text-gray-800">{getCityName(props.cityFactor)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">是否家乡</div>
                  <div className="font-medium text-gray-800">{props.homeTown === 'yes' ? '是' : '否'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">日薪</div>
                  <div className="font-medium text-gray-800">{props.isYuan ? '¥' : '$'}{props.dailySalary}/天</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">年工作天数</div>
                  <div className="font-medium text-gray-800">{props.workDaysPerYear} 天</div>
                </div>
              </div>
              
              {/* 工作时间 */}
              <div className="col-span-2 border-b border-gray-200 pb-2 mb-2 mt-4">
                <h2 className="font-bold text-gray-800">工作时间</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <div className="text-sm text-gray-600">每天工作</div>
                  <div className="font-medium text-gray-800">{props.workHours} 小时</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">每天通勤</div>
                  <div className="font-medium text-gray-800">{props.commuteHours} 小时</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">午休与休息</div>
                  <div className="font-medium text-gray-800">{props.restTime} 小时</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">每周工作天数</div>
                  <div className="font-medium text-gray-800">{props.workDaysPerWeek} 天</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">远程办公</div>
                  <div className="font-medium text-gray-800">{props.wfhDaysPerWeek}/{props.workDaysPerWeek} 天/周</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">班车服务</div>
                  <div className="font-medium text-gray-800">{getShuttleDesc(props.shuttle)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">年假</div>
                  <div className="font-medium text-gray-800">{props.annualLeave} 天/年</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">带薪病假</div>
                  <div className="font-medium text-gray-800">{props.paidSickLeave} 天/年</div>
                </div>
              </div>
              
              {/* 工作环境 */}
              <div className="col-span-2 border-b border-gray-200 pb-2 mb-2 mt-4">
                <h2 className="font-bold text-gray-800">工作环境</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <div className="text-sm text-gray-600">办公环境</div>
                  <div className="font-medium text-gray-800">{getWorkEnvironmentDesc(props.workEnvironment)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">领导关系</div>
                  <div className="font-medium text-gray-800">{getLeadershipDesc(props.leadership)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">同事关系</div>
                  <div className="font-medium text-gray-800">{getTeamworkDesc(props.teamwork)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">食堂情况</div>
                  <div className="font-medium text-gray-800">{getCanteenDesc(props.canteen)}</div>
                </div>
              </div>
              
              {/* 教育背景 */}
              <div className="col-span-2 border-b border-gray-200 pb-2 mb-2 mt-4">
                <h2 className="font-bold text-gray-800">教育与工作经验</h2>
              </div>
              <div className="grid grid-cols-2 gap-2 col-span-2">
                <div>
                  <div className="text-sm text-gray-600">最高学历</div>
                  <div className="font-medium text-gray-800">{getDegreeDesc(props.degreeType)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">学校类型</div>
                  <div className="font-medium text-gray-800">{getSchoolTypeDesc(props.schoolType, props.degreeType)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">工作年限</div>
                  <div className="font-medium text-gray-800">{getWorkYearsDesc(props.workYears)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">合同类型</div>
                  <div className="font-medium text-gray-800">{getJobStabilityDesc(props.jobStability)}</div>
                </div>
              </div>
              
              {/* 结论 */}
              <div className="col-span-2 border-b border-gray-200 pb-2 mb-2 mt-4">
                <h2 className="font-bold text-gray-800">最终评估</h2>
              </div>
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="text-3xl mr-2">{getEmoji(parseFloat(props.value))}</div>
                  <div className="text-xl font-bold" style={{ color: getColorFromClassName(props.assessmentColor) }}>
                    {props.value} - {props.assessment}
                  </div>
                </div>
                <p className="text-gray-700">
                  {parseFloat(props.value) < 1.0 
                    ? "当前工作性价比较低，建议积累经验后考虑寻找新机会。" 
                    : parseFloat(props.value) <= 2.0 
                      ? "工作性价比处于中等水平，有发展潜力。" 
                      : "高性价比工作，值得珍惜和长期发展。"
                  }
                </p>
              </div>
            </div>
            
            {/* 页脚 */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              <div>worthjob.zippland.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCard; 