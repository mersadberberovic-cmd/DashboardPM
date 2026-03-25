// Mock data for the agency project management dashboard

export const currentUser = {
  id: 'u1',
  name: 'Alex Morgan',
  role: 'Agency Director',
  avatar: 'AM',
  email: 'alex@agencyhq.com',
};

export const teamMembers = [
  { id: 'u1', name: 'Alex Morgan',   role: 'Agency Director',   avatar: 'AM', color: '#6366f1', email: 'alex@agencyhq.com',    status: 'active', projects: 4, tasks: 7 },
  { id: 'u2', name: 'Jordan Lee',    role: 'Project Manager',   avatar: 'JL', color: '#f59e0b', email: 'jordan@agencyhq.com',  status: 'active', projects: 3, tasks: 12 },
  { id: 'u3', name: 'Sam Rivera',    role: 'Lead Designer',     avatar: 'SR', color: '#10b981', email: 'sam@agencyhq.com',     status: 'active', projects: 3, tasks: 9 },
  { id: 'u4', name: 'Taylor Kim',    role: 'Frontend Developer',avatar: 'TK', color: '#ef4444', email: 'taylor@agencyhq.com',  status: 'active', projects: 2, tasks: 14 },
  { id: 'u5', name: 'Casey Patel',   role: 'Backend Developer', avatar: 'CP', color: '#3b82f6', email: 'casey@agencyhq.com',   status: 'active', projects: 2, tasks: 11 },
  { id: 'u6', name: 'Morgan Chen',   role: 'Content Strategist',avatar: 'MC', color: '#8b5cf6', email: 'morgan@agencyhq.com',  status: 'away',   projects: 2, tasks: 5 },
  { id: 'u7', name: 'Riley Adams',   role: 'SEO Specialist',    avatar: 'RA', color: '#ec4899', email: 'riley@agencyhq.com',   status: 'active', projects: 1, tasks: 6 },
  { id: 'u8', name: 'Drew Wilson',   role: 'Account Manager',   avatar: 'DW', color: '#14b8a6', email: 'drew@agencyhq.com',   status: 'offline', projects: 3, tasks: 3 },
];

export const clients = [
  { id: 'c1', name: 'Brew Interactive',  logo: 'BI', color: '#6366f1' },
  { id: 'c2', name: 'TCA',              logo: 'TC', color: '#f59e0b' },
  { id: 'c3', name: 'Rankonmaps',       logo: 'RM', color: '#10b981' },
];

export const projects = [
  {
    id: 'p1',
    name: 'Brew Interactive – Web Redesign',
    client: 'c1',
    status: 'active',
    priority: 'high',
    progress: 55,
    budget: 12000,
    spent: 6600,
    startDate: '2026-02-10',
    dueDate: '2026-05-01',
    team: ['u1', 'u3', 'u4'],
    description: 'Full website redesign for Brew Interactive including new brand direction, UI/UX overhaul, and CMS integration.',
    tags: ['Design', 'Development', 'Branding'],
    tasksTotal: 20,
    tasksCompleted: 11,
  },
  {
    id: 'p2',
    name: 'TCA – Social & Content Strategy',
    client: 'c2',
    status: 'active',
    priority: 'medium',
    progress: 40,
    budget: 8500,
    spent: 3400,
    startDate: '2026-03-01',
    dueDate: '2026-06-15',
    team: ['u2', 'u6', 'u7'],
    description: 'Multi-platform social media management and content strategy for TCA — including monthly content calendars, copy, and reporting.',
    tags: ['Social Media', 'Content', 'Strategy'],
    tasksTotal: 16,
    tasksCompleted: 6,
  },
  {
    id: 'p3',
    name: 'Rankonmaps – Local SEO',
    client: 'c3',
    status: 'active',
    priority: 'high',
    progress: 30,
    budget: 6000,
    spent: 1800,
    startDate: '2026-03-10',
    dueDate: '2026-07-01',
    team: ['u7', 'u8', 'u5'],
    description: 'Local SEO and Google Maps optimisation campaign for Rankonmaps — GMB management, citations, and local content.',
    tags: ['SEO', 'Local SEO', 'Google Maps'],
    tasksTotal: 18,
    tasksCompleted: 5,
  },
];

