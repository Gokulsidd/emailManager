import { fetchEmailUsers, fetchMailFolders } from '@/services/api.services';
import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Existing state
  configs: null,
  emails: null,
  emailUsers: null,
  mailFolders: null,
  selectedEmailUser: null,
  emailConfigs: null,
  
  // Wizard state
  isWizardOpen: false,
  wizardMode: 'add',
  selectedConfig: undefined,
  currentStep: 1,
  wizardErrors: {},
  wizardRules: [],
  isRuleEditorOpen: false,
  editingRule: null,
  ruleErrors: [],
  isTemplateMappingOpen: false,
  mappingRule: null,
  showFolderTree: false,
  templateMapping: {
    template: '',
    clientName: '',
    from: '',
    to: '',
    cc: '',
    bcc: '',
    subject: '',
  },
  wizardFormData: {
    profileName: '',
    userName: '',
    mailFolder: '',
    mailAction: 'mark_read',
    saveConversation: false,
    saveAttachmentSeparate: false,
  },

  // Existing setters
  setConfigs: (configs) => set({ configs }),
  setEmails: (emails) => set({ emails }),
  setEmailUsers: (emailUsers) => set({ emailUsers }),
  setMailFolders: (mailFolders) => set({ mailFolders }),
  setSelectedEmailUser: (emailUser) => set({ selectedEmailUser: emailUser }),
  setEmailConfigs: (emailConfigs) => set({ emailConfigs }),
  
  // Wizard setters
  setIsWizardOpen: (isOpen) => set({ isWizardOpen: isOpen }),
  setWizardMode: (mode) => set({ wizardMode: mode }),
  setSelectedConfig: (config) => set({ selectedConfig: config }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setWizardErrors: (errors) => set({ wizardErrors: errors }),
  setWizardRules: (rules) => set({ wizardRules: rules }),
  setIsRuleEditorOpen: (isOpen) => set({ isRuleEditorOpen: isOpen }),
  setEditingRule: (rule) => set({ editingRule: rule }),
  setRuleErrors: (errors) => set({ ruleErrors: errors }),
  setIsTemplateMappingOpen: (isOpen) => set({ isTemplateMappingOpen: isOpen }),
  setMappingRule: (rule) => set({ mappingRule: rule }),
  setShowFolderTree: (show) => set({ showFolderTree: show }),
  setTemplateMapping: (mapping) => set({ templateMapping: mapping }),
  setWizardFormData: (data) => set({ wizardFormData: data }),
  updateWizardFormField: (field, value) => set((state) => ({
    wizardFormData: { ...state.wizardFormData, [field]: value }
  })),

  // Wizard actions
  openWizard: (mode, config) => {
    if (mode === 'edit' && config) {
      set({
        isWizardOpen: true,
        wizardMode: 'edit',
        selectedConfig: config,
        currentStep: 1,
        wizardRules: config.rules || [],
        wizardFormData: {
          profileName: config.profileName,
          userName: config.userName,
          mailFolder: config.mailFolder,
          mailAction: config.mailAction || 'mark_read',
          saveConversation: config.saveConversation || false,
          saveAttachmentSeparate: config.saveAttachmentSeparate || false,
        },
        wizardErrors: {},
      });
    } else {
      set({
        isWizardOpen: true,
        wizardMode: 'add',
        selectedConfig: undefined,
        currentStep: 1,
        wizardRules: [],
        wizardFormData: {
          profileName: '',
          userName: '',
          mailFolder: '',
          mailAction: 'mark_read',
          saveConversation: false,
          saveAttachmentSeparate: false,
        },
        wizardErrors: {},
      });
    }
  },

  closeWizard: () => {
    set({
      isWizardOpen: false,
      currentStep: 1,
      wizardRules: [],
      wizardErrors: {},
      ruleErrors: [],
      isRuleEditorOpen: false,
      editingRule: null,
      isTemplateMappingOpen: false,
      mappingRule: null,
      showFolderTree: false,
      selectedEmailUser: null,
      emailUsers: null,
      mailFolders: null,
      templateMapping: {
        template: '',
        clientName: '',
        from: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
      },
    });
  },

  saveWizardConfig: () => {
    const { wizardMode, selectedConfig, wizardFormData, wizardRules, emailConfigs, setEmailConfigs } = get();
    
    const configData = {
      ...wizardFormData,
      rules: wizardRules,
    };

    // Console log the final payload
    console.log('=== Final Wizard Payload ===');
    console.log('Mode:', wizardMode);
    console.log('Form Data:', {
      profileName: wizardFormData.profileName,
      userName: wizardFormData.userName,
      mailFolder: wizardFormData.mailFolder,
      mailAction: wizardFormData.mailAction,
      saveConversation: wizardFormData.saveConversation,
      saveAttachmentSeparate: wizardFormData.saveAttachmentSeparate,
    });
    console.log('Rules:', wizardRules.map(rule => ({
      id: rule.id,
      name: rule.name,
      filters: {
        allEmail: rule.allEmail,
        fromEmail: rule.fromEmail,
        fromEmailList: rule.fromEmailList,
        toEmail: rule.toEmail,
        toEmailList: rule.toEmailList,
        ccEmail: rule.ccEmail,
        ccEmailList: rule.ccEmailList,
        subject: rule.subject,
        subjectText: rule.subjectText,
      },
      templateMapping: rule.templateMapping,
    })));
    console.log('Complete Config:', configData);
    console.log('==========================');

    if (wizardMode === 'add') {
      const newConfig = {
        id: Date.now().toString(),
        ...configData,
        emailsPerSession: 100,
      };
      setEmailConfigs([...(emailConfigs || []), newConfig]);
    } else if (selectedConfig) {
      const updatedConfigs = (emailConfigs || []).map((c) =>
        c.id.toString() === selectedConfig.id.toString()
          ? { ...c, ...configData }
          : c
      );
      setEmailConfigs(updatedConfigs);
    }

    // Don't close wizard immediately - let the success dialog handle it
  },

  deleteConfig: (id) => {
    const { emailConfigs, setEmailConfigs } = get();
    setEmailConfigs((emailConfigs || []).filter((c) => c.id.toString() !== id));
  },

  // Existing async actions
  searchEmailUsers: async (value) => {
    const { setEmailUsers } = get();

    if (value?.trim() === "" || !value) {
      setEmailUsers([]);
      return [];
    }

    const users = await fetchEmailUsers(value);
    setEmailUsers(users);
    return users;
  },

  searchMailFolders: async () => {
    const { selectedEmailUser, setMailFolders } = get();

    if (!selectedEmailUser) {
      setMailFolders([]);
      return [];
    }

    const folders = await fetchMailFolders(selectedEmailUser);
    setMailFolders(folders);
    return folders;
  },
}));