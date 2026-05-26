import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DescriptionIcon from "@mui/icons-material/Description";
import ComputerIcon from '@mui/icons-material/Computer';
import DateRangeIcon from "@mui/icons-material/DateRange";
import CampaignIcon from "@mui/icons-material/Campaign";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ChatIcon from '@mui/icons-material/Chat';
import CloudIcon from '@mui/icons-material/SupervisorAccount';
import GridViewIcon from '@mui/icons-material/GridView';
import ArticleIcon from '@mui/icons-material/Article';
import ReviewsIcon from '@mui/icons-material/Reviews';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { Settings } from "@mui/icons-material";
import PaymentsIcon from '@mui/icons-material/Payments';
import DvrIcon from '@mui/icons-material/Dvr';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';

const SidebarDataSA = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/jobs/",
    icon: <DashboardOutlinedIcon />,
    heading: "Steel Jobs",
  },
  {
    url: "/admin/dashboard/jobs/awarded",
    icon: <MilitaryTechIcon />,
    heading: "Steel Awarded Jobs",
  },
  {
    url: "/admin/dashboard/jobs/estimated",
    icon: <MilitaryTechIcon />,
    heading: "Steel Estimated Jobs",
  },
  {
    url: "/admin/dashboard/jobs/dashboard",
    icon: <DashboardCustomizeIcon />,
    heading: "Steel Project Dashboard",
  },
  {
    url: "/admin/dashboard/rebar/",
    icon: <DashboardOutlinedIcon />,
    heading: "Rebar Jobs",
  },
  {
    url: "/admin/dashboard/rebar/awarded",
    icon: <MilitaryTechIcon />,
    heading: "Rebar Awarded Jobs",
  },
  {
    url: "/admin/dashboard/rebar/estimated",
    icon: <MilitaryTechIcon />,
    heading: " Rebar Estimated Jobs",
  },
  {
    url: "/admin/dashboard/rebar/dashboard",
    icon: <DashboardCustomizeIcon />,
    heading: "Rebar Project Dashboard",
  },
  {
    url: "/admin/dashboard/jobs/sales/performance",
    icon: <TrendingUpIcon />,
    heading: "Job Admins",
  },
  {
    url: "/admin/dashboard/jobs/dashboard/completed",
    icon: <DashboardCustomizeIcon />,
    heading: "Completed Projects",
  },
  {
    url: "/admin/dashboard/projects/",
    icon: <AccountTreeTwoToneIcon />,
    heading: "Projects",
  },
  {
    url: "/admin/dashboard/tasks/",
    icon: <AssignmentIndOutlinedIcon />,
    heading: "Works",
  },
  {
    url: "/admin/dashboard/review-requests",
    icon: <BeenhereOutlinedIcon />,
    heading: "Review Requests",
  },
  {
    url: "/admin/dashboard/reports",
    icon: <DescriptionIcon />,
    heading: "Reports",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  {
    url: "/admin/dashboard/leaves",
    icon: <ContactPhoneOutlinedIcon />,
    heading: "Leaves",
  },
  {
    url: "/admin/dashboard/cloud-admin",
    icon: <CloudIcon />,
    heading: "Cloud Admin",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  // {
  //   url: "/admin/dashboard/company-documents",
  //   icon: <ArticleIcon />,
  //   heading: "Company Documents",
  // },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/emps",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  },
  {
    url: "/admin/dashboard/work-status",
    icon: <DvrIcon />,
    heading: "Work Status",
  }
];

const SidebarDataSTL = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/jobs/",
    icon: <DashboardOutlinedIcon />,
    heading: " Jobs",
  },
  {
    url: "/admin/dashboard/jobs/awarded",
    icon: <MilitaryTechIcon />,
    heading: " Awarded Jobs",
  },
  {
    url: "/admin/dashboard/jobs/submissions",
    icon: <PaymentsIcon />,
    heading: "Submissions",
  },
  {
    url: "/admin/dashboard/jobs/estimated",
    icon: <MilitaryTechIcon />,
    heading: " Estimated Jobs",
  },
  {
    url: "/admin/dashboard/jobs/dashboard",
    icon: <DashboardCustomizeIcon />,
    heading: " Project Dashboard",
  },
  {
    url: "/admin/dashboard/jobs/sales/performance",
    icon: <TrendingUpIcon />,
    heading: "Job Admins",
  },
  {
    url: "/admin/dashboard/jobs/dashboard/completed",
    icon: <DashboardCustomizeIcon />,
    heading: "Completed Projects",
  },
  {
    url: "/admin/dashboard/projects/",
    icon: <AccountTreeTwoToneIcon />,
    heading: "Projects",
  },
  {
    url: "/admin/dashboard/review-requests",
    icon: <BeenhereOutlinedIcon />,
    heading: "Review Requests",
  },
  {
    url: "/admin/dashboard/employee/notices/",
    icon: <CampaignIcon />,
    heading: "Notices",
  },
  {
    url: "/admin/dashboard/reports",
    icon: <DescriptionIcon />,
    heading: "Reports",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  {
    url: "/admin/dashboard/leaves",
    icon: <ContactPhoneOutlinedIcon />,
    heading: "Leaves",
  },
  {
    url: "/admin/dashboard/cloud-admin",
    icon: <CloudIcon />,
    heading: "Cloud Admin",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  // {
  //   url: "/admin/dashboard/company-documents",
  //   icon: <ArticleIcon />,
  //   heading: "Company Documents",
  // },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/config/",
    icon: <Settings />,
    heading: "Config",
  },
  {
    url: "/admin/dashboard/emps",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  }
];

