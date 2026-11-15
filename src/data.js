// 所有文字、配色和布局集中在这里。坐标是概念版的人工排布，便于保持树形构图。
import { LEAF_PROFILES } from './profiles.js';

export const ROOT = { id: 'me', label: '我', note: '未来未定', x: 1100, y: 1190 };
export const BRANCHES = [
  {
    id: 'study', label: '继续深造', note: '让好奇心走得更远', color: '#b6a0ed', icon: 'book', x: 780, y: 440,
    description: '继续学习基础理论与研究方法，在更长的学习周期里探索感兴趣的问题。', skills: ['研究兴趣', '学术基础', '长期投入'],
    children: [
      { id: 'graduate', label: '国内读研', note: '深入一个领域', x: 530, y: 185, description: '在国内继续攻读硕士，进一步学习专业知识，积累科研或工程实践。', skills: ['专业基础', '研究方向', '院校信息'] },
      { id: 'overseas', label: '出国留学', note: '打开国际视野', x: 730, y: 110, description: '到境外继续学习，探索不同的课程、研究环境与跨文化体验。', skills: ['语言能力', '申请准备', '学习规划'] },
      { id: 'doctorate', label: '直博', note: '走向长期研究', x: 940, y: 190, description: '以攻读博士为长期路径；可关注本科直博，也可在读研后继续攻博。这里将博士相关路径合并展示。', skills: ['科研体验', '问题意识', '持续投入'] },
    ],
  },
  {
    id: 'software', label: '软件与系统研发', note: '把想法写成真实世界', color: '#8fb9f3', icon: 'code', x: 480, y: 780,
    description: '从应用界面到系统底层，用代码构建可以运行、维护和不断改进的软件。', skills: ['编程基础', '工程实践', '系统思维'],
    children: [
      { id: 'web', label: '前后端开发', note: '连接界面与服务', x: 100, y: 570, description: '构建网页、服务接口与业务系统，让用户操作和后台数据连接起来。', skills: ['Web 基础', '数据结构', '项目实践'] },
      { id: 'client', label: '客户端开发', note: '打磨使用体验', x: 220, y: 405, description: '开发移动端或桌面端应用，关注交互体验、性能与平台特性。', skills: ['平台开发', '交互实现', '性能意识'] },
      { id: 'game', label: '游戏开发', note: '创造可交互世界', x: 390, y: 355, description: '参与游戏玩法、引擎工具或图形相关开发，把设计变成可玩的体验。', skills: ['编程能力', '数学基础', '游戏项目'] },
      { id: 'systems', label: '系统软件', note: '深入计算机底层', x: 530, y: 440, description: '探索操作系统、编译器、数据库等基础软件，理解软硬件之间的联系。', skills: ['计算机系统', '底层编程', '调试能力'] },
      { id: 'cloud', label: '云计算', note: '支撑服务的运行', x: 650, y: 540, description: '围绕云基础设施与分布式服务，研究系统的部署、扩展与稳定运行。', skills: ['网络基础', '分布式系统', '运维实践'] },
      { id: 'security', label: '网络安全', note: '守护系统与数据', x: 710, y: 670, description: '分析系统与网络中的安全问题，学习防护、检测与安全工程实践。', skills: ['网络协议', '系统基础', '安全实践'] },
    ],
  },
  {
    id: 'ai', label: '人工智能与数据', fullLabel: '人工智能与数据科学', note: '从数据中寻找新答案', color: '#79cdb6', icon: 'brain', x: 1280, y: 390,
    description: '围绕数据、模型与计算系统，探索机器学习方法和实际应用之间的连接。', skills: ['数学基础', '数据能力', '实验方法'],
    children: [
      { id: 'algorithm', label: 'AI 算法', note: '让模型理解问题', x: 1060, y: 155, description: '研究与应用人工智能算法，通过实验理解模型的能力和局限。', skills: ['数学基础', '算法实现', '实验分析'] },
      { id: 'llm', label: '大模型', note: '探索模型的边界', x: 1215, y: 75, description: '探索大模型的训练、适配、评估与应用，连接模型能力和具体任务。', skills: ['深度学习', '模型评估', '工程实践'] },
      { id: 'vision', label: '计算机视觉', note: '理解图像与视频', x: 1390, y: 110, description: '让计算机分析图像和视频，探索识别、检测与视觉理解等问题。', skills: ['图像基础', '深度学习', '数据处理'] },
      { id: 'nlp', label: '自然语言处理', note: '理解语言与表达', x: 1550, y: 200, description: '围绕文本与语言开展建模，探索理解、生成与信息处理任务。', skills: ['语言建模', '深度学习', '任务评估'] },
      { id: 'data', label: '数据科学', note: '用数据解释现象', x: 1550, y: 345, description: '通过统计分析、数据处理和建模，从数据中提炼可以检验的判断。', skills: ['统计基础', '数据分析', '结果表达'] },
      { id: 'mlsys', label: '机器学习系统', note: '让模型高效运行', x: 1110, y: 290, description: '关注模型训练、推理与部署背后的系统，连接机器学习和计算机工程。', skills: ['计算机系统', '机器学习', '性能分析'] },
    ],
  },
  {
    id: 'cross', label: '产品与技术交叉', note: '在技术与需求之间搭桥', color: '#e5b47e', icon: 'cross', x: 1680, y: 720,
    description: '把技术理解与用户需求、行业知识结合起来，寻找解决实际问题的方法。', skills: ['沟通表达', '需求分析', '技术理解'],
    children: [
      { id: 'product', label: '产品经理', note: '定义值得做的事', x: 1690, y: 455, description: '理解用户问题，梳理产品需求，与设计和研发协作推进产品。', skills: ['需求分析', '沟通协作', '产品思维'] },
      { id: 'operations', label: '产品运营', note: '连接产品与用户', x: 1850, y: 365, description: '围绕用户使用与反馈开展运营，通过数据和实践推动产品改进。', skills: ['用户理解', '数据分析', '执行协作'] },
      { id: 'consulting', label: '技术咨询', note: '拆解真实业务问题', x: 2020, y: 425, description: '理解组织的业务与技术现状，参与技术方案分析和改进建议。', skills: ['问题分析', '行业理解', '方案表达'] },
      { id: 'solutions', label: '方案架构师', note: '把技术组合成方案', x: 2100, y: 575, description: '根据业务场景整合技术方案。这通常需要逐步积累工程与行业经验，可作为长期发展方向。', skills: ['架构基础', '项目经验', '客户沟通'] },
      { id: 'fintech', label: '金融科技', note: '技术走入金融场景', x: 2100, y: 740, description: '在金融相关业务中应用软件、数据和智能技术，理解场景约束。', skills: ['技术能力', '金融常识', '风险意识'] },
      { id: 'health', label: 'AI + 医疗', note: '探索健康领域应用', x: 2020, y: 890, description: '探索人工智能与医疗健康的交叉应用，重视领域协作和实际验证。', skills: ['AI 基础', '领域协作', '数据意识'] },
      { id: 'manufacturing', label: '智能制造', note: '连接软件与生产', x: 1860, y: 950, description: '将软件、数据与智能技术用于生产制造场景，连接数字系统与实体过程。', skills: ['软件工程', '工业场景', '系统集成'] },
    ],
  },
  {
    id: 'public', label: '公共部门与教育', note: '让所学服务更多人', color: '#8eb7cf', icon: 'building', x: 760, y: 1070,
    description: '在公共服务、国企信息化与教育场景中发挥计算机专业能力；各类岗位的进入方式需分别了解。', skills: ['专业能力', '岗位信息', '服务意识'],
    children: [
      { id: 'civil', label: '公务员', note: '参与公共事务', x: 130, y: 850, description: '关注公共部门中与信息技术相关的岗位，按具体招录公告了解条件。', skills: ['岗位调研', '考试准备', '综合表达'] },
      { id: 'institution', label: '事业单位', note: '参与公共服务', x: 260, y: 970, description: '关注事业单位的信息化与技术岗位，结合具体单位了解工作内容。', skills: ['招聘信息', '专业基础', '岗位匹配'] },
      { id: 'state', label: '国企信息化', fullLabel: '国企信息技术岗位', note: '推动行业数字化', x: 400, y: 1070, description: '参与国有企业的信息系统建设、技术研发或数字化业务。', skills: ['工程能力', '业务理解', '团队协作'] },
      { id: 'teacher', label: '教师', note: '分享知识与方法', x: 545, y: 1120, description: '探索计算机或信息科技相关教学工作，按学段和岗位了解资格要求。', skills: ['教学表达', '学科基础', '资格准备'] },
      { id: 'edtech', label: '教育科技', note: '用技术支持学习', x: 520, y: 935, description: '围绕学习工具、教学平台与教育内容，探索技术和教育的结合。', skills: ['产品实践', '教育场景', '用户理解'] },
    ],
  },
  {
    id: 'independent', label: '创业与自主发展', note: '尝试走出自己的路', color: '#d6ca7d', icon: 'spark', x: 1470, y: 1150,
    description: '从一个真实需求或个人项目开始，探索更自主的工作方式，并逐步验证可持续性。', skills: ['自主学习', '需求验证', '持续交付'],
    children: [
      { id: 'startup', label: '科技创业', note: '把问题变成事业', x: 1280, y: 1100, description: '围绕真实问题构建技术产品，逐步验证需求、协作方式与商业模式。', skills: ['需求验证', '产品实现', '团队协作'] },
      { id: 'indie', label: '独立开发', fullLabel: '独立开发者', note: '独立做出一款产品', x: 1550, y: 1020, description: '独立完成产品从构想到开发、发布和维护的过程，从小项目积累经验。', skills: ['完整交付', '用户反馈', '时间管理'] },
      { id: 'opensource', label: '开源商业化', fullLabel: '开源项目商业化', note: '从共享走向可持续', x: 1710, y: 1070, description: '参与或维护开源项目，探索服务、支持与产品化等可持续发展方式。', skills: ['开源协作', '长期维护', '商业探索'] },
      { id: 'freelance', label: '自由职业', note: '自主组织工作', x: 1900, y: 1190, description: '以项目或专业服务开展工作，逐步建立交付能力和客户协作方式。', skills: ['专业技能', '客户沟通', '项目管理'] },
    ],
  },
];
export const ALL_NODES = [ROOT, ...BRANCHES.flatMap(branch => [branch, ...branch.children.map(node => ({ ...node, ...LEAF_PROFILES[node.id], branchId: branch.id, color: branch.color }))])];
