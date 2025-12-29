export interface FolderNode {
  url: string | null;
  canUpload: boolean;
  folderName: string;
  templates: any[];
  documentTitle: string | null;
  childFolder: FolderNode[];
  path: string;
  canCreateFolder: string;
}

export interface TemplateMapping {
  template: string;
  clientName: string;
  selectedFolder?: FolderNode;
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
}

export interface Rule {
  id: string;
  name: string;
  allEmail: boolean;
  fromEmail: boolean;
  fromEmailList: string[];
  toEmail: boolean;
  toEmailList: string[];
  ccEmail: boolean;
  ccEmailList: string[];
  subject: boolean;
  subjectText: string;
  templateMapping?: TemplateMapping;
}

export interface EmailConfig {
  id: string;
  profileName: string;
  userName: string;
  mailFolder: string;
  emailsPerSession: number;
  rules?: Rule[];
  mailAction?: string;
  saveConversation?: boolean;
  saveAttachmentSeparate?: boolean;
}



export interface MailJob {
  id: number;
  mailID: number;
  scheduleCode: string;
  startDT: string | null;
  status: number;
}

export interface MailDMS {
  id: number;
  mailDMSID: number;
  mailID: number;
  dfxurl: string | null;
  repository: string | null;
  templateMapping: string;
  templateObject: any | null;
  linkConversation: boolean;
  backupCopy: boolean;
  backupLocation: string;
  dfxFolder: string | null;
}

export interface MailRule {
  id: number;
  mailID: number;
  ruleName: string;
  seq: number;
  ruleData: string;
  ruleObject: any | null;
  mailDMS: MailDMS;
}

export interface Email {
  job: MailJob;
  id: number;
  mailType: string;
  userName: string;
  password: string | null;
  mailFolder: string;
  noOfMailsPerSession: number;
  exchangeUrl: string | null;
  profileName: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  mailRule: MailRule[];
  mailFolderName: string;
  lastSync: string;
  runStatus: string;
}

export interface ApiResponse {
  mails: Email[];
  jobLogs: any[];
  jobLogDetail: any[];
  status: number;
  errorMessage: string | null;
}

export interface RuleData {
  From: string[] | null;
  To: string[] | null;
  All: boolean;
  Subject: {
    Condition: string | null;
    SubjectText: string | null;
  };
  UploadDocumentType: string[];
  AfterAction: {
    DeleteAfter: boolean;
    MarkRead: boolean;
    ForwardMail: boolean;
    MoveToFolder: string | null;
  };
}

export interface EmailUser {
  id: string;

  displayName: string;
  givenName: string;
  surname: string | null;

  mail: string;
  userPrincipalName: string;

  businessPhones: string[];

  jobTitle: string | null;
  mobilePhone: string | null;
  officeLocation: string | null;
  preferredLanguage: string | null;
}

export interface MailFolder {
  "@odata.type": string;
  id: string;
  displayName: string;
  parentFolderId: string;
  childFolderCount: number;
  unreadItemCount: number;
  totalItemCount: number;
  sizeInBytes: number;
  isHidden: boolean;
}