export const tasks = [
  // Brew Interactive (p1)
  { id: 't1',  projectId: 'p1', title: 'Discovery & brand audit',              status: 'done',        priority: 'high',   assignee: 'u1', dueDate: '2026-02-20', tags: ['Strategy'] },
  { id: 't2',  projectId: 'p1', title: 'Wireframes – homepage & inner pages',  status: 'done',        priority: 'high',   assignee: 'u3', dueDate: '2026-03-05', tags: ['Design'] },
  { id: 't3',  projectId: 'p1', title: 'UI design – desktop & mobile',         status: 'in-progress', priority: 'high',   assignee: 'u3', dueDate: '2026-03-30', tags: ['Design'] },
  { id: 't4',  projectId: 'p1', title: 'Frontend build – React + CMS',         status: 'in-progress', priority: 'high',   assignee: 'u4', dueDate: '2026-04-10', tags: ['Dev'] },
  { id: 't5',  projectId: 'p1', title: 'Copywriting – all pages',              status: 'todo',        priority: 'medium', assignee: 'u6', dueDate: '2026-04-15', tags: ['Content'] },
  { id: 't6',  projectId: 'p1', title: 'QA & client sign-off',                 status: 'todo',        priority: 'low',    assignee: 'u1', dueDate: '2026-04-28', tags: ['QA'] },
  // TCA (p2)
  { id: 't7',  projectId: 'p2', title: 'Content strategy & brand voice doc',   status: 'done',        priority: 'high',   assignee: 'u6', dueDate: '2026-03-10', tags: ['Strategy'] },
  { id: 't8',  projectId: 'p2', title: 'Content calendar – April',             status: 'done',        priority: 'medium', assignee: 'u6', dueDate: '2026-03-20', tags: ['Content'] },
  { id: 't9',  projectId: 'p2', title: 'Social media graphics – April',        status: 'in-progress', priority: 'medium', assignee: 'u3', dueDate: '2026-03-28', tags: ['Design'] },
  { id: 't10', projectId: 'p2', title: 'Monthly performance report',           status: 'todo',        priority: 'medium', assignee: 'u2', dueDate: '2026-04-05', tags: ['Reporting'] },
  { id: 't11', projectId: 'p2', title: 'Content calendar – May',               status: 'todo',        priority: 'low',    assignee: 'u6', dueDate: '2026-04-20', tags: ['Content'] },
  { id: 't12', projectId: 'p2', title: 'Paid ads setup – Meta & Google',       status: 'todo',        priority: 'high',   assignee: 'u7', dueDate: '2026-04-25', tags: ['Ads'] },
  // Rankonmaps (p3)
  { id: 't13', projectId: 'p3', title: 'GMB profile audit & optimisation',     status: 'done',        priority: 'high',   assignee: 'u7', dueDate: '2026-03-18', tags: ['Local SEO'] },
  { id: 't14', projectId: 'p3', title: 'Citation building – top directories',  status: 'done',        priority: 'high',   assignee: 'u8', dueDate: '2026-03-22', tags: ['SEO'] },
  { id: 't15', projectId: 'p3', title: 'On-page SEO – location pages',         status: 'in-progress', priority: 'high',   assignee: 'u5', dueDate: '2026-04-01', tags: ['SEO', 'Dev'] },
  { id: 't16', projectId: 'p3', title: 'Review generation strategy',           status: 'in-progress', priority: 'medium', assignee: 'u7', dueDate: '2026-04-08', tags: ['Local SEO'] },
  { id: 't17', projectId: 'p3', title: 'Local content – blog posts x4',        status: 'todo',        priority: 'medium', assignee: 'u6', dueDate: '2026-04-20', tags: ['Content'] },
  { id: 't18', projectId: 'p3', title: 'Monthly rank tracking report',         status: 'todo',        priority: 'low',    assignee: 'u8', dueDate: '2026-04-30', tags: ['Reporting'] },
];

export const activity = [
  { id: 'a1', type: 'task_complete',  user: 'u7', text: 'completed "GMB profile audit & optimisation"',    project: 'p3', time: '15m ago' },
  { id: 'a2', type: 'task_start',     user: 'u3', text: 'started "Social media graphics – April"',         project: 'p2', time: '45m ago' },
  { id: 'a3', type: 'task_complete',  user: 'u6', text: 'completed "Content strategy & brand voice doc"',  project: 'p2', time: '1h ago' },
  { id: 'a4', type: 'task_start',     user: 'u4', text: 'started "Frontend build – React + CMS"',          project: 'p1', time: '2h ago' },
  { id: 'a5', type: 'file_upload',    user: 'u3', text: 'uploaded wireframes for Brew Interactive',        project: 'p1', time: '3h ago' },
  { id: 'a6', type: 'task_complete',  user: 'u8', text: 'completed "Citation building – top directories"', project: 'p3', time: '4h ago' },
  { id: 'a7', type: 'task_complete',  user: 'u6', text: 'completed "Content calendar – April"',            project: 'p2', time: '1d ago' },
  { id: 'a8', type: 'project_update', user: 'u1', text: 'updated milestone for Brew Interactive Web Redesign', project: 'p1', time: '1d ago' },
];

export const revenueData = [
  { month: 'Oct', revenue: 38000, expenses: 22000 },
  { month: 'Nov', revenue: 42000, expenses: 24000 },
  { month: 'Dec', revenue: 35000, expenses: 20000 },
  { month: 'Jan', revenue: 51000, expenses: 28000 },
  { month: 'Feb', revenue: 58000, expenses: 31000 },
  { month: 'Mar', revenue: 62000, expenses: 33000 },
];

export const projectStatusData = [
  { name: 'Active',   value: 3, color: '#6366f1' },
  { name: 'Review',   value: 0, color: '#f59e0b' },
  { name: 'On Hold',  value: 0, color: '#94a3b8' },
];

// Helper: get member by id
export function getMember(id) {
  return teamMembers.find(m => m.id === id);
}
export function getClient(id) {
  return clients.find(c => c.id === id);
}
export function getProject(id) {
  return projects.find(p => p.id === id);
}
