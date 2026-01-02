import { fetchEmailUsers, fetchMailFolders, saveEmailConfiguration, getAllEmails, convertEmailToConfig, deleteEmailConfiguration } from '@/services/api.services';
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

  saveWizardConfig: async () => {
    const { wizardMode, selectedConfig, wizardFormData, wizardRules, setEmailConfigs } = get();
    
    // Console log the wizard data before API call
    console.log('=== Wizard Data Before API Call ===');
    console.log('Mode:', wizardMode);
    console.log('Form Data:', wizardFormData);
    console.log('Rules:', wizardRules);
    console.log('==================================');

    try {
      // Call API to save configuration
      const result = await saveEmailConfiguration(
        wizardFormData,
        wizardRules,
        wizardMode,
        selectedConfig
      );

      if (result.success) {
        console.log('✅ Email configuration saved successfully');
        
        // Fetch latest email configurations from API
        console.log('🔄 Fetching latest email configurations...');
        const emails = await getAllEmails();
        
        if (emails && emails.length > 0) {
          // Convert API format to UI format
          const convertedConfigs = emails.map(email => convertEmailToConfig(email));
          setEmailConfigs(convertedConfigs);
          console.log('✅ Email configurations refreshed from API');
        }

        return { success: true, message: result.message };
      } else {
        console.error('❌ Failed to save email configuration:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Error saving email configuration:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  updateWizardConfig: async () => {
    const { wizardMode, selectedConfig, wizardFormData, wizardRules, setEmailConfigs } = get();
    
    // Console log the wizard data before API call
    console.log('=== Wizard Data Before API Call ===');
    console.log('Mode:', wizardMode);
    console.log('Form Data:', wizardFormData);
    console.log('Rules:', wizardRules);
    console.log('==================================');

    try {
      // Call API to save configuration
      const result = await saveEmailConfiguration(
        wizardFormData,
        wizardRules,
        wizardMode,
        selectedConfig
      );

      if (result.success) {
        console.log('✅ Email configuration Updated successfully');
        
        // Fetch latest email configurations from API
        console.log('🔄 Fetching latest email configurations...');
        const emails = await getAllEmails();
        
        if (emails && emails.length > 0) {
          // Convert API format to UI format
          const convertedConfigs = emails.map(email => convertEmailToConfig(email));
          setEmailConfigs(convertedConfigs);
          console.log('✅ Email configurations refreshed from API');
        }

        return { success: true, message: result.message };
      } else {
        console.error('❌ Failed to save email configuration:', result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('❌ Error saving email configuration:', error);
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  deleteConfig: async (id) => {
    const { setEmailConfigs } = get();

    try{
      const response = await deleteEmailConfiguration(id);
      console.log(response);

      //need to add this with condition
      const emails = await getAllEmails();
        
        if (emails && emails.length > 0) {
          // Convert API format to UI format
          const convertedConfigs = emails.map(email => convertEmailToConfig(email));
          setEmailConfigs(convertedConfigs);
          console.log('✅ Email configurations refreshed from API');
        }
    }catch(error){
      console.log(error);
    }
  },

  // Load all email configurations from API
  loadEmailConfigs: async () => {
    const { setEmailConfigs } = get();
    
    try {
      console.log('📥 Loading email configurations from API...');
      const emails = await getAllEmails();
      
      if (emails && emails.length > 0) {
        const convertedConfigs = emails.map(email => convertEmailToConfig(email));
        setEmailConfigs(convertedConfigs);
        console.log('✅ Loaded', convertedConfigs.length, 'email configurations');
        return convertedConfigs;
      } else {
        setEmailConfigs([]);
        console.log('ℹ️ No email configurations found');
        return [];
      }
    } catch (error) {
      console.error('❌ Failed to load email configurations:', error);
      return [];
    }
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