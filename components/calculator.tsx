"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Wallet, Github, FileText, Book } from 'lucide-react'; // 添加Book图标
import Link from 'next/link'; // 导入Link组件用于导航
import { useLanguage } from './LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

// 定义PPP转换因子映射表
const pppFactors: Record<string, { name: string, factor: number }> = {
  'AF': { name: '阿富汗', factor: 18.71 },
  'AO': { name: '安哥拉', factor: 167.66 },
  'AL': { name: '阿尔巴尼亚', factor: 41.01 },
  'AR': { name: '阿根廷', factor: 28.67 },
  'AM': { name: '亚美尼亚', factor: 157.09 },
  'AG': { name: '安提瓜和巴布达', factor: 2.06 },
  'AU': { name: '澳大利亚', factor: 1.47 },
  'AT': { name: '奥地利', factor: 0.76 },
  'AZ': { name: '阿塞拜疆', factor: 0.50 },
  'BI': { name: '布隆迪', factor: 680.41 },
  'BE': { name: '比利时', factor: 0.75 },
  'BJ': { name: '贝宁', factor: 211.97 },
  'BF': { name: '布基纳法索', factor: 209.84 },
  'BD': { name: '孟加拉国', factor: 32.81 },
  'BG': { name: '保加利亚', factor: 0.70 },
  'BH': { name: '巴林', factor: 0.18 },
  'BS': { name: '巴哈马', factor: 0.88 },
  'BA': { name: '波斯尼亚和黑塞哥维那', factor: 0.66 },
  'BY': { name: '白俄罗斯', factor: 0.77 },
  'BZ': { name: '伯利兹', factor: 1.37 },
  'BO': { name: '玻利维亚', factor: 2.60 },
  'BR': { name: '巴西', factor: 2.36 },
  'BB': { name: '巴巴多斯', factor: 2.24 },
  'BN': { name: '文莱达鲁萨兰国', factor: 0.58 },
  'BT': { name: '不丹', factor: 20.11 },
  'BW': { name: '博茨瓦纳', factor: 4.54 },
  'CF': { name: '中非共和国', factor: 280.19 },
  'CA': { name: '加拿大', factor: 1.21 },
  'CH': { name: '瑞士', factor: 1.14 },
  'CL': { name: '智利', factor: 418.43 },
  'CN': { name: '中国', factor: 4.19 },
  'CI': { name: '科特迪瓦', factor: 245.25 },
  'CM': { name: '喀麦隆', factor: 228.75 },
  'CD': { name: '刚果（金）', factor: 911.27 },
  'CG': { name: '刚果（布）', factor: 312.04 },
  'CO': { name: '哥伦比亚', factor: 1352.79 },
  'KM': { name: '科摩罗', factor: 182.34 },
  'CV': { name: '佛得角', factor: 46.51 },
  'CR': { name: '哥斯达黎加', factor: 335.86 },
  'CY': { name: '塞浦路斯', factor: 0.61 },
  'CZ': { name: '捷克共和国', factor: 12.66 },
  'DE': { name: '德国', factor: 0.75 },
  'DJ': { name: '吉布提', factor: 105.29 },
  'DM': { name: '多米尼克', factor: 1.69 },
  'DK': { name: '丹麦', factor: 6.60 },
  'DO': { name: '多米尼加共和国', factor: 22.90 },
  'DZ': { name: '阿尔及利亚', factor: 37.24 },
  'EC': { name: '厄瓜多尔', factor: 0.51 },
  'EG': { name: '阿拉伯埃及共和国', factor: 4.51 },
  'ES': { name: '西班牙', factor: 0.62 },
  'EE': { name: '爱沙尼亚', factor: 0.53 },
  'ET': { name: '埃塞俄比亚', factor: 12.11 },
  'FI': { name: '芬兰', factor: 0.84 },
  'FJ': { name: '斐济', factor: 0.91 },
  'FR': { name: '法国', factor: 0.73 },
  'GA': { name: '加蓬', factor: 265.46 },
  'GB': { name: '英国', factor: 0.70 },
  'GE': { name: '格鲁吉亚', factor: 0.90 },
  'GH': { name: '加纳', factor: 2.33 },
  'GN': { name: '几内亚', factor: 4053.64 },
  'GM': { name: '冈比亚', factor: 17.79 },
  'GW': { name: '几内亚比绍共和国', factor: 214.86 },
  'GQ': { name: '赤道几内亚', factor: 229.16 },
  'GR': { name: '希腊', factor: 0.54 },
  'GD': { name: '格林纳达', factor: 1.64 },
  'GT': { name: '危地马拉', factor: 4.01 },
  'GY': { name: '圭亚那', factor: 73.60 },
  'HK': { name: '中国香港特别行政区', factor: 6.07 },
  'HN': { name: '洪都拉斯', factor: 10.91 },
  'HR': { name: '克罗地亚', factor: 3.21 },
  'HT': { name: '海地', factor: 40.20 },
  'HU': { name: '匈牙利', factor: 148.01 },
  'ID': { name: '印度尼西亚', factor: 4673.65 },
  'IN': { name: '印度', factor: 21.99 },
  'IE': { name: '爱尔兰', factor: 0.78 },
  'IR': { name: '伊朗伊斯兰共和国', factor: 30007.63 },
  'IQ': { name: '伊拉克', factor: 507.58 },
  'IS': { name: '冰岛', factor: 145.34 },
  'IL': { name: '以色列', factor: 3.59 },
  'IT': { name: '意大利', factor: 0.66 },
  'JM': { name: '牙买加', factor: 72.03 },
  'JO': { name: '约旦', factor: 0.29 },
  'JP': { name: '日本', factor: 102.84 },
  'KZ': { name: '哈萨克斯坦', factor: 139.91 },
  'KE': { name: '肯尼亚', factor: 43.95 },
  'KG': { name: '吉尔吉斯斯坦', factor: 18.28 },
  'KH': { name: '柬埔寨', factor: 1400.09 },
  'KI': { name: '基里巴斯', factor: 1.00 },
  'KN': { name: '圣基茨和尼维斯', factor: 1.92 },
  'KR': { name: '大韩民国', factor: 861.82 },
  'LA': { name: '老挝', factor: 2889.36 },
  'LB': { name: '黎巴嫩', factor: 1414.91 },
  'LR': { name: '利比里亚', factor: 0.41 },
  'LY': { name: '利比亚', factor: 0.48 },
  'LC': { name: '圣卢西亚', factor: 1.93 },
  'LK': { name: '斯里兰卡', factor: 51.65 },
  'LS': { name: '莱索托', factor: 5.90 },
  'LT': { name: '立陶宛', factor: 0.45 },
  'LU': { name: '卢森堡', factor: 0.86 },
  'LV': { name: '拉脱维亚', factor: 0.48 },
  'MO': { name: '中国澳门特别行政区', factor: 5.18 },
  'MA': { name: '摩洛哥', factor: 3.92 },
  'MD': { name: '摩尔多瓦', factor: 6.06 },
  'MG': { name: '马达加斯加', factor: 1178.10 },
  'MV': { name: '马尔代夫', factor: 8.35 },
  'MX': { name: '墨西哥', factor: 9.52 },
  'MK': { name: '北马其顿', factor: 18.83 },
  'ML': { name: '马里', factor: 211.41 },
  'MT': { name: '马耳他', factor: 0.57 },
  'MM': { name: '缅甸', factor: 417.35 },
  'ME': { name: '黑山', factor: 0.33 },
  'MN': { name: '蒙古', factor: 931.67 },
  'MZ': { name: '莫桑比克', factor: 24.05 },
  'MR': { name: '毛里塔尼亚', factor: 12.01 },
  'MU': { name: '毛里求斯', factor: 16.52 },
  'MW': { name: '马拉维', factor: 298.82 },
  'MY': { name: '马来西亚', factor: 1.57 },
  'NA': { name: '纳米比亚', factor: 7.40 },
  'NE': { name: '尼日尔', factor: 257.60 },
  'NG': { name: '尼日利亚', factor: 144.27 },
  'NI': { name: '尼加拉瓜', factor: 11.75 },
  'NL': { name: '荷兰', factor: 0.77 },
  'NO': { name: '挪威', factor: 10.03 },
  'NP': { name: '尼泊尔', factor: 33.52 },
  'NZ': { name: '新西兰', factor: 1.45 },
  'PK': { name: '巴基斯坦', factor: 38.74 },
  'PA': { name: '巴拿马', factor: 0.46 },
  'PE': { name: '秘鲁', factor: 1.80 },
  'PH': { name: '菲律宾', factor: 19.51 },
  'PG': { name: '巴布亚新几内亚', factor: 2.11 },
  'PL': { name: '波兰', factor: 1.78 },
  'PR': { name: '波多黎各', factor: 0.92 },
  'PT': { name: '葡萄牙', factor: 0.57 },
  'PY': { name: '巴拉圭', factor: 2575.54 },
  'PS': { name: '约旦河西岸和加沙', factor: 0.57 },
  'QA': { name: '卡塔尔', factor: 2.06 },
  'RO': { name: '罗马尼亚', factor: 1.71 },
  'RU': { name: '俄罗斯联邦', factor: 25.88 },
  'RW': { name: '卢旺达', factor: 339.88 },
  'SA': { name: '沙特阿拉伯', factor: 1.61 },
  'SD': { name: '苏丹', factor: 21.85 },
  'SN': { name: '塞内加尔', factor: 245.98 },
  'SG': { name: '新加坡', factor: 0.84 },
  'SB': { name: '所罗门群岛', factor: 7.08 },
  'SL': { name: '塞拉利昂', factor: 2739.26 },
  'SV': { name: '萨尔瓦多', factor: 0.45 },
  'SO': { name: '索马里', factor: 9107.78 },
  'RS': { name: '塞尔维亚', factor: 41.13 },
  'ST': { name: '圣多美和普林西比', factor: 10.94 },
  'SR': { name: '苏里南', factor: 3.55 },
  'SK': { name: '斯洛伐克共和国', factor: 0.53 },
  'SI': { name: '斯洛文尼亚', factor: 0.56 },
  'SE': { name: '瑞典', factor: 8.77 },
  'SZ': { name: '斯威士兰', factor: 6.36 },
  'SC': { name: '塞舌尔', factor: 7.82 },
  'TC': { name: '特克斯科斯群岛', factor: 1.07 },
  'TD': { name: '乍得', factor: 220.58 },
  'TG': { name: '多哥', factor: 236.83 },
  'TH': { name: '泰国', factor: 12.34 },
  'TJ': { name: '塔吉克斯坦', factor: 2.30 },
  'TL': { name: '东帝汶', factor: 0.41 },
  'TT': { name: '特立尼达和多巴哥', factor: 4.15 },
  'TN': { name: '突尼斯', factor: 0.91 },
  'TR': { name: '土耳其', factor: 2.13 },
  'TV': { name: '图瓦卢', factor: 1.29 },
  'TZ': { name: '坦桑尼亚', factor: 888.32 },
  'UG': { name: '乌干达', factor: 1321.35 },
  'UA': { name: '乌克兰', factor: 7.69 },
  'UY': { name: '乌拉圭', factor: 28.45 },
  'US': { name: '美国', factor: 1.00 },
  'UZ': { name: '乌兹别克斯坦', factor: 2297.17 },
  'VC': { name: '圣文森特和格林纳丁斯', factor: 1.54 },
  'VN': { name: '越南', factor: 7473.67 },
  'VU': { name: '瓦努阿图', factor: 110.17 },
  'XK': { name: '科索沃', factor: 0.33 },
  'ZA': { name: '南非', factor: 6.93 },
  'ZM': { name: '赞比亚', factor: 5.59 },
  'ZW': { name: '津巴布韦', factor: 24.98 }
};

