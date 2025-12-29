import { fetchEmailUsers, fetchMailFolders } from '@/services/api.services';
import { Email, EmailConfig, EmailUser, MailFolder } from '@/types/config';
import { create } from 'zustand';

interface StoreState {
  configs: {} | null;
  emails: Email[] | null;
  emailUsers: EmailUser[] | string[] | null;
  mailFolders: MailFolder[] | string[] | null;
  selectedEmailUser: string | null;
  emailConfigs: EmailConfig[] | null;
  isWizardOpen: boolean;
  
  setConfigs: (configs: {}) => void;
  setEmails: (emails: Email[]) => void;
  setEmailUsers: (emailUsers: EmailUser[] | string[]) => void;
  setMailFolders: (mailFolders: MailFolder[] | string[]) => void;
  setSelectedEmailUser: (emailUser: string | null) => void;
  setEmailConfigs: (emailConfigs: EmailConfig[]) => void;
  setIsWizardOpen: (isOpen: boolean) => void;
  searchEmailUsers: (value: string) => Promise<EmailUser[]>;
  searchMailFolders: () => Promise<MailFolder[]>;
}

export const useStore = create<StoreState>((set) => ({
  configs: null,
  emails: null,
  emailUsers: null,
  mailFolders: null,
  selectedEmailUser: null,
  emailConfigs: null,
  isWizardOpen: false,

  setConfigs: (configs: {}) => set({ configs }),
  setEmails: (emails: Email[]) => set({ emails }),
  setEmailUsers: (emailUsers: EmailUser[] | string[]) => set({ emailUsers }),
  setMailFolders: (mailFolders: MailFolder[] | string[]) => set({ mailFolders }),
  setSelectedEmailUser: (emailUser: string | null) => set({ selectedEmailUser: emailUser }),
  setEmailConfigs: (emailConfigs: EmailConfig[]) => set({ emailConfigs }),
  setIsWizardOpen: (isOpen: boolean) => set({ isWizardOpen: isOpen }),


  searchEmailUsers: async (value: string): Promise<EmailUser[]> => {
    const { setEmailUsers } = useStore.getState();

    if (value?.trim() === "" || !value) {
      setEmailUsers([]);
      return [];
    }

    try {
      const res = await fetchEmailUsers(value);
      console.log(res, 'email users response');

      const usersMailList: string[] =
        res?.map((user: EmailUser) => user.mail) || [];

      setEmailUsers(usersMailList);

      return res || [];
    } catch (error) {
      console.error("Failed to fetch email users:", error);
      setEmailUsers([]);
      return [];
    }
  },

  searchMailFolders: async (): Promise<MailFolder[]> => {
    const { selectedEmailUser, setMailFolders } = useStore.getState();

 

    try {
      const res = await fetchMailFolders(selectedEmailUser || '');
      console.log(res, 'mail folders response');

      const folderDisplayNames: string[] =
        res?.map((folder: MailFolder) => folder.displayName) || [];

      setMailFolders(folderDisplayNames);

      return res || [];
    } catch (error) {
      console.error("Failed to fetch mail folders:", error);
      setMailFolders([]);
      return [];
    }
  },

  

}));