'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Mail, FileText, Settings, Plus, Trash2, Pencil, FileCode, CheckIcon } from 'lucide-react';
import { EmailConfig, Rule, TemplateMapping, FolderNode } from '@/types/config';
import ComboBox from './ComboBox';
import TaggedInput from './TaggedInput';
import FolderTree from './FolderTree';
import { Button } from './ui/button';
import { useStore } from '@/store/useStore';
import { fetchClientsList } from '@/services/api.services';

interface ConfigWizardProps {
  isOpen: boolean;
  onClose: () => void;
  config?: EmailConfig;
  mode: 'add' | 'edit';
  onSave?: (data: any) => void;
}

const tabs = [
  { id: 1, name: 'Email Setup', icon: Mail },
  { id: 2, name: 'Rules', icon: FileText },
  { id: 3, name: 'Mail Settings', icon: Settings },
  { id: 4, name: 'Summary', icon: Check },
];

export default function ConfigWizard({ isOpen, onClose, config, mode, onSave }: ConfigWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [rules, setRules] = useState<Rule[]>(config?.rules || []);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [ruleErrors, setRuleErrors] = useState<string[]>([]);
  const [isTemplateMappingOpen, setIsTemplateMappingOpen] = useState(false);
  const [mappingRule, setMappingRule] = useState<Rule | null>(null);
  const [showFolderTree, setShowFolderTree] = useState(false);
  const [templateMapping, setTemplateMapping] = useState<TemplateMapping>({
    template: '',
    clientName: '',
    from: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
  });

  const { emailUsers, mailFolders, selectedEmailUser, searchEmailUsers, searchMailFolders, setSelectedEmailUser, setMailFolders } = useStore();

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

  // Mock folder structure data - this would typically come from an API
  const mockFolderData: FolderNode[] = [
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
            {
              url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=R03. Risk and Compliance&Filter%5D%5Btemplate_fields.Document_sp_Sub_sp_Type_str%5D%5B0%5D=P11. Proof of Address",
              canUpload: true,
              folderName: "P11. Proof of Address",
              templates: [],
              documentTitle: null,
              childFolder: [],
              path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\R03. Risk and Compliance\\P11. Proof of Address",
              canCreateFolder: "Y"
            }
          ],
          path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\R03. Risk and Compliance",
          canCreateFolder: "N"
        },
        {
          url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=C05. Constitutional and Supplemental Documents",
          canUpload: false,
          folderName: "C05. Constitutional and Supplemental Documents",
          templates: [],
          documentTitle: null,
          childFolder: [
            {
              url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=C05. Constitutional and Supplemental Documents&Filter%5D%5Btemplate_fields.Document_sp_Sub_sp_Type_str%5D%5B0%5D=F37. Foreign",
              canUpload: true,
              folderName: "F37. Foreign",
              templates: [],
              documentTitle: null,
              childFolder: [
                {
                  url: "&Filter%5D%5Btemplate_fields.Document_sp_Type_str%5D%5B0%5D=C05. Constitutional and Supplemental Documents&Filter%5D%5Btemplate_fields.Document_sp_Sub_sp_Type_str%5D%5B0%5D=F37. Foreign",
                  canUpload: true,
                  folderName: "F01. Foreign Documents",
                  templates: [],
                  documentTitle: null,
                  childFolder: [],
                  path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\C05. Constitutional and Supplemental Documents\\F37. Foreign\\F01. Foreign Documents",
                  canCreateFolder: "Y"
                }
              ],
              path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\C05. Constitutional and Supplemental Documents\\F37. Foreign",
              canCreateFolder: "Y"
            }
          ],
          path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted\\C05. Constitutional and Supplemental Documents",
          canCreateFolder: "N"
        }
      ],
      path: "\\01 Client Documents\\C\\Cholan Industries\\FO Restricted",
      canCreateFolder: "N"
    },
    {
      url: null,
      canUpload: false,
      folderName: "Shared",
      templates: [],
      documentTitle: null,
      childFolder: [],
      path: "\\01 Client Documents\\C\\Cholan Industries\\Shared",
      canCreateFolder: "N"
    }
  ];

  const [formData, setFormData] = useState({
    // Email Setup
    profileName: config?.profileName || '',
    userName: config?.userName || '',
    mailFolder: config?.mailFolder || '',
    
    // Mail Settings
    mailAction: config?.mailAction || 'mark_read', // 'mark_read' or 'move_to_archive'
    saveConversation: config?.saveConversation || false,
    saveAttachmentSeparate: config?.saveAttachmentSeparate || false,
  });

  // Update form data and rules when config changes (for edit mode)
  useState(() => {
    if (config) {
      setFormData({
        profileName: config.profileName,
        userName: config.userName,
        mailFolder: config.mailFolder,
        mailAction: config.mailAction || 'mark_read',
        saveConversation: config.saveConversation || false,
        saveAttachmentSeparate: config.saveAttachmentSeparate || false,
      });
      setRules(config.rules || []);
    } else {
      // Reset for add mode
      setFormData({
        profileName: '',
        userName: '',
        mailFolder: '',
        mailAction: 'mark_read',
        saveConversation: false,
        saveAttachmentSeparate: false,
      });
      setRules([]);
    }
  });

  const totalSteps = 4;

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!formData.profileName.trim()) {
      newErrors.profileName = true;
    }
    if (!formData.userName.trim()) {
      newErrors.userName = true;
    } else if (!isValidEmail(formData.userName)) {
      newErrors.userName = true;
    }
    if (!formData.mailFolder.trim()) {
      newErrors.mailFolder = true;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (rules.length === 0) {
      return false;
    }
    return true;
  };

  const checkIfEditing = () => {
    return isRuleEditorOpen || isTemplateMappingOpen;
  };

  const handleNext = () => {
    if (checkIfEditing()) {
      return;
    }
    
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (checkIfEditing()) {
      return;
    }
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTabClick = (stepNumber: number) => {
    if (checkIfEditing()) {
      return;
    }
    
    if (stepNumber > 1 && currentStep === 1) {
      if (!validateStep1()) {
        return;
      }

      fetchClientsList()
    }
    
    if (stepNumber > 2 && currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }
    
    setErrors({});
    setCurrentStep(stepNumber);
  };

  const handleSubmit = () => {
    if (currentStep === 2 && !validateStep2()) {
      return;
    }
    
    const configData = {
      ...formData,
      rules: rules,
    };
    
    console.log('Configuration submitted:', configData);
    
    if (onSave) {
      onSave(configData);
    }
    
    // Reset form for next use
    setCurrentStep(1);
    setRules([]);
    setErrors({});
    setRuleErrors([]);
    
    onClose();
  };

  const updateFormData = (field: string, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddRule = () => {
    const newRule: Rule = {
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

  const handleEditRule = (rule: Rule) => {
    setEditingRule({ ...rule });
    setIsRuleEditorOpen(true);
  };

  const handleTemplateMapping = (rule: Rule) => {
    setMappingRule(rule);
    setTemplateMapping(rule.templateMapping || { 
      template: '', 
      clientName: '',
      from: '',
      to: '',
      cc: '',
      bcc: '',
      subject: '',
    });
    setShowFolderTree(false);
    setIsTemplateMappingOpen(true);
  };

  const handleSaveTemplateMapping = () => {
    if (!templateMapping.template || !templateMapping.clientName || !templateMapping.selectedFolder) {
      return;
    }

    if (mappingRule) {
      const updatedRules = rules.map(r =>
        r.id === mappingRule.id
          ? { ...r, templateMapping: templateMapping }
          : r
      );
      setRules(updatedRules);

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
    });
  };

  const handleFolderSelect = (folder: FolderNode) => {
    setTemplateMapping({ ...templateMapping, selectedFolder: folder });
    setShowFolderTree(false);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const validateRule = (): string[] => {
    const errors: string[] = [];
    
    if (!editingRule) return errors;

    // Rule name validation
    if (!editingRule.name.trim()) {
      errors.push('Rule name cannot be empty');
    } else {
      // Check for duplicate rule name (excluding current rule when editing)
      const duplicateRule = rules.find(
        r => r.name.toLowerCase() === editingRule.name.toLowerCase() && r.id !== editingRule.id
      );
      if (duplicateRule) {
        errors.push('Rule name already exists');
      }
    }

    // At least one checkbox must be selected
    const hasAnyFilter = editingRule.allEmail || editingRule.fromEmail || 
                        editingRule.toEmail || editingRule.ccEmail || editingRule.subject;
    if (!hasAnyFilter) {
      errors.push('At least one filter must be selected');
    }

    // From Email validation
    if (editingRule.fromEmail && editingRule.fromEmailList.length === 0) {
      errors.push('From Email: At least one email address is required');
    }

    // To Email validation
    if (editingRule.toEmail && editingRule.toEmailList.length === 0) {
      errors.push('To Email: At least one email address is required');
    }

    // CC Email validation
    if (editingRule.ccEmail && editingRule.ccEmailList.length === 0) {
      errors.push('CC Email: At least one email address is required');
    }

    // Subject validation
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
      const existingIndex = rules.findIndex(r => r.id === editingRule.id);
      if (existingIndex >= 0) {
        // Update existing rule
        setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
      } else {
        // Add new rule
        setRules([...rules, editingRule]);
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

  const updateEditingRule = (field: keyof Rule, value: any) => {
    if (editingRule) {
      setEditingRule({ ...editingRule, [field]: value });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2 border-b shrink-0">
        <h2 className="text-lg font-semibold">
          {mode === 'add' ? 'New Rule' : 'Edit Configuration'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-5 py-2 bg-muted/50 border-b shrink-0">
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
            onClick={async () => {
              if (currentStep === 2 && !validateStep2()) {
                return;
              }
              handleSubmit();
            }}
            size="sm"
            className={`gap-1.5 ${mode === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            <CheckIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b shrink-0 bg-muted/30">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentStep === tab.id;
              const isCompleted = currentStep > tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-medium border-b-2 transition-all ${
                    isActive
                      ? 'border-primary text-primary bg-background'
                      : isCompleted
                      ? 'border-green-500 text-green-600 hover:bg-muted/50'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
      <div className="flex-1 relative flex flex-col">
            {currentStep === 1 && (
              <div className="space-y-6 p-4 h-full overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Setup</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.profileName}
                      onChange={(e) => {
                        updateFormData('profileName', e.target.value);
                        if (errors.profileName) {
                          setErrors({ ...errors, profileName: false });
                        }
                      }}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                        errors.profileName
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                      placeholder="Enter profile name"
                      autoComplete="off"
                    />
                    {errors.profileName && (
                      <p className="text-red-500 text-sm mt-1">Profile Name is required</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className={errors.userName ? 'ring-2 ring-red-500 rounded-md' : ''}>
                      <ComboBox
                        value={formData.userName}
                        onChange={(value) => {
                          updateFormData('userName', value);
                          searchEmailUsers(value);
                          if (errors.userName) {
                            setErrors({ ...errors, userName: false });
                          }
                        }}
                        onOptionSelect={(value) => {
                          // Set selected email user when option is clicked
                          setSelectedEmailUser(value);
                        }}
                        onClear={() => {
                          // Clear selected email user when clear button is clicked
                          setSelectedEmailUser(null);
                          setMailFolders([]);
                        }}
                        options={
                          emailUsers 
                            ? Array.isArray(emailUsers) && typeof emailUsers[0] === 'string'
                              ? emailUsers as string[]
                              : (emailUsers as any[]).map((user: any) => user.mail || user)
                            : []
                        }
                        placeholder="Select or type email address"
                      />
                    </div>
                    {errors.userName && (
                      <p className="text-red-500 text-sm mt-1">
                        {!formData.userName.trim() ? 'Email Address is required' : 'Please enter a valid email address'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mail Folder <span className="text-red-500">*</span>
                    </label>
                    <div className={errors.mailFolder ? 'ring-2 ring-red-500 rounded-md' : ''}>
                      <ComboBox
                        value={formData.mailFolder}
                        onChange={(value) => {
                          updateFormData('mailFolder', value);
                          if (formData.userName) {
                            searchMailFolders();
                          }
                          if (errors.mailFolder) {
                            setErrors({ ...errors, mailFolder: false });
                          }
                        }}
                        options={
                          mailFolders 
                            ? Array.isArray(mailFolders) && typeof mailFolders[0] === 'string'
                              ? mailFolders as string[]
                              : (mailFolders as any[]).map((folder: any) => folder.displayName || folder)
                            : []
                        }
                        placeholder="Select or type folder name"
                      />
                    </div>
                    {errors.mailFolder && (
                      <p className="text-red-500 text-sm mt-1">Mail Folder is required</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Rules */}
            {currentStep === 2 && !isRuleEditorOpen && !isTemplateMappingOpen && (
              <div className="space-y-6 p-4 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Email Processing Rules</h3>
                  <Button
                    onClick={handleAddRule}
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </Button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Rule Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Filters
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Template
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-32">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {rules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                            No rules added yet. Click "Add Rule" to create one.
                          </td>
                        </tr>
                      ) : (
                        rules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {rule.name || 'Unnamed Rule'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {rule.allEmail && 'All Emails'}
                              {rule.fromEmail && ` From: ${rule.fromEmailList.length} addresses`}
                              {rule.toEmail && ` To: ${rule.toEmailList.length} addresses`}
                              {rule.ccEmail && ` CC: ${rule.ccEmailList.length} addresses`}
                              {rule.subject && ` Subject: "${rule.subjectText}"`}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {rule.templateMapping?.template || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleEditRule(rule)}
                                  size={'icon'}
                                  variant={'ghost'}
                                  aria-label="Edit rule"
                                  title="Edit rule"
                                >
                                  <Pencil className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                  onClick={() => handleTemplateMapping(rule)}
                                  size={'icon'}
                                  variant={'ghost'}
                                  aria-label="Template mapping"
                                  title="Template mapping"
                                >
                                  <FileCode className="w-4 h-4 text-gray-600" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteRule(rule.id)}
                                  size={'icon'}
                                  variant={'ghost'}
                                  aria-label="Delete rule"
                                  title="Delete rule"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-600" />
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

            {/* Template Mapping Panel */}
            {currentStep === 2 && isTemplateMappingOpen && mappingRule && (
              <div className="absolute inset-0 bg-white z-10 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    Template Mapping - {mappingRule.name}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template <span className="text-red-500">*</span>
                      </label>
                      <ComboBox
                        value={templateMapping.template}
                        onChange={(value) => setTemplateMapping({ ...templateMapping, template: value })}
                        options={templateOptions}
                        placeholder="Select or type template name"
                      />
                    </div>

                    {templateMapping.template && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Client Name <span className="text-red-500">*</span>
                          </label>
                          <ComboBox
                            value={templateMapping.clientName}
                            onChange={(value) => setTemplateMapping({ ...templateMapping, clientName: value })}
                            options={clientOptions}
                            placeholder="Select or type client name"
                          />
                        </div>

                        {templateMapping.clientName && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document Type <span className="text-red-500">*</span>
                              </label>

                              {!templateMapping.selectedFolder && !showFolderTree ? (
                                <button
                                  type="button"
                                  onClick={() => setShowFolderTree(true)}
                                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-blue-600 font-medium"
                                >
                                  + Add Document Type
                                </button>
                              ) : showFolderTree ? (
                                <div>
                                  <FolderTree
                                    data={mockFolderData}
                                    onFolderSelect={handleFolderSelect}
                                    selectedFolder={templateMapping.selectedFolder}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowFolderTree(false)}
                                    className="mt-2 text-xs text-gray-600 hover:text-gray-800"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-xs text-blue-900 font-medium">Selected Document Type:</p>
                                      <p className="text-xs text-blue-800 mt-1">{templateMapping.selectedFolder?.folderName}</p>
                                      <p className="text-xs text-gray-600 mt-1">{templateMapping.selectedFolder?.path}</p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setShowFolderTree(true)}
                                      className="text-xs text-blue-600 hover:text-blue-700 font-medium ml-2"
                                    >
                                      Change
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                From
                              </label>
                              <ComboBox
                                value={templateMapping.from || ''}
                                onChange={(value) => setTemplateMapping({ ...templateMapping, from: value })}
                                options={fromOptions}
                                placeholder="Select or type from address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                To
                              </label>
                              <ComboBox
                                value={templateMapping.to || ''}
                                onChange={(value) => setTemplateMapping({ ...templateMapping, to: value })}
                                options={toOptions}
                                placeholder="Select or type to address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CC
                              </label>
                              <ComboBox
                                value={templateMapping.cc || ''}
                                onChange={(value) => setTemplateMapping({ ...templateMapping, cc: value })}
                                options={ccOptions}
                                placeholder="Select or type CC address"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                BCC
                              </label>
                              <ComboBox
                                value={templateMapping.bcc || ''}
                                onChange={(value) => setTemplateMapping({ ...templateMapping, bcc: value })}
                                options={bccOptions}
                                placeholder="Select or type BCC address"
                              />
                            </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Subject
                                </label>
                                <ComboBox
                                  value={templateMapping.subject || ''}
                                  onChange={(value) => setTemplateMapping({ ...templateMapping, subject: value })}
                                  options={subjectOptions}
                                  placeholder="Select or type subject"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    )}
                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
                  <button
                    onClick={handleCancelTemplateMapping}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTemplateMapping}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Save Mapping
                  </button>
                </div>
                  </div>
                </div>

              </div>
            )}

            {/* Rule Editor Panel */}
            {currentStep === 2 && isRuleEditorOpen && editingRule && (
              <div className="space-y-6 p-4 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {rules.find(r => r.id === editingRule.id) ? 'Edit Rule' : 'Add New Rule'}
                  </h3>
                </div>

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

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingRule.name}
                      onChange={(e) => {
                        updateEditingRule('name', e.target.value);
                        setRuleErrors([]);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter rule name"
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900">Email Filters</h4>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingRule.allEmail}
                        onChange={(e) => {
                          updateEditingRule('allEmail', e.target.checked);
                          setRuleErrors([]);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">All Emails</span>
                    </label>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={editingRule.fromEmail}
                          onChange={(e) => {
                            updateEditingRule('fromEmail', e.target.checked);
                            setRuleErrors([]);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">From Email</span>
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
                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={editingRule.toEmail}
                          onChange={(e) => {
                            updateEditingRule('toEmail', e.target.checked);
                            setRuleErrors([]);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">To Email</span>
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
                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={editingRule.ccEmail}
                          onChange={(e) => {
                            updateEditingRule('ccEmail', e.target.checked);
                            setRuleErrors([]);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">CC Email</span>
                      </label>
                      {editingRule.ccEmail && (
                        <TaggedInput
                          tags={editingRule.ccEmailList}
                          onChange={(tags) => {
                            updateEditingRule('ccEmailList', tags);
                            setRuleErrors([]);
                          }}
                          placeholder="Type email and press Enter"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer mb-2">
                        <input
                          type="checkbox"
                          checked={editingRule.subject}
                          onChange={(e) => {
                            updateEditingRule('subject', e.target.checked);
                            setRuleErrors([]);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Subject</span>
                      </label>
                      {editingRule.subject && (
                        <input
                          type="text"
                          value={editingRule.subjectText}
                          onChange={(e) => {
                            updateEditingRule('subjectText', e.target.value);
                            setRuleErrors([]);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter subject text (min 2 characters)"
                          autoComplete="off"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleCancelRule}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveRule}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Save Rule
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Mail Settings */}
            {currentStep === 3 && (
              <div className="space-y-6 p-4 h-full overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mail Settings</h3>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Email Action</h4>
                  
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name="mailAction"
                      value="mark_read"
                      checked={formData.mailAction === 'mark_read'}
                      onChange={(e) => updateFormData('mailAction', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Mark as Read</span>
                      <p className="text-xs text-gray-500">Mark processed emails as read</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name="mailAction"
                      value="move_to_archive"
                      checked={formData.mailAction === 'move_to_archive'}
                      onChange={(e) => updateFormData('mailAction', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Move to Archive</span>
                      <p className="text-xs text-gray-500">Move processed emails to archive folder</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Additional Options</h4>
                  
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.saveConversation}
                      onChange={(e) => updateFormData('saveConversation', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Save Conversation</span>
                      <p className="text-xs text-gray-500">Save the entire email conversation thread</p>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.saveAttachmentSeparate}
                      onChange={(e) => updateFormData('saveAttachmentSeparate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Save Attachment as Separate File</span>
                      <p className="text-xs text-gray-500">Save email attachments as separate files</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Tab 4: Summary */}
            {currentStep === 4 && (
              <div className="space-y-6 p-4 max-h-full overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Email Setup</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Profile Name:</span>
                        <span className="font-medium">{formData.profileName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Email Address:</span>
                        <span className="font-medium">{formData.userName || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Mail Folder:</span>
                        <span className="font-medium">{formData.mailFolder}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">Rules</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Rules:</span>
                        <span className="font-medium">{rules.length} rule(s) configured</span>
                      </div>
                      {rules.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {rules.map((rule, index) => (
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
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Email Action:</span>
                        <span className="font-medium">{formData.mailAction === 'mark_read' ? 'Mark as Read' : 'Move to Archive'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Save Conversation:</span>
                        <span className="font-medium">{formData.saveConversation ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Save Attachment Separate:</span>
                        <span className="font-medium">{formData.saveAttachmentSeparate ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}