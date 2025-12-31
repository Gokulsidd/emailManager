'use client';

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Mail, FileText, Settings, Plus, Trash2, Pencil, FileCode, CheckIcon } from 'lucide-react';
import ComboBox from './ComboBox';
import TaggedInput from './TaggedInput';
import FolderTree from './FolderTree';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useStore } from '@/store/useStore';
import { fetchClientsList } from '@/services/api.services';

const tabs = [
  { id: 1, name: 'Email Setup', icon: Mail },
  { id: 2, name: 'Rules', icon: FileText },
  { id: 3, name: 'Mail Settings', icon: Settings },
  { id: 4, name: 'Summary', icon: Check },
];

export default function ConfigWizard() {
  const {
    isWizardOpen,
    wizardMode,
    currentStep,
    wizardErrors,
    wizardRules,
    isRuleEditorOpen,
    editingRule,
    ruleErrors,
    isTemplateMappingOpen,
    mappingRule,
    showFolderTree,
    templateMapping,
    wizardFormData,
    emailUsers,
    mailFolders,
    selectedEmailUser,
    setCurrentStep,
    setWizardErrors,
    setWizardRules,
    setIsRuleEditorOpen,
    setEditingRule,
    setRuleErrors,
    setIsTemplateMappingOpen,
    setMappingRule,
    setShowFolderTree,
    setTemplateMapping,
    updateWizardFormField,
    searchEmailUsers,
    searchMailFolders,
    setSelectedEmailUser,
    setMailFolders,
    closeWizard,
    saveWizardConfig,
  } = useStore();

  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Trigger mail folders search when selectedEmailUser changes
  useEffect(() => {
    if (selectedEmailUser) {
      searchMailFolders();
    }
  }, [selectedEmailUser, searchMailFolders]);

  // Mock data for templates and clients
  const templateOptions = ['Template 1', 'Template 2', 'Template 3', 'Custom Template'];
  const clientOptions = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'];

  // Configuration dropdown values
  const fromOptions = ['sender@company.com', 'noreply@company.com', 'support@company.com'];
  const toOptions = ['recipient1@example.com', 'recipient2@example.com', 'team@example.com'];
  const ccOptions = ['manager@company.com', 'admin@company.com', 'supervisor@company.com'];
  const bccOptions = ['archive@company.com', 'compliance@company.com', 'audit@company.com'];
  const subjectOptions = ['Document Upload', 'New Submission', 'Client Document', 'Important Document'];

  // Mock folder structure data
  const mockFolderData = [
    {
      url: null,
      canUpload: false,
      folderName: "FO Restricted",
      templates: [],
      documentTitle: null,
      childFolder: [
        {
          url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=R03. Risk and Compliance",
          canUpload: false,
          folderName: "R03. Risk and Compliance",
          templates: [],
          documentTitle: null,
          childFolder: [
            {
              url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=R03. Risk and Compliance&Filter%5D%5Btemplate_fields.Document_sp_Sub_sp_Type_str%5D%5B0%5D=D22. Driving License",
              canUpload: true,
              folderName: "D22. Driving License",
              templates: [],
              documentTitle: null,
              childFolder: [],
              path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\R03. Risk and Compliance\\D22. Driving License",
              canCreateFolder: "Y"
            },
          ],
          path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\R03. Risk and Compliance",
          canCreateFolder: "N"
        },
      ],
      path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted",
      canCreateFolder: "N"
    },
  ];

  const totalSteps = 4;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!wizardFormData.profileName.trim()) {
      newErrors.profileName = true;
    }
    if (!wizardFormData.userName.trim()) {
      newErrors.userName = true;
    } else if (!isValidEmail(wizardFormData.userName)) {
      newErrors.userName = true;
    }
    if (!wizardFormData.mailFolder.trim()) {
      newErrors.mailFolder = true;
    }

    setWizardErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    return wizardRules.length > 0;
  };

  const checkIfEditing = () => {
    return isRuleEditorOpen || isTemplateMappingOpen;
  };

  const handleNext = () => {
    if (checkIfEditing()) return;

    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < totalSteps) {
      setWizardErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (checkIfEditing()) return;
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTabClick = (stepNumber) => {
    if (checkIfEditing()) return;

    if (stepNumber > 1 && currentStep === 1 && !validateStep1()) return;
    if (stepNumber > 2 && currentStep === 2 && !validateStep2()) return;

    if (stepNumber > 1) {
      fetchClientsList();
    }

    setWizardErrors({});
    setCurrentStep(stepNumber);
  };

  const handleSubmit = async () => {
    if (currentStep === 2 && !validateStep2()) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    const result = await saveWizardConfig();
    
    setIsSaving(false);
    
    if (result.success) {
      setShowSuccessDialog(true);
    } else {
      setSaveError(result.message || 'Failed to save configuration');
    }
  };

  const handleAddRule = () => {
    const newRule = {
      id: Date.now().toString(),
      name: '',
      allEmail: false,
      fromEmail: false,
      fromEmailList: [],
      toEmail: false,
      toEmailList: [],
      ccEmail: false,
      ccEmailList: [],
      subject: false,
      subjectText: '',
    };
    setEditingRule(newRule);
    setIsRuleEditorOpen(true);
  };

  const handleEditRule = (rule) => {
    // Deep copy the rule to ensure all nested properties are copied
    setEditingRule({
      id: rule.id,
      name: rule.name || '',
      allEmail: rule.allEmail || false,
      fromEmail: rule.fromEmail || false,
      fromEmailList: [...(rule.fromEmailList || [])],
      toEmail: rule.toEmail || false,
      toEmailList: [...(rule.toEmailList || [])],
      ccEmail: rule.ccEmail || false,
      ccEmailList: [...(rule.ccEmailList || [])],
      subject: rule.subject || false,
      subjectText: rule.subjectText || '',
      templateMapping: rule.templateMapping ? { ...rule.templateMapping } : undefined,
    });
    setIsRuleEditorOpen(true);
  };

  const handleTemplateMapping = (rule) => {
    setMappingRule(rule);
    setTemplateMapping(rule.templateMapping || {
      template: '',
      clientName: '',
      from: '',
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      selectedFolder: null,
    });
    setShowFolderTree(false);
    setIsTemplateMappingOpen(true);
  };

  const handleSaveTemplateMapping = () => {
    if (!templateMapping.template || !templateMapping.clientName || !templateMapping.selectedFolder) {
      return;
    }

    if (mappingRule) {
      const updatedRules = wizardRules.map(r =>
        r.id === mappingRule.id
          ? { ...r, templateMapping: { ...templateMapping } }
          : r
      );
      setWizardRules(updatedRules);
      setIsTemplateMappingOpen(false);
      setMappingRule(null);
      setTemplateMapping({
        template: '',
        clientName: '',
        from: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        selectedFolder: null,
      });
    }
  };

  const handleCancelTemplateMapping = () => {
    setIsTemplateMappingOpen(false);
    setMappingRule(null);
    setShowFolderTree(false);
    setTemplateMapping({
      template: '',
      clientName: '',
      from: '',
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      selectedFolder: null,
    });
  };

  const handleFolderSelect = (folder) => {
    setTemplateMapping({ ...templateMapping, selectedFolder: folder });
    setShowFolderTree(false);
  };

  const handleDeleteRule = (id) => {
    setWizardRules(wizardRules.filter(r => r.id !== id));
  };

  const validateRule = () => {
    const errors = [];

    if (!editingRule) return errors;

    if (!editingRule.name.trim()) {
      errors.push('Rule name cannot be empty');
    } else {
      const duplicateRule = wizardRules.find(
        r => r.name.toLowerCase() === editingRule.name.toLowerCase() && r.id !== editingRule.id
      );
      if (duplicateRule) {
        errors.push('Rule name already exists');
      }
    }

    const hasAnyFilter = editingRule.allEmail || editingRule.fromEmail ||
      editingRule.toEmail || editingRule.ccEmail || editingRule.subject;
    if (!hasAnyFilter) {
      errors.push('At least one filter must be selected');
    }

    if (editingRule.fromEmail && editingRule.fromEmailList.length === 0) {
      errors.push('From Email: At least one email address is required');
    }

    if (editingRule.toEmail && editingRule.toEmailList.length === 0) {
      errors.push('To Email: At least one email address is required');
    }

    if (editingRule.ccEmail && editingRule.ccEmailList.length === 0) {
      errors.push('CC Email: At least one email address is required');
    }

    if (editingRule.subject && editingRule.subjectText.trim().length < 2) {
      errors.push('Subject: At least 2 characters are required');
    }

    return errors;
  };

  const handleSaveRule = () => {
    const validationErrors = validateRule();

    if (validationErrors.length > 0) {
      setRuleErrors(validationErrors);
      return;
    }

    if (editingRule) {
      const existingIndex = wizardRules.findIndex(r => r.id === editingRule.id);
      if (existingIndex >= 0) {
        setWizardRules(wizardRules.map(r => r.id === editingRule.id ? editingRule : r));
      } else {
        setWizardRules([...wizardRules, editingRule]);
      }
      setIsRuleEditorOpen(false);
      setEditingRule(null);
      setRuleErrors([]);
    }
  };

  const handleCancelRule = () => {
    setIsRuleEditorOpen(false);
    setEditingRule(null);
    setRuleErrors([]);
  };

  const updateEditingRule = (field, value) => {
    if (editingRule) {
      setEditingRule({ ...editingRule, [field]: value });
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    closeWizard();
  };

  if (!isWizardOpen) return null;

  return (
    <>
      <div className="bg-background w-full rounded-xl shadow-lg max-w-lg h-full border-l border-gray-200 overflow-y-auto overflow-x-hidden flex flex-col justify-between transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b shrink-0">
          <h2 className="text-md font-semibold">
            {wizardMode === 'add' ? 'New Email Rule' : 'Edit Email Rule'}
          </h2>
          <button
            onClick={closeWizard}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between px-5 py-2 border-b shrink-0">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="text-sm text-muted-foreground font-medium">
            Step {currentStep} of {totalSteps}
          </div>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} size="sm" className="gap-1.5">
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="sm"
              disabled={isSaving}
              className={`gap-1.5 ${wizardMode === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              <CheckIcon className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b shrink-0">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentStep === tab.id;
              const isCompleted = currentStep > tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium border-b-2 transition-all ${isActive
                    ? 'border-primary text-primary bg-background'
                    : isCompleted
                      ? 'border-green-500 text-green-600 hover:bg-gray-100'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-gray-100'
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span className="leading-tight whitespace-nowrap">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Email Setup */}
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Email Setup</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={wizardFormData.profileName}
                  onChange={(e) => {
                    updateWizardFormField('profileName', e.target.value);
                    if (wizardErrors.profileName) {
                      setWizardErrors({ ...wizardErrors, profileName: false });
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${wizardErrors.profileName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="Enter profile name"
                  autoComplete="off"
                />
                {wizardErrors.profileName && (
                  <p className="text-red-500 text-sm mt-1">Profile Name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className={wizardErrors.userName ? 'ring-2 ring-red-500 rounded-md' : ''}>
                  <ComboBox
                    value={wizardFormData.userName}
                    onChange={(value) => {
                      updateWizardFormField('userName', value);
                      searchEmailUsers(value);
                      if (wizardErrors.userName) {
                        setWizardErrors({ ...wizardErrors, userName: false });
                      }
                    }}
                    onOptionSelect={(value) => {
                      setSelectedEmailUser(value);
                    }}
                    onClear={() => {
                      setSelectedEmailUser(null);
                      setMailFolders([]);
                    }}
                    options={
                      emailUsers
                        ? Array.isArray(emailUsers) && typeof emailUsers[0] === 'string'
                          ? emailUsers
                          : emailUsers.map((user) => user.mail || user)
                        : []
                    }
                    placeholder="Select or type email address"
                  />
                </div>
                {wizardErrors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {!wizardFormData.userName.trim() ? 'Email Address is required' : 'Please enter a valid email address'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mail Folder <span className="text-red-500">*</span>
                </label>
                <div className={wizardErrors.mailFolder ? 'ring-2 ring-red-500 rounded-md' : ''}>
                  <ComboBox
                    value={wizardFormData.mailFolder}
                    onChange={(value) => {
                      updateWizardFormField('mailFolder', value);
                      if (wizardFormData.userName) {
                        searchMailFolders();
                      }
                      if (wizardErrors.mailFolder) {
                        setWizardErrors({ ...wizardErrors, mailFolder: false });
                      }
                    }}
                    options={
                      mailFolders
                        ? Array.isArray(mailFolders) && typeof mailFolders[0] === 'string'
                          ? mailFolders
                          : mailFolders.map((folder) => folder.displayName || folder)
                        : []
                    }
                    placeholder="Select or type folder name"
                  />
                </div>
                {wizardErrors.mailFolder && (
                  <p className="text-red-500 text-sm mt-1">Mail Folder is required</p>
                )}
              </div>
            </div>
          )}

          {/* Template Mapping */}
          {currentStep === 2 && isTemplateMappingOpen && mappingRule && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Template Mapping</h3>
                <span className="text-sm text-muted-foreground">for {mappingRule.name}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="template" className="mb-2 inline-block">
                    Template <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={templateMapping.template}
                    onValueChange={(value) => setTemplateMapping({ ...templateMapping, template: value })}
                  >
                    <SelectTrigger id="template" className="w-full">
                      <SelectValue placeholder="Select Template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateOptions.map((template) => (
                        <SelectItem key={template} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="client" className="mb-2 inline-block">
                    Client Name <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={templateMapping.clientName}
                    onValueChange={(value) => setTemplateMapping({ ...templateMapping, clientName: value })}
                  >
                    <SelectTrigger id="client" className="w-full">
                      <SelectValue placeholder="Select Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientOptions.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="folder" className="mb-2 inline-block">
                    Folder Path <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="folder"
                      type="text"
                      value={templateMapping.selectedFolder?.path || ''}
                      readOnly
                      className="flex-1 bg-muted"
                      placeholder="No folder selected"
                    />
                    <Button
                      onClick={() => setShowFolderTree(!showFolderTree)}
                      variant="outline"
                      size="default"
                    >
                      {showFolderTree ? 'Hide' : 'Select'} Folder
                    </Button>
                  </div>
                </div>

                {showFolderTree && (
                  <div className="border border-input rounded-md p-4 max-h-64 overflow-y-auto bg-muted/30">
                    <FolderTree
                      data={mockFolderData}
                      onFolderSelect={handleFolderSelect}
                    />
                  </div>
                )}

                <div className="pt-4 space-y-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Email Configuration (Optional)</h4>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="from" className="mb-2 inline-block">From</Label>
                      <Select
                        value={templateMapping.from}
                        onValueChange={(value) => setTemplateMapping({ ...templateMapping, from: value })}
                      >
                        <SelectTrigger id="from" className="w-full">
                          <SelectValue placeholder="Select From Address" />
                        </SelectTrigger>
                        <SelectContent>
                          {fromOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="to" className="mb-2 inline-block">To</Label>
                      <Select
                        value={templateMapping.to}
                        onValueChange={(value) => setTemplateMapping({ ...templateMapping, to: value })}
                      >
                        <SelectTrigger id="to" className="w-full">
                          <SelectValue placeholder="Select To Address" />
                        </SelectTrigger>
                        <SelectContent>
                          {toOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="cc" className="mb-2 inline-block">CC</Label>
                      <Select
                        value={templateMapping.cc}
                        onValueChange={(value) => setTemplateMapping({ ...templateMapping, cc: value })}
                      >
                        <SelectTrigger id="cc" className="w-full">
                          <SelectValue placeholder="Select CC Address" />
                        </SelectTrigger>
                        <SelectContent>
                          {ccOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bcc" className="mb-2 inline-block">BCC</Label>
                      <Select
                        value={templateMapping.bcc}
                        onValueChange={(value) => setTemplateMapping({ ...templateMapping, bcc: value })}
                      >
                        <SelectTrigger id="bcc" className="w-full">
                          <SelectValue placeholder="Select BCC Address" />
                        </SelectTrigger>
                        <SelectContent>
                          {bccOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="mb-2 inline-block">Subject</Label>
                      <Select
                        value={templateMapping.subject}
                        onValueChange={(value) => setTemplateMapping({ ...templateMapping, subject: value })}
                      >
                        <SelectTrigger id="subject" className="w-full">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjectOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={handleCancelTemplateMapping} variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplateMapping}
                  disabled={!templateMapping.template || !templateMapping.clientName || !templateMapping.selectedFolder}
                >
                  Save Mapping
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Rules */}
          {currentStep === 2 && !isRuleEditorOpen && !isTemplateMappingOpen && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Processing Rules</h3>
                <Button onClick={handleAddRule} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Rule
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Rule Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Filters</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Template</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wizardRules.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                          No rules added yet. Click &quot;Add Rule&quot; to create one.
                        </td>
                      </tr>
                    ) : (
                      wizardRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{rule.name || 'Unnamed Rule'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {rule.allEmail && 'All Emails'}
                            {rule.fromEmail && ` From: ${rule.fromEmailList.length}`}
                            {rule.toEmail && ` To: ${rule.toEmailList.length}`}
                            {rule.subject && ` Subject: "${rule.subjectText}"`}
                          </td>
                          <td className="px-4 py-3 text-sm">{rule.templateMapping?.template || '-'}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button onClick={() => handleEditRule(rule)} size="icon" variant="ghost">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button onClick={() => handleTemplateMapping(rule)} size="icon" variant="ghost">
                                <FileCode className="w-4 h-4" />
                              </Button>
                              <Button onClick={() => handleDeleteRule(rule.id)} size="icon" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rule Editor */}
          {currentStep === 2 && isRuleEditorOpen && editingRule && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium">
                {wizardRules.find(r => r.id === editingRule.id) ? 'Edit Rule' : 'Add New Rule'}
              </h3>

              {ruleErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {ruleErrors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Rule Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingRule.name}
                  onChange={(e) => {
                    updateEditingRule('name', e.target.value);
                    setRuleErrors([]);
                  }}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter rule name"
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Email Filters</h4>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRule.allEmail}
                    onChange={(e) => {
                      updateEditingRule('allEmail', e.target.checked);
                      setRuleErrors([]);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">All Emails</span>
                </label>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={editingRule.fromEmail}
                      onChange={(e) => {
                        updateEditingRule('fromEmail', e.target.checked);
                        setRuleErrors([]);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">From Email</span>
                  </label>
                  {editingRule.fromEmail && (
                    <TaggedInput
                      tags={editingRule.fromEmailList}
                      onChange={(tags) => {
                        updateEditingRule('fromEmailList', tags);
                        setRuleErrors([]);
                      }}
                      placeholder="Type email and press Enter"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={editingRule.toEmail}
                      onChange={(e) => {
                        updateEditingRule('toEmail', e.target.checked);
                        setRuleErrors([]);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">To Email</span>
                  </label>
                  {editingRule.toEmail && (
                    <TaggedInput
                      tags={editingRule.toEmailList}
                      onChange={(tags) => {
                        updateEditingRule('toEmailList', tags);
                        setRuleErrors([]);
                      }}
                      placeholder="Type email and press Enter"
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={editingRule.subject}
                      onChange={(e) => {
                        updateEditingRule('subject', e.target.checked);
                        setRuleErrors([]);
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Subject</span>
                  </label>
                  {editingRule.subject && (
                    <input
                      type="text"
                      value={editingRule.subjectText}
                      onChange={(e) => {
                        updateEditingRule('subjectText', e.target.value);
                        setRuleErrors([]);
                      }}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter subject text (min 2 characters)"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={handleCancelRule} variant="outline">Cancel</Button>
                <Button onClick={handleSaveRule}>Save Rule</Button>
              </div>
            </div>
          )}

          {/* Step 3: Mail Settings */}
          {currentStep === 3 && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Mail Settings</h3>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Action</h4>

                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mailAction"
                    value="mark_read"
                    checked={wizardFormData.mailAction === 'mark_read'}
                    onChange={(e) => updateWizardFormField('mailAction', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-medium">Mark as Read</span>
                    <p className="text-xs text-gray-500">Mark processed emails as read</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mailAction"
                    value="move_to_archive"
                    checked={wizardFormData.mailAction === 'move_to_archive'}
                    onChange={(e) => updateWizardFormField('mailAction', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-medium">Move to Archive</span>
                    <p className="text-xs text-gray-500">Move processed emails to archive folder</p>
                  </div>
                </label>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <h4 className="text-sm font-medium">Additional Options</h4>

                <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={wizardFormData.saveConversation}
                    onChange={(e) => updateWizardFormField('saveConversation', e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">Save Conversation</span>
                    <p className="text-xs text-gray-500">Save the entire email conversation thread</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={wizardFormData.saveAttachmentSeparate}
                    onChange={(e) => updateWizardFormField('saveAttachmentSeparate', e.target.checked)}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-medium">Save Attachment as Separate File</span>
                    <p className="text-xs text-gray-500">Save email attachments as separate files</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Summary</h3>

              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-red-800 mb-1">Error</h4>
                  <p className="text-sm text-red-700">{saveError}</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Email Setup</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Profile Name:</span>
                      <span className="font-medium">{wizardFormData.profileName || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Email Address:</span>
                      <span className="font-medium">{wizardFormData.userName || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Mail Folder:</span>
                      <span className="font-medium">{wizardFormData.mailFolder || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Rules</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Total Rules:</span>
                      <span className="font-medium">{wizardRules.length} rule(s) configured</span>
                    </div>
                    {wizardRules.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {wizardRules.map((rule, index) => (
                          <div key={rule.id} className="bg-white rounded p-2 border border-green-200">
                            <div className="font-medium text-gray-900">{index + 1}. {rule.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              {rule.templateMapping?.template && `Template: ${rule.templateMapping.template}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3">Mail Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Email Action:</span>
                      <span className="font-medium">{wizardFormData.mailAction === 'mark_read' ? 'Mark as Read' : 'Move to Archive'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Save Conversation:</span>
                      <span className="font-medium">{wizardFormData.saveConversation ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Save Attachment Separate:</span>
                      <span className="font-medium">{wizardFormData.saveAttachmentSeparate ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              Success
            </DialogTitle>
            <DialogDescription>
              Email rule configuration has been {wizardMode === 'add' ? 'created' : 'updated'} successfully!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCloseSuccessDialog}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}