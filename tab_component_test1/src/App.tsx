import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabsContainer from './components/Tabs/TabsContainer';
import type { TabModel } from './components/Tabs/types';

const initialTabs: TabModel[] = [
  { id: 'tab1', title: 'Dashboard', url: '/dashboard',    pinned: false },
  { id: 'tab2', title: 'Banking',   url: '/banking',      pinned: false },
  { id: 'tab3', title: 'Telefonie', url: '/telefonie',    pinned: false },
  { id: 'tab4', title: 'Accounting',url: '/accounting',   pinned: false },
  { id: 'tab5', title: 'Verkauf',   url: '/verkauf',      pinned: false },
  { id: 'tab6', title: 'Statistik', url: '/statistik',    pinned: false },
  { id: 'tab7', title: 'Post Office',url: '/post_office', pinned: false },
  { id: 'tab8', title: 'Administration', url: '/administration', pinned: false },
  { id: 'tab9', title: 'Help',      url: '/help',         pinned: false },
];

function App() {
  return (
    <div className="p-4">
      <TabsContainer initialTabs={initialTabs} />
      <div className="mt-6 p-4 border rounded">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"     element={<div>Dashboard Content</div>} />
          <Route path="/banking"       element={<div>Banking Content</div>} />
          <Route path="/telefonie"     element={<div>Telefonie Content</div>} />
          <Route path="/accounting"    element={<div>Accounting Content</div>} />
          <Route path="/verkauf"       element={<div>Verkauf Content</div>} />
          <Route path="/statistik"     element={<div>Statistik Content</div>} />
          <Route path="/post_office"   element={<div>Post Office Content</div>} />
          <Route path="/administration"element={<div>Administration Content</div>} />
          <Route path="/help"          element={<div>Help Content</div>} />
          <Route path="*"              element={<div>404 Not Found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