// 为英文界面添加国家名称
const countryNamesEn: Record<string, string> = {
  'AF': 'Afghanistan',
  'AO': 'Angola',
  'AL': 'Albania',
  'AR': 'Argentina',
  'AM': 'Armenia',
  'AG': 'Antigua and Barbuda',
  'AU': 'Australia',
  'AT': 'Austria',
  'AZ': 'Azerbaijan',
  'BI': 'Burundi',
  'BE': 'Belgium',
  'BJ': 'Benin',
  'BF': 'Burkina Faso',
  'BD': 'Bangladesh',
  'BG': 'Bulgaria',
  'BH': 'Bahrain',
  'BS': 'Bahamas',
  'BA': 'Bosnia and Herzegovina',
  'BY': 'Belarus',
  'BZ': 'Belize',
  'BO': 'Bolivia',
  'BR': 'Brazil',
  'BB': 'Barbados',
  'BN': 'Brunei Darussalam',
  'BT': 'Bhutan',
  'BW': 'Botswana',
  'CF': 'Central African Republic',
  'CA': 'Canada',
  'CH': 'Switzerland',
  'CL': 'Chile',
  'CN': 'China',
  'CI': 'Côte d\'Ivoire',
  'CM': 'Cameroon',
  'CD': 'Congo (DRC)',
  'CG': 'Congo (Republic)',
  'CO': 'Colombia',
  'KM': 'Comoros',
  'CV': 'Cape Verde',
  'CR': 'Costa Rica',
  'CY': 'Cyprus',
  'CZ': 'Czech Republic',
  'DE': 'Germany',
  'DJ': 'Djibouti',
  'DM': 'Dominica',
  'DK': 'Denmark',
  'DO': 'Dominican Republic',
  'DZ': 'Algeria',
  'EC': 'Ecuador',
  'EG': 'Egypt',
  'ES': 'Spain',
  'EE': 'Estonia',
  'ET': 'Ethiopia',
  'FI': 'Finland',
  'FJ': 'Fiji',
  'FR': 'France',
  'GA': 'Gabon',
  'GB': 'United Kingdom',
  'GE': 'Georgia',
  'GH': 'Ghana',
  'GN': 'Guinea',
  'GM': 'Gambia',
  'GW': 'Guinea-Bissau',
  'GQ': 'Equatorial Guinea',
  'GR': 'Greece',
  'GD': 'Grenada',
  'GT': 'Guatemala',
  'GY': 'Guyana',
  'HK': 'Hong Kong SAR',
  'HN': 'Honduras',
  'HR': 'Croatia',
  'HT': 'Haiti',
  'HU': 'Hungary',
  'ID': 'Indonesia',
  'IN': 'India',
  'IE': 'Ireland',
  'IR': 'Iran',
  'IQ': 'Iraq',
  'IS': 'Iceland',
  'IL': 'Israel',
  'IT': 'Italy',
  'JM': 'Jamaica',
  'JO': 'Jordan',
  'JP': 'Japan',
  'KZ': 'Kazakhstan',
  'KE': 'Kenya',
  'KG': 'Kyrgyzstan',
  'KH': 'Cambodia',
  'KI': 'Kiribati',
  'KN': 'St. Kitts and Nevis',
  'KR': 'South Korea',
  'LA': 'Laos',
  'LB': 'Lebanon',
  'LR': 'Liberia',
  'LY': 'Libya',
  'LC': 'St. Lucia',
  'LK': 'Sri Lanka',
  'LS': 'Lesotho',
  'LT': 'Lithuania',
  'LU': 'Luxembourg',
  'LV': 'Latvia',
  'MO': 'Macao SAR',
  'MA': 'Morocco',
  'MD': 'Moldova',
  'MG': 'Madagascar',
  'MV': 'Maldives',
  'MX': 'Mexico',
  'MK': 'North Macedonia',
  'ML': 'Mali',
  'MT': 'Malta',
  'MM': 'Myanmar',
  'ME': 'Montenegro',
  'MN': 'Mongolia',
  'MZ': 'Mozambique',
  'MR': 'Mauritania',
  'MU': 'Mauritius',
  'MW': 'Malawi',
  'MY': 'Malaysia',
  'NA': 'Namibia',
  'NE': 'Niger',
  'NG': 'Nigeria',
  'NI': 'Nicaragua',
  'NL': 'Netherlands',
  'NO': 'Norway',
  'NP': 'Nepal',
  'NZ': 'New Zealand',
  'PK': 'Pakistan',
  'PA': 'Panama',
  'PE': 'Peru',
  'PH': 'Philippines',
  'PG': 'Papua New Guinea',
  'PL': 'Poland',
  'PR': 'Puerto Rico',
  'PT': 'Portugal',
  'PY': 'Paraguay',
  'PS': 'West Bank and Gaza',
  'QA': 'Qatar',
  'RO': 'Romania',
  'RU': 'Russia',
  'RW': 'Rwanda',
  'SA': 'Saudi Arabia',
  'SD': 'Sudan',
  'SN': 'Senegal',
  'SG': 'Singapore',
  'SB': 'Solomon Islands',
  'SL': 'Sierra Leone',
  'SV': 'El Salvador',
  'SO': 'Somalia',
  'RS': 'Serbia',
  'ST': 'São Tomé and Principe',
  'SR': 'Suriname',
  'SK': 'Slovak Republic',
  'SI': 'Slovenia',
  'SE': 'Sweden',
  'SZ': 'Eswatini',
  'SC': 'Seychelles',
  'TC': 'Turks and Caicos Islands',
  'TD': 'Chad',
  'TG': 'Togo',
  'TH': 'Thailand',
  'TJ': 'Tajikistan',
  'TL': 'Timor-Leste',
  'TT': 'Trinidad and Tobago',
  'TN': 'Tunisia',
  'TR': 'Turkey',
  'TV': 'Tuvalu',
  'TZ': 'Tanzania',
  'UG': 'Uganda',
  'UA': 'Ukraine',
  'UY': 'Uruguay',
  'US': 'United States',
  'UZ': 'Uzbekistan',
  'VC': 'St. Vincent and the Grenadines',
  'VN': 'Vietnam',
  'VU': 'Vanuatu',
  'XK': 'Kosovo',
  'ZA': 'South Africa',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe'
};

