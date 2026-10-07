import React, { useEffect, useState } from 'react';
import Dashboard from '../../../src/Components/Dashboard/dashboard';
import HRDashboard from '../../../src/Components/Hr/Dashboard/Dashboard'
import { ParentStore } from '../../_app';
import { useContext } from 'react';
import Finance from '../../../src/Components/Finance/Finance';
import EmpAnalytics from '../../../src/Components/EmpAnalytics/EmpAnalytics'
import SalesDashboard from '../../../src/Components/SalesDashboard/SalesDashboard';
import RebarDashboard from "../../../src/Components/RebarDashboard/RebarDashboard"
import SteelDashboard from '../../../src/Components/Steel Dashboard';
import AssignedByMeTasks from '../../../src/Components/Dashboard/AssignedByMeTasks';

function DashBoard() {
  const context = useContext(ParentStore);
  let role = context?.ParentState?.auth?.role;

  const roleComponent = {
    SA: <Finance />,
    STL: <SteelDashboard />,
    HR: <HRDashboard />,
    EMP: <EmpAnalytics />,
    PA: <SalesDashboard />,
    RB: <RebarDashboard />
  }

  return (
    <>
      {roleComponent[role]}
      {role && role !== 'EMP' && <AssignedByMeTasks />}
    </>
  );

}

export default DashBoard;



