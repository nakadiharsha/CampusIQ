import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useApp } from '../../context/AppContext';
import { DocumentDetailDrawer } from '../common/DocumentDetailDrawer';
import { ApprovalDetailModal } from '../common/ApprovalDetailModal';
import { AddDocumentModal } from '../common/AddDocumentModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    selectedDocument,
    setSelectedDocument,
    selectedApproval,
    setSelectedApproval,
    approveAction,
    rejectAction,
    isAddDocOpen,
    setIsAddDocOpen,
    addDocument
  } = useApp();

  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden text-[#17202A]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar />

        {/* Scrollable Page View container */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <DocumentDetailDrawer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      <ApprovalDetailModal
        item={selectedApproval}
        onClose={() => setSelectedApproval(null)}
        onApprove={approveAction}
        onReject={rejectAction}
      />

      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        onAdd={addDocument}
      />
    </div>
  );
};