// 定义表单数据接口
interface FormData {
  salary: string;
  nonChinaSalary: boolean;
  workDaysPerWeek: string;
  wfhDaysPerWeek: string;
  annualLeave: string;
  paidSickLeave: string;
  publicHolidays: string;
  workHours: string;
  commuteHours: string;
  restTime: string;
  cityFactor: string;
  workEnvironment: string;
  leadership: string;
  teamwork: string;
  homeTown: string;
  degreeType: string;
  schoolType: string;
  bachelorType: string;
  workYears: string;
  shuttle: string;
  canteen: string;
  jobStability: string;
  education: string;
}

// 定义计算结果接口
interface Result {
  value: number;
  workDaysPerYear: number;
  dailySalary: number;
  assessment: string;
  assessmentColor: string;
}

const SalaryCalculator = () => {
  // 获取语言上下文
  const { t, language } = useLanguage();
  
  // 添加滚动位置保存的引用
  const scrollPositionRef = useRef(0);
  
  // 添加自动重定向逻辑
  useEffect(() => {
    // 在所有环境中执行重定向
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'worthjob.zippland.com' && hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
        window.location.href = 'https://worthjob.zippland.com' + window.location.pathname;
      }
    }
  }, []);

  // 添加用于创建分享图片的引用
  const shareResultsRef = useRef<HTMLDivElement>(null);

  // 状态管理 - 基础表单和选项
  const [formData, setFormData] = useState<FormData>({
    salary: '',
    nonChinaSalary: false,
    workDaysPerWeek: '5',
    wfhDaysPerWeek: '0',
    annualLeave: '5',
    paidSickLeave: '3',
    publicHolidays: '13',
    workHours: '10',
    commuteHours: '2',
    restTime: '2',
    cityFactor: '1.0',
    workEnvironment: '1.0',
    leadership: '1.0',
    teamwork: '1.0',
    homeTown: 'no',
    degreeType: 'bachelor',
    schoolType: 'firstTier',
    bachelorType: 'firstTier',
    workYears: '0',
    shuttle: '1.0',
    canteen: '1.0',
    jobStability: 'private',   // 新增：工作稳定度/类型
    education: '1.0'
  });

  const [showPPPInput, setShowPPPInput] = useState(false);
  // 修改为国家代码，默认为中国
  const [selectedCountry, setSelectedCountry] = useState<string>('CN');
  const [result, setResult] = useState<Result | null>(null);
  const [showPPPList, setShowPPPList] = useState(false);
  const [assessment, setAssessment] = useState("");
  const [assessmentColor, setAssessmentColor] = useState("text-gray-500");
  const [visitorVisible, setVisitorVisible] = useState(false);

  // 监听访客统计加载
  useEffect(() => {
    // 延迟检查busuanzi是否已加载
    const timer = setTimeout(() => {
      const pv = document.getElementById('busuanzi_value_site_pv');
      if (pv && pv.innerText !== '') {
        setVisitorVisible(true);
      } else {
        // 如果未加载，再次尝试
        const retryTimer = setTimeout(() => {
          const pv = document.getElementById('busuanzi_value_site_pv');
          if (pv && pv.innerText !== '') {
            setVisitorVisible(true);
          }
        }, 2000);
        return () => clearTimeout(retryTimer);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // 添加滚动位置保存和恢复逻辑
  useEffect(() => {
    const handleBeforeStateChange = () => {
      // 保存当前滚动位置
      if (typeof window !== 'undefined') {
        scrollPositionRef.current = window.scrollY;
      }
    };

    const handleAfterStateChange = () => {
      // 恢复滚动位置
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          window.scrollTo(0, scrollPositionRef.current);
        }, 0);
      }
    };

    // 添加到全局事件
    window.addEventListener('beforeStateChange', handleBeforeStateChange);
    window.addEventListener('afterStateChange', handleAfterStateChange);

    return () => {
      // 清理事件监听器
      window.removeEventListener('beforeStateChange', handleBeforeStateChange);
      window.removeEventListener('afterStateChange', handleAfterStateChange);
    };
  }, []);

  const calculateWorkingDays = useCallback(() => {
    const weeksPerYear = 52;
    const totalWorkDays = weeksPerYear * Number(formData.workDaysPerWeek); // 确保转换为数字
    const totalLeaves = Number(formData.annualLeave) + Number(formData.publicHolidays) + Number(formData.paidSickLeave) * 0.6; // 带薪病假按70%权重计算
    return Math.max(totalWorkDays - totalLeaves, 0);
  }, [formData.workDaysPerWeek, formData.annualLeave, formData.publicHolidays, formData.paidSickLeave]);

  const calculateDailySalary = useCallback(() => {
    if (!formData.salary) return 0;
    const workingDays = calculateWorkingDays();
    
    // 应用PPP转换因子标准化薪资
    // 如果选择了非中国地区，使用选定国家的PPP；否则使用中国默认值4.19
    const isNonChina = selectedCountry !== 'CN';
    const pppFactor = isNonChina ? pppFactors[selectedCountry]?.factor || 4.19 : 4.19;
    const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor);
    
    return standardizedSalary / workingDays; // 除 0 不管, Infinity(爽到爆炸)!
  }, [formData.salary, selectedCountry, calculateWorkingDays]);

  // 新增：获取显示用的日薪（转回原始货币）
  const getDisplaySalary = useCallback(() => {
    const dailySalaryInCNY = calculateDailySalary();
    const isNonChina = selectedCountry !== 'CN';
    if (isNonChina) {
      // 非中国地区，转回本地货币
      const pppFactor = pppFactors[selectedCountry]?.factor || 4.19;
      return (dailySalaryInCNY * pppFactor / 4.19).toFixed(2);
    } else {
      return dailySalaryInCNY.toFixed(2);
    }
  }, [calculateDailySalary, selectedCountry]);

  const handleInputChange = useCallback((name: string, value: string | boolean) => {
    // 触发自定义事件，保存滚动位置
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('beforeStateChange'));
    }
    
    // 直接设置值，不进行任何验证
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 在状态更新后，触发恢复滚动位置事件
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('afterStateChange'));
      }
    }, 0);
  }, []);

  const calculateValue = () => {
    if (!formData.salary) return 0;
    
    const dailySalary = calculateDailySalary();
    const workHours = Number(formData.workHours);
    const commuteHours = Number(formData.commuteHours);
    const restTime = Number(formData.restTime);
    
    // 确保正确转换为数字，使用parseFloat可以更可靠地处理字符串转数字
    const workDaysPerWeek = parseFloat(formData.workDaysPerWeek) || 5;
    
    // 允许wfhDaysPerWeek为空字符串，计算时才处理为0
    const wfhInput = formData.wfhDaysPerWeek.trim();
    const wfhDaysPerWeek = wfhInput === '' ? 0 : Math.min(parseFloat(wfhInput) || 0, workDaysPerWeek);
    
    // 确保有办公室工作天数时才计算比例，否则设为0
    const officeDaysRatio = workDaysPerWeek > 0 ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek : 0;
    
    // 在计算结果中添加一个小的日志输出，以便调试
    console.log('WFH计算:', { 
      workDaysPerWeek, 
      wfhDaysPerWeek, 
      officeDaysRatio, 
      effectiveCommute: commuteHours * officeDaysRatio 
    });
    
    // 通勤时间按办公室工作比例计算，并考虑班车因素
    const shuttleFactor = Number(formData.shuttle);
    const effectiveCommuteHours = commuteHours * officeDaysRatio * shuttleFactor;
    
    // 工作环境因素，包含食堂和家乡因素
    const canteenFactor = Number(formData.canteen);
    // 在家乡工作有额外加成
    const homeTownFactor = formData.homeTown === 'yes' ? 1.4 : 1.0;
    const environmentFactor = Number(formData.workEnvironment) * 
                            Number(formData.leadership) * 
                            Number(formData.teamwork) *
                            Number(formData.cityFactor) *
                            canteenFactor *
                            homeTownFactor;
    
    // 根据工作年限计算经验薪资倍数
    const workYears = Number(formData.workYears);
    let experienceSalaryMultiplier = 1.0;
    
    // 基准薪资增长曲线（适用于私企）
    let baseSalaryMultiplier = 1.0;
    if (workYears === 0) baseSalaryMultiplier = 1.0;         // 应届生基准值
    else if (workYears === 1) baseSalaryMultiplier = 1.5;    // 1年：1.50-2.00，取中间值
    else if (workYears <= 3) baseSalaryMultiplier = 2.2;     // 2-3年：2.20-2.50，取中间值
    else if (workYears <= 5) baseSalaryMultiplier = 2.7;     // 4-5年：2.70-3.00，取中间值
    else if (workYears <= 8) baseSalaryMultiplier = 3.2;     // 6-8年：3.20-3.50，取中间值
    else if (workYears <= 10) baseSalaryMultiplier = 3.6;    // 9-10年：3.60-3.80，取中间值
    else baseSalaryMultiplier = 3.9;                         // 11-13年：3.90-4.20，取中间值
    
    // 工作单位类型对涨薪幅度的影响系数
    let salaryGrowthFactor = 1.0;  // 私企基准
    if (formData.jobStability === 'foreign') {
      salaryGrowthFactor = 0.8;    // 外企涨薪幅度为私企的80%
    } else if (formData.jobStability === 'state') {
      salaryGrowthFactor = 0.4;    // 央/国企涨薪幅度为私企的30%（原先为50%）
    } else if (formData.jobStability === 'government') {
      salaryGrowthFactor = 0.2;   // 体制内涨薪幅度为私企的15%（原先为30%）
    }
    
    // 根据公式: 1 + (对应幅度-1) * 工作单位系数，计算最终薪资倍数
    experienceSalaryMultiplier = 1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
    
    // 薪资满意度应该受到经验薪资倍数的影响
    // 相同薪资，对于高经验者来说价值更低，对应的计算公式需要考虑经验倍数
    return (dailySalary * environmentFactor) / 
           (35 * (workHours + effectiveCommuteHours - 0.5 * restTime) * Number(formData.education) * experienceSalaryMultiplier);
  };

  const value = calculateValue();
  
  const getValueAssessment = () => {
    if (!formData.salary) return { text: t('rating_enter_salary'), color: "text-gray-500" };
    if (value < 0.6) return { text: t('rating_terrible'), color: "text-pink-800" };
    if (value < 1.0) return { text: t('rating_poor'), color: "text-red-500" };
    if (value <= 1.8) return { text: t('rating_average'), color: "text-orange-500" };
    if (value <= 2.5) return { text: t('rating_good'), color: "text-blue-500" };
    if (value <= 3.2) return { text: t('rating_great'), color: "text-green-500" };
    if (value <= 4.0) return { text: t('rating_excellent'), color: "text-purple-500" };
    return { text: t('rating_perfect'), color: "text-yellow-400" };
  };

  const RadioGroup = ({ label, name, value, onChange, options }: {
    label: string;
    name: string;
    value: string;
    onChange: (name: string, value: string | boolean) => void;
    options: Array<{ label: string; value: string; }>;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className={`grid ${language === 'en' ? 'grid-cols-3' : 'grid-cols-4'} gap-2`}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`px-3 py-2 rounded-md text-sm transition-colors
              ${value === option.value 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium' 
                : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'}`}
            onClick={(e) => {
              e.preventDefault(); // 阻止默认行为
              e.stopPropagation(); // 阻止事件冒泡
              onChange(name, option.value);
            }}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  // 根据学位类型和学校类型计算教育系数
  const calculateEducationFactor = useCallback(() => {
    const degreeType = formData.degreeType;
    const schoolType = formData.schoolType;
    const bachelorType = formData.bachelorType;
    
    // 使用更简单的方式计算系数，避免复杂的索引类型问题
    let factor = 1.0; // 默认值
    
    // 专科及以下固定为0.8
    if (degreeType === 'belowBachelor') {
      factor = 0.8;
    } 
    // 本科学历
    else if (degreeType === 'bachelor') {
      if (schoolType === 'secondTier') factor = 0.9;       // 二本三本
      else if (schoolType === 'firstTier') factor = 1.0;   // 双非/QS100/USnews50
      else if (schoolType === 'elite') factor = 1.2;       // 985/211/QS30/USnews20
    } 
    // 硕士学历 - 考虑本科背景
    else if (degreeType === 'masters') {
      // 先获取本科背景的基础系数
      let bachelorBaseCoefficient = 0;
      if (bachelorType === 'secondTier') bachelorBaseCoefficient = 0.9;       // 二本三本
      else if (bachelorType === 'firstTier') bachelorBaseCoefficient = 1.0;   // 双非/QS100/USnews50
      else if (bachelorType === 'elite') bachelorBaseCoefficient = 1.2;       // 985/211/QS30/USnews20
      
      // 再计算硕士学校的加成系数
      let mastersBonus = 0;
      if (schoolType === 'secondTier') mastersBonus = 0.4;       // 二本三本硕士
      else if (schoolType === 'firstTier') mastersBonus = 0.5;   // 双非/QS100/USnews50硕士
      else if (schoolType === 'elite') mastersBonus = 0.6;       // 985/211/QS30/USnews20硕士
      
      // 最终学历系数 = 本科基础 + 硕士加成
      factor = bachelorBaseCoefficient + mastersBonus;
    } 
    // 博士学历
    else if (degreeType === 'phd') {
      if (schoolType === 'secondTier') factor = 1.6;       // 二本三本博士
      else if (schoolType === 'firstTier') factor = 1.8;   // 双非/QS100/USnews50博士
      else if (schoolType === 'elite') factor = 2.0;       // 985/211/QS30/USnews20博士
    }
    
    // 更新education字段
    if (formData.education !== String(factor)) {
      // 这里不使用handleInputChange以避免触发滚动保存/恢复逻辑
      setFormData(prev => ({
        ...prev,
        education: String(factor)
      }));
    }
    
    return factor;
  }, [formData.degreeType, formData.schoolType, formData.bachelorType, formData.education]);
  
  // 在组件初始化和学历选择变化时计算教育系数
  useEffect(() => {
    calculateEducationFactor();
  }, [formData.degreeType, formData.schoolType, calculateEducationFactor]);

  // 获取当前选择的国家名称（根据语言）
  const getCountryName = useCallback((countryCode: string) => {
    if (language === 'en') {
      return countryNamesEn[countryCode] || pppFactors[countryCode]?.name || 'Unknown';
    }
    return pppFactors[countryCode]?.name || 'Unknown';
  }, [language]);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="mb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 py-2">{t('title')}</h1>
        
        <div className="flex items-center justify-center gap-3 mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('version')}</p>
          <a
            href="https://github.com/zippland/worth-calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Github className="h-3.5 w-3.5" />
            {t('github')}
          </a>
          <a
            href="https://www.xiaohongshu.com/user/profile/6355d5c4000000001f0292bf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <Book className="h-3.5 w-3.5" />
            {language === 'zh' ? t('xiaohongshu') : 'Rednote'}
          </a>
        </div>
        
        <div className="flex justify-center mb-2">
          <LanguageSwitcher />
        </div>
        
        {/* 访问统计 */}
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-600 flex justify-center gap-4">
          <span id="busuanzi_container_site_pv" className={visitorVisible ? 'opacity-100' : 'opacity-0'}>
            {t('visits')}: <span id="busuanzi_value_site_pv"></span>
            <span title="原seeyoufarm统计数据">+1,700,000</span>
          </span>
          <span id="busuanzi_container_site_uv" className={visitorVisible ? 'opacity-100' : 'opacity-0'}>
            {t('visitors')}: <span id="busuanzi_value_site_uv"></span>
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/30">
        <div className="p-6 space-y-8">
          {/* 薪资与工作时间 section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {selectedCountry !== 'CN' ? t('annual_salary_foreign') : t('annual_salary_cny')}
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  placeholder={selectedCountry !== 'CN' ? t('salary_placeholder_foreign') : t('salary_placeholder_cny')}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('country_selection')}
                <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                  ?
                  <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                    {t('ppp_tooltip')}
                  </span>
                </span>
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
              >
                {Object.keys(pppFactors).sort((a, b) => {
                  const nameA = getCountryName(a);
                  const nameB = getCountryName(b);
                  return nameA.localeCompare(nameB);
                }).map(code => (
                  <option key={code} value={code}>
                    {getCountryName(code)} ({pppFactors[code].factor})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('selected_ppp')}: {pppFactors[selectedCountry]?.factor || 4.19}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('work_days_per_week')}</label>
                <input
                  type="number"
                  value={formData.workDaysPerWeek}
                  onChange={(e) => handleInputChange('workDaysPerWeek', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('wfh_days_per_week')}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t('wfh_tooltip')}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={formData.workDaysPerWeek}
                  step="1"
                  value={formData.wfhDaysPerWeek}
                  onChange={(e) => handleInputChange('wfhDaysPerWeek', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('annual_leave')}</label>
                <input
                  type="number"
                  value={formData.annualLeave}
                  onChange={(e) => handleInputChange('annualLeave', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('public_holidays')}</label>
                <input
                  type="number"
                  value={formData.publicHolidays}
                  onChange={(e) => handleInputChange('publicHolidays', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('paid_sick_leave')}</label>
                <input
                  type="number"
                  value={formData.paidSickLeave}
                  onChange={(e) => handleInputChange('paidSickLeave', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('work_hours')}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t('work_hours_tooltip')}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.workHours}
                  onChange={(e) => handleInputChange('workHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('commute_hours')}
                  <span className="ml-1 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 cursor-pointer group relative">
                    ?
                    <span className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 w-48 sm:w-64">
                      {t('commute_tooltip')}
                    </span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.commuteHours}
                  onChange={(e) => handleInputChange('commuteHours', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('rest_time')}</label>
                <input
                  type="number"
                  value={formData.restTime}
                  onChange={(e) => handleInputChange('restTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

          {/* 环境系数 */}
          <div className="space-y-4">
            {/* 添加工作类型RadioGroup */}
            <RadioGroup
              label={t('job_stability')}
              name="jobStability"
              value={formData.jobStability}
              onChange={handleInputChange}
              options={[
                { label: t('job_private'), value: 'private' },
                { label: t('job_foreign'), value: 'foreign' },
                { label: t('job_state'), value: 'state' },
                { label: t('job_government'), value: 'government' },
              ]}
            />
            
            <RadioGroup
              label={t('work_environment')}
              name="workEnvironment"
              value={formData.workEnvironment}
              onChange={handleInputChange}
              options={[
                { label: t('env_remote'), value: '0.8' },
                { label: t('env_factory'), value: '0.9' },
                { label: t('env_normal'), value: '1.0' },
                { label: t('env_cbd'), value: '1.1' },
              ]}
            />

            <RadioGroup
              label={t('city_factor')}
              name="cityFactor"
              value={formData.cityFactor}
              onChange={handleInputChange}
              options={[
                { label: t('city_tier1'), value: '0.70' },
                { label: t('city_newtier1'), value: '0.80' },
                { label: t('city_tier2'), value: '1.0' },
                { label: t('city_tier3'), value: '1.10' },
                { label: t('city_tier4'), value: '1.25' },
                { label: t('city_county'), value: '1.40' },
                { label: t('city_town'), value: '1.50' },
              ]}
            />

            <RadioGroup
              label={t('hometown')}
              name="homeTown"
              value={formData.homeTown}
              onChange={handleInputChange}
              options={[
                { label: t('not_hometown'), value: 'no' },
                { label: t('is_hometown'), value: 'yes' },
              ]}
            />

            <RadioGroup
              label={t('leadership')}
              name="leadership"
              value={formData.leadership}
              onChange={handleInputChange}
              options={[
                { label: t('leader_bad'), value: '0.7' },
                { label: t('leader_strict'), value: '0.9' },
                { label: t('leader_normal'), value: '1.0' },
                { label: t('leader_good'), value: '1.1' },
                { label: t('leader_favorite'), value: '1.3' },
              ]}
            />

            <RadioGroup
              label={t('teamwork')}
              name="teamwork"
              value={formData.teamwork}
              onChange={handleInputChange}
              options={[
                { label: t('team_bad'), value: '0.9' },
                { label: t('team_normal'), value: '1.0' },
                { label: t('team_good'), value: '1.1' },
                { label: t('team_excellent'), value: '1.2' },
              ]}
            />

            <RadioGroup
              label={t('shuttle')}
              name="shuttle"
              value={formData.shuttle}
              onChange={handleInputChange}
              options={[
                { label: t('shuttle_none'), value: '1.0' },
                { label: t('shuttle_inconvenient'), value: '0.9' },
                { label: t('shuttle_convenient'), value: '0.7' },
                { label: t('shuttle_direct'), value: '0.5' },
              ]}
            />

            <RadioGroup
              label={t('canteen')}
              name="canteen"
              value={formData.canteen}
              onChange={handleInputChange}
              options={[
                { label: t('canteen_none'), value: '1.0' },
                { label: t('canteen_average'), value: '1.05' },
                { label: t('canteen_good'), value: '1.1' },
                { label: t('canteen_excellent'), value: '1.15' },
              ]}
            />

            {/* 学历和工作年限 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('education_level')}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('degree_type')}</label>
                    <select
                      value={formData.degreeType}
                      onChange={(e) => handleInputChange('degreeType', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="belowBachelor">{t('below_bachelor')}</option>
                      <option value="bachelor">{t('bachelor')}</option>
                      <option value="masters">{t('masters')}</option>
                      <option value="phd">{t('phd')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('school_type')}</label>
                    <select
                      value={formData.schoolType}
                      onChange={(e) => handleInputChange('schoolType', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      disabled={formData.degreeType === 'belowBachelor'}
                    >
                      <option value="secondTier">{t('school_second_tier')}</option>
                      {formData.degreeType === 'bachelor' ? (
                        <>
                          <option value="firstTier">{t('school_first_tier_bachelor')}</option>
                          <option value="elite">{t('school_elite_bachelor')}</option>
                        </>
                      ) : (
                        <>
                          <option value="firstTier">{t('school_first_tier_higher')}</option>
                          <option value="elite">{t('school_elite_higher')}</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                
                {/* 硕士显示本科背景选项 */}
                {formData.degreeType === 'masters' && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('bachelor_background')}</label>
                    <select
                      value={formData.bachelorType}
                      onChange={(e) => handleInputChange('bachelorType', e.target.value)}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    >
                      <option value="secondTier">{t('school_second_tier')}</option>
                      <option value="firstTier">{t('school_first_tier_bachelor')}</option>
                      <option value="elite">{t('school_elite_bachelor')}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 工作年限选择 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('work_years')}</label>
                <select
                  value={formData.workYears}
                  onChange={(e) => handleInputChange('workYears', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                >
                  <option value="0">{t('fresh_graduate')}</option>
                  <option value="1">{t('years_1_3')}</option>
                  <option value="2">{t('years_3_5')}</option>
                  <option value="4">{t('years_5_8')}</option>
                  <option value="6">{t('years_8_10')}</option>
                  <option value="10">{t('years_10_12')}</option>
                  <option value="15">{t('years_above_12')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 结果卡片优化 */}
      <div ref={shareResultsRef} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-inner">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('working_days_per_year')}</div>
            <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{calculateWorkingDays()}{t('days_unit')}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('average_daily_salary')}</div>
            <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">
              {selectedCountry !== 'CN' ? '$' : '¥'}{getDisplaySalary()}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('job_value')}</div>
            <div className={`text-2xl font-semibold mt-1 ${getValueAssessment().color}`}>
              {value.toFixed(2)}
              <span className="text-base ml-2">({getValueAssessment().text})</span>
            </div>
          </div>
        </div>
        
        {/* 修改分享按钮为链接到分享页面 */}
        <div className="mt-6 flex justify-end">
          <Link
            href={{
              pathname: '/share',
              query: {
                value: value.toFixed(2),
                assessment: getValueAssessment().text,
                assessmentColor: getValueAssessment().color,
                cityFactor: formData.cityFactor,
                workHours: formData.workHours,
                commuteHours: formData.commuteHours,
                restTime: formData.restTime,
                dailySalary: getDisplaySalary(),
                isYuan: selectedCountry !== 'CN' ? 'false' : 'true',
                workDaysPerYear: calculateWorkingDays().toString(),
                workDaysPerWeek: formData.workDaysPerWeek,
                wfhDaysPerWeek: formData.wfhDaysPerWeek,
                annualLeave: formData.annualLeave,
                paidSickLeave: formData.paidSickLeave,
                publicHolidays: formData.publicHolidays,
                workEnvironment: formData.workEnvironment,
                leadership: formData.leadership,
                teamwork: formData.teamwork,
                degreeType: formData.degreeType,
                schoolType: formData.schoolType,
                education: formData.education,
                homeTown: formData.homeTown,
                shuttle: formData.shuttle,
                canteen: formData.canteen,
                workYears: formData.workYears,
                jobStability: formData.jobStability,
                bachelorType: formData.bachelorType,
                countryCode: selectedCountry,
                countryName: getCountryName(selectedCountry)
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${formData.salary ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800' : 
              'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'}`}
          >
            <FileText className="w-4 h-4" />
            {t('view_report')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;