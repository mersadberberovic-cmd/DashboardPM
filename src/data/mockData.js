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
  { id: 'c1', name: 'NovaTech Inc.',      logo: 'NT', color: '#6366f1' },
  { id: 'c2', name: 'GreenLeaf Co.',      logo: 'GL', color: '#10b981' },
  { id: 'c3', name: 'Stellar Brands',     logo: 'SB', color: '#f59e0b' },
  { id: 'c4', name: 'Apex Financial',     logo: 'AF', color: '#ef4444' },
  { id: 'c5', name: 'CityScape Hotels',   logo: 'CH', color: '#3b82f6' },
];

export const projects = [
  {
    id: 'p1',
    name: 'NovaTech Website Redesign',
    client: 'c1',
    status: 'active',
    priority: 'high',
    progress: 68,
    budget: 45000,
    spent: 30600,
    startDate: '2026-02-01',
    dueDate: '2026-04-15',
    team: ['u1', 'u3', 'u4'],
    description: 'Complete overhaul of the NovaTech corporate website with new brand identity and improved UX.',
    tags: ['Design', 'Development', 'Branding'],
    tasksTotal: 24,
    tasksCompleted: 16,
  },
  {
    id: 'p2',
    name: 'GreenLeaf Social Campaign',
    client: 'c2',
    status: 'active',
    priority: 'medium',
    progress: 45,
    budget: 18000,
    spent: 8100,
    startDate: '2026-02-15',
    dueDate: '2026-05-01',
    team: ['u2', 'u6', 'u7'],
    description: 'Multi-platform social media campaign focused on sustainability messaging and community engagement.',
    tags: ['Social Media', 'Content', 'SEO'],
    tasksTotal: 18,
    tasksCompleted: 8,
  },
  {
    id: 'p3',
    name: 'Stellar Brands App MVP',
    client: 'c3',
    status: 'active',
    priority: 'high',
    progress: 32,
    budget: 72000,
    spent: 23040,
    startDate: '2026-03-01',
    dueDate: '2026-06-30',
    team: ['u2', 'u4', 'u5'],
    description: 'Mobile-first app MVP for Stellar Brands loyalty program — React Native + Node.js backend.',
    tags: ['Mobile', 'Development', 'API'],
    tasksTotal: 38,
    tasksCompleted: 12,
  },
  {
    id: 'p4',
    name: 'Apex Financial Brand Refresh',
    client: 'c4',
    status: 'review',
    priority: 'low',
    progress: 90,
    budget: 22000,
    spent: 19800,
    startDate: '2026-01-10',
    dueDate: '2026-03-31',
    team: ['u3', 'u6'],
    description: 'Updated visual identity, brand guidelines, and marketing collateral for Apex Financial.',
    tags: ['Branding', 'Design'],
    tasksTotal: 14,
    tasksCompleted: 13,
  },
  {
    id: 'p5',
    name: 'CityScape Hotels SEO & Content',
    client: 'c5',
    status: 'on-hold',
    priority: 'medium',
    progress: 20,
    budget: 15000,
    spent: 3000,
    startDate: '2026-03-10',
    dueDate: '2026-07-15',
    team: ['u7', 'u8'],
    description: 'Ongoing SEO optimisation and content production for CityScape Hotels portfolio of properties.',
    tags: ['SEO', 'Content'],
    tasksTotal: 22,
    tasksCompleted: 4,
  },
];

export const tasks = [
  // NovaTech (p1)
  { id: 't1',  projectId: 'p1', title: 'Finalise homepage wireframes',        status: 'done',        priority: 'high',   assignee: 'u3', dueDate: '2026-03-10', tags: ['Design'] },
  { id: 't2',  projectId: 'p1', title: 'Client feedback review – Round 2',    status: 'done',        priority: 'high',   assignee: 'u1', dueDate: '2026-03-15', tags: ['Review'] },
  { id: 't3',  projectId: 'p1', title: 'Build header & navigation components', status: 'in-progress', priority: 'high',   assignee: 'u4', dueDate: '2026-03-28', tags: ['Dev'] },
  { id: 't4',  projectId: 'p1', title: 'Hero section animations',              status: 'in-progress', priority: 'medium', assignee: 'u4', dueDate: '2026-04-02', tags: ['Dev', 'Design'] },
  { id: 't5',  projectId: 'p1', title: 'Write product page copy',              status: 'todo',        priority: 'medium', assignee: 'u6', dueDate: '2026-04-05', tags: ['Content'] },
  { id: 't6',  projectId: 'p1', title: 'QA testing – mobile breakpoints',      status: 'todo',        priority: 'low',    assignee: 'u4', dueDate: '2026-04-10', tags: ['QA'] },
  // GreenLeaf (p2)
  { id: 't7',  projectId: 'p2', title: 'Content calendar – Q2',               status: 'done',        priority: 'high',   assignee: 'u6', dueDate: '2026-03-05', tags: ['Content'] },
  { id: 't8',  projectId: 'p2', title: 'Instagram campaign assets',            status: 'in-progress', priority: 'medium', assignee: 'u3', dueDate: '2026-03-30', tags: ['Design'] },
  { id: 't9',  projectId: 'p2', title: 'Keyword research & on-page SEO',       status: 'todo',        priority: 'medium', assignee: 'u7', dueDate: '2026-04-08', tags: ['SEO'] },
  { id: 't10', projectId: 'p2', title: 'Launch paid ad campaign',              status: 'todo',        priority: 'high',   assignee: 'u2', dueDate: '2026-04-15', tags: ['Marketing'] },
  // Stellar (p3)
  { id: 't11', projectId: 'p3', title: 'API architecture design',              status: 'done',        priority: 'high',   assignee: 'u5', dueDate: '2026-03-12', tags: ['Dev'] },
  { id: 't12', projectId: 'p3', title: 'Auth & user profiles – backend',       status: 'in-progress', priority: 'high',   assignee: 'u5', dueDate: '2026-03-29', tags: ['Dev'] },
  { id: 't13', projectId: 'p3', title: 'Onboarding screen designs',            status: 'in-progress', priority: 'medium', assignee: 'u3', dueDate: '2026-04-01', tags: ['Design'] },
  { id: 't14', projectId: 'p3', title: 'Push notification integration',        status: 'todo',        priority: 'medium', assignee: 'u4', dueDate: '2026-04-20', tags: ['Dev'] },
  // Apex (p4)
  { id: 't15', projectId: 'p4', title: 'Brand guidelines document',            status: 'done',        priority: 'high',   assignee: 'u3', dueDate: '2026-03-20', tags: ['Branding'] },
  { id: 't16', projectId: 'p4', title: 'Final client sign-off',                status: 'in-progress', priority: 'high',   assignee: 'u1', dueDate: '2026-03-28', tags: ['Review'] },
  // CityScape (p5)
  { id: 't17', projectId: 'p5', title: 'SEO audit – all properties',           status: 'done',        priority: 'medium', assignee: 'u7', dueDate: '2026-03-22', tags: ['SEO'] },
  { id: 't18', projectId: 'p5', title: 'Blog content plan',                    status: 'todo',        priority: 'low',    assignee: 'u6', dueDate: '2026-04-30', tags: ['Content'] },
];

export const activity = [
  { id: 'a1', type: 'task_complete',  user: 'u3', text: 'completed "Brand guidelines document"',        project: 'p4', time: '10m ago' },
  { id: 'a2', type: 'comment',        user: 'u1', text: 'left a comment on "Final client sign-off"',    project: 'p4', time: '32m ago' },
  { id: 'a3', type: 'task_start',     user: 'u4', text: 'started "Hero section animations"',            project: 'p1', time: '1h ago' },
  { id: 'a4', type: 'file_upload',    user: 'u3', text: 'uploaded design assets to NovaTech Redesign', project: 'p1', time: '2h ago' },
  { id: 'a5', type: 'task_complete',  user: 'u5', text: 'completed "API architecture design"',          project: 'p3', time: '3h ago' },
  { id: 'a6', type: 'task_start',     user: 'u5', text: 'started "Auth & user profiles – backend"',     project: 'p3', time: '4h ago' },
  { id: 'a7', type: 'task_complete',  user: 'u6', text: 'completed "Content calendar – Q2"',            project: 'p2', time: '1d ago' },
  { id: 'a8', type: 'project_update', user: 'u2', text: 'updated milestone for Stellar Brands App MVP', project: 'p3', time: '1d ago' },
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
  { name: 'Review',   value: 1, color: '#f59e0b' },
  { name: 'On Hold',  value: 1, color: '#94a3b8' },
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