const SidebarDataRB = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/rebar/",
    icon: <DashboardOutlinedIcon />,
    heading: "All Jobs",
  },
  {
    url: "/admin/dashboard/rebar/awarded",
    icon: <MilitaryTechIcon />,
    heading: "Awarded Jobs",
  },
  {
    url: "/admin/dashboard/rebar/estimated",
    icon: <MilitaryTechIcon />,
    heading: "Estimated Jobs",
  },
  {
    url: "/admin/dashboard/rebar/dashboard",
    icon: <DashboardCustomizeIcon />,
    heading: "Project Dashboard",
  },
  {
    url: "/admin/dashboard/rebar/sales/performance",
    icon: <TrendingUpIcon />,
    heading: "Job Admins",
  },
  {
    url: "/admin/dashboard/rebar/dashboard/completed",
    icon: <DashboardCustomizeIcon />,
    heading: "Completed Projects",
  },
  {
    url: "/admin/dashboard/projects/",
    icon: <AccountTreeTwoToneIcon />,
    heading: "Projects",
  },
  {
    url: "/admin/dashboard/rebar/general-task",
    icon: <AccountTreeTwoToneIcon />,
    heading: "General Task",
  },
  {
    url: "/admin/dashboard/review-requests",
    icon: <BeenhereOutlinedIcon />,
    heading: "Review Requests",
  },
  {
    url: "/admin/dashboard/employee/notices/",
    icon: <CampaignIcon />,
    heading: "Notices",
  },
  {
    url: "/admin/dashboard/reports",
    icon: <DescriptionIcon />,
    heading: "Reports",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  {
    url: "/admin/dashboard/leaves",
    icon: <ContactPhoneOutlinedIcon />,
    heading: "Leaves",
  },
  {
    url: "/admin/dashboard/cloud-admin",
    icon: <CloudIcon />,
    heading: "Cloud Admin",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  // {
  //   url: "/admin/dashboard/company-documents",
  //   icon: <ArticleIcon />,
  //   heading: "Company Documents",
  // },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/emps",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  }
];

const SidebarDataHR = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/hr/",
    icon: <DynamicFormIcon />,
    heading: "Activation Requests",
  },
  {
    url: "/admin/dashboard/hr/employees/",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  },
  {
    url: "/admin/dashboard/work-status",
    icon: <DvrIcon />,
    heading: "Work Status",
  },
  {
    url: "/admin/dashboard/hr/leaves/",
    icon: <ContactPhoneOutlinedIcon />,
    heading: "Leaves",
  },
  {
    url: "/admin/dashboard/reports",
    icon: <DescriptionIcon />,
    heading: "Reports",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  {
    url: "/admin/dashboard/review-requests",
    icon: <BeenhereOutlinedIcon />,
    heading: "Review Requests",
  },
  {
    url: "/admin/dashboard/employee/notices/",
    icon: <CampaignIcon />,
    heading: "Notices",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/employee/logs/punch-ins",
    icon: <HomeOutlinedIcon />,
    heading: "Punch Ins",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  // {
  //   url: "/admin/dashboard/company-documents",
  //   icon: <ArticleIcon />,
  //   heading: "Company Documents",
  // },
  {
    url: "/admin/dashboard/lms/hr",
    icon: <SchoolIcon />,
    heading: "Lms",
  },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
];

const SidebarDataEMP = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/tasks/",
    icon: <AssignmentIndOutlinedIcon />,
    heading: "My Tasks",
  },
  {
    url: "/admin/dashboard/projects/",
    icon: <AccountTreeTwoToneIcon />,
    heading: "Projects",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  {
    url: "/admin/dashboard/employee/timesheet/",
    icon: <DateRangeIcon />,
    heading: "Time Sheet",
  },
  {
    url: "/admin/dashboard/employee/performance/",
    icon: <MilitaryTechIcon />,
    heading: "Performance",
  },
  {
    url: "/admin/dashboard/employee/logs/punch-ins",
    icon: <HomeOutlinedIcon />,
    heading: "Punch Ins",
  },
  {
    url: "/admin/dashboard/employee/notices/",
    icon: <CampaignIcon />,
    heading: "Notices",
  },
  {
    url: "/admin/dashboard/review-requests",
    icon: <BeenhereOutlinedIcon />,
    heading: "Review Requests",
  },
  {
    url: "/admin/dashboard/performance-review",
    icon: <ReviewsIcon />,
    heading: "Performance Review",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  // {
  //   url: "/admin/dashboard/company-documents",
  //   icon: <ArticleIcon />,
  //   heading: "Company Documents",
  // },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/leaves",
    icon: <ContactPhoneOutlinedIcon />,
    heading: "Leaves",
  },
  {
    url: "/admin/dashboard/lms",
    icon: <SchoolIcon />,
    heading: "Lms",
  },
  {
    url: "/admin/dashboard/emps",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  }
];

const SidebarDataPA = [
  {
    url: "/admin/dashboard",
    icon: <HomeOutlinedIcon />,
    heading: "Home",
  },
  {
    url: "/admin/dashboard/admin/projects/",
    icon: <AccountTreeTwoToneIcon />,
    heading: "Projects",
  },
  {
    url: "/admin/dashboard/cloud",
    icon: <ComputerIcon />,
    heading: "Cloud",
  },
  // {
  //   url: "/admin/dashboard/chat",
  //   icon: <ChatIcon/>,
  //   heading: "Chat",
  // },
  {
    url: "/admin/dashboard/todo",
    icon: <ListAltIcon />,
    heading: "To Do",
  },
  {
    url: "/admin/dashboard/activity/",
    icon: <GridViewIcon />,
    heading: "Engage",
  },
  {
    url: "/admin/dashboard/emps",
    icon: <BadgeOutlinedIcon />,
    heading: "Employees",
  }
];

module.exports = { SidebarDataSA, SidebarDataHR, SidebarDataEMP, SidebarDataPA, SidebarDataRB, SidebarDataSTL };
