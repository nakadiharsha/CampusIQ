import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PipelineBanner } from '../components/common/PipelineBanner';
import {
  FileText,
  CheckCircle2,
  Edit3,
  Send,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const WorkflowBuilderPage: React.FC = () => {
  const {
    selectedWorkflowId,
    workflows,
    user,
    generateDraft,
    activeWorkflowDraft,
    setActivePage
  } = useApp();

  const currentWf = workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

  const [purpose, setPurpose] = useState('Passport Application and Administrative Verification');
  const [department, setDepartment] = useState(currentWf.targetDepartment || 'Student Services Department');
  const [additionalInfo, setAdditionalInfo] = useState('Requires official seal endorsement for Regional Passport Office (RPO) submission.');
  
  const [currentStep, setCurrentStep] = useState<number>(activeWorkflowDraft ? 3 : 2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editedBody, setEditedBody] = useState('');

  const steps = [
    { num: 1, label: 'Understand', desc: 'Policy Verification' },
    { num: 2, label: 'Prepare', desc: 'Form Input' },
    { num: 3, label: 'Review', desc: 'Draft Generated' },
    { num: 4, label: 'Approve', desc: 'Human Oversight' },
    { num: 5, label: 'Submit', desc: 'SLA Execution' }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(async () => {
      const draft = await generateDraft(purpose, department, additionalInfo);
      setEditedBody(draft.generatedBody);
      setIsGenerating(false);
      setCurrentStep(3);
    }, 600);
  };

  const handleSendForApproval = () => {
    setActivePage('approvals');
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Banner */}
      <PipelineBanner currentStage="PREPARE" compact />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1F3A5F]">{currentWf.title} Request</h1>
            <span className="text-xs bg-[#EBF5F3] text-[#2F7D6D] px-2 py-0.5 rounded border border-[#BCE1D9] font-medium">
              Context Pre-filled
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-0.5">
            CampusIQ prepares official institutional documents grounded in Section 4.2 of the Student Services Procedure.
          </p>
        </div>
      </div>

      {/* Interactive Step Indicator */}
      <div className="bg-white border border-[#D9DEE5] rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((step) => {
            const isActive = currentStep === step.num;
            const isCompleted = currentStep > step.num;

            return (
              <div
                key={step.num}
                className={`p-3 rounded border text-xs transition-colors ${
                  isActive
                    ? 'bg-[#1F3A5F] text-white border-[#1F3A5F]'
                    : isCompleted
                    ? 'bg-[#EBF5F3] text-[#2F7D6D] border-[#BCE1D9]'
                    : 'bg-[#F7F8FA] text-[#667085] border-[#D9DEE5]'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>
                    {step.num}. {step.label}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#2F7D6D]" />}
                </div>
                <span className={`text-[10px] block ${isActive ? 'text-[#E2E8F0]' : 'text-[#667085]'}`}>
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Inputs (1/3) */}
        <div className="bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] border-b border-[#D9DEE5] pb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#315A7D]" />
            Form Parameters & Context
          </h3>

          {/* Student Credentials Summary */}
          <div className="bg-[#F7F8FA] border border-[#D9DEE5] rounded p-3 text-xs space-y-1">
            <span className="font-bold text-[#1F3A5F] block mb-1">Verified Student Credentials</span>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">Name:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">USN:</span>
              <span className="font-mono font-semibold">{user.usn}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-[#667085]">Program:</span>
              <span className="font-semibold text-right max-w-[130px] truncate">{user.program}</span>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleGenerate} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Purpose of Request *</label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Passport Application / Bank Loan"
                className="w-full p-2.5 border border-[#D9DEE5] rounded bg-white text-xs text-[#17202A] focus:outline-none focus:border-[#1F3A5F]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Target Department *</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 border border-[#D9DEE5] rounded bg-white text-xs text-[#17202A] focus:outline-none focus:border-[#1F3A5F]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1F3A5F] mb-1">Additional Notes / Remarks</label>
              <textarea
                rows={3}
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-2.5 border border-[#D9DEE5] rounded bg-white text-xs text-[#17202A] focus:outline-none focus:border-[#1F3A5F]"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#1F3A5F] text-white font-bold text-xs rounded hover:bg-[#172D4A] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isGenerating ? (
                <span>CampusIQ Reasoning & Draft Generation...</span>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-[#2F7D6D]" />
                  <span>Generate Application</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Generated Application Output (2/3) */}
        <div className="lg:col-span-2 bg-white border border-[#D9DEE5] rounded-lg p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-[#D9DEE5] pb-2 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F3A5F] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2F7D6D]" />
                Generated Application Draft
              </h3>
              <span className="text-[11px] font-mono text-[#2F7D6D] bg-[#EBF5F3] px-2 py-0.5 rounded border border-[#BCE1D9]">
                Grounded: Student Services Procedure (p. 18)
              </span>
            </div>

            {/* Mandatory Human Approval Warning Banner */}
            <div className="bg-[#FEFCBF] border border-[#F6E05E] p-3 rounded text-xs text-[#B7791F] flex items-start gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">HUMAN APPROVAL REQUIRED BEFORE SUBMISSION</span>
                CampusIQ does NOT automatically submit applications. Review the draft below, edit if necessary, then click "Send for Approval".
              </div>
            </div>

            {/* Application Document View */}
            {activeWorkflowDraft || editedBody ? (
              <div className="border border-[#D9DEE5] rounded p-5 bg-[#F7F8FA] space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#1F3A5F] border-b border-[#D9DEE5] pb-2">
                  <span>To: {department}</span>
                  <span className="text-[11px] text-[#667085] font-mono">Date: Today</span>
                </div>

                <div className="text-xs font-bold text-[#17202A]">
                  Subject: Request for Bonafide Certificate — {user.name} ({user.usn})
                </div>

                {isEditable ? (
                  <textarea
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                    rows={12}
                    className="w-full text-xs p-3 font-mono border border-[#1F3A5F] rounded bg-white text-[#17202A]"
                  />
                ) : (
                  <div className="text-xs font-mono text-[#17202A] whitespace-pre-wrap leading-relaxed bg-white p-4 rounded border border-[#D9DEE5]">
                    {editedBody || activeWorkflowDraft?.generatedBody}
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-[#D9DEE5] rounded-lg p-12 text-center bg-[#F7F8FA] text-[#667085]">
                <FileText className="w-8 h-8 text-[#315A7D] mx-auto mb-2" />
                <span className="font-bold text-xs text-[#1F3A5F] block">No Draft Generated Yet</span>
                <p className="text-[11px] mt-1">Fill out the parameters on the left and click "Generate Application".</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(activeWorkflowDraft || editedBody) && (
            <div className="pt-4 border-t border-[#D9DEE5] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditable(!isEditable)}
                className="px-3.5 py-2 text-xs font-semibold text-[#1F3A5F] bg-[#F7F8FA] border border-[#D9DEE5] rounded hover:bg-[#D9DEE5]/40 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#315A7D]" />
                {isEditable ? 'Save Edits' : 'Edit Draft'}
              </button>

              <button
                type="button"
                onClick={handleSendForApproval}
                className="px-5 py-2.5 bg-[#2F7D6D] text-white text-xs font-bold rounded hover:bg-[#266457] flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send for Approval →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
