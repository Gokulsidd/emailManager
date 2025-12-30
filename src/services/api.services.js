import axios from "axios";
import { useStore } from "@/store/useStore";

const getApiInstance = () => {
  const { configs } = useStore.getState();
  return axios.create({
    baseURL: configs?.NEXT_PUBLIC_API_BASEPATH_URL || "",
    withCredentials: false,
    headers: { "Content-Type": "application/json" },
  });
};

const getApi2Instance = () => {
  const { configs } = useStore.getState();
  return axios.create({
    baseURL: configs?.NEXT_PUBLIC_API_2_BASEPATH_URL || "",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
};

export const getAllEmails = async () => {
  try {
    const { configs } = useStore.getState();
    const api = getApiInstance();
    const endPoint = configs?.GET_ALL_EMAILS_END_POINT || "Email/All";

    const response = await api.get(endPoint, {
      withCredentials: false,
    });
    
    return response.data.mails || [];
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return [];
  }
};

// Convert API Email format to UI EmailConfig format
export const convertEmailToConfig = (email) => {
  const rules = email.mailRule.map((mailRule, index) => {
    let ruleData = null;
    
    try {
      ruleData = JSON.parse(mailRule.ruleData);
    } catch (error) {
      console.error("Failed to parse ruleData:", error);
    }

    return {
      id: `${mailRule.id}`,
      name: mailRule.ruleName,
      allEmail: ruleData?.All || false,
      fromEmail: !!(ruleData?.From && ruleData.From.length > 0),
      fromEmailList: ruleData?.From || [],
      toEmail: !!(ruleData?.To && ruleData.To.length > 0),
      toEmailList: ruleData?.To || [],
      ccEmail: false,
      ccEmailList: [],
      subject: !!(ruleData?.Subject?.SubjectText),
      subjectText: ruleData?.Subject?.SubjectText || "",
    };
  });

  return {
    id: email.id.toString(),
    profileName: email.profileName,
    userName: email.userName,
    mailFolder: email.mailFolderName,
    emailsPerSession: email.noOfMailsPerSession,
    rules,
  };
};

// Convert UI EmailConfig format to API Email format
export const convertConfigToEmail = (config) => {
  const mailRules = (config.rules || []).map((rule, index) => {
    const ruleData = {
      From: rule.fromEmail ? rule.fromEmailList : null,
      To: rule.toEmail ? rule.toEmailList : null,
      All: rule.allEmail,
      Subject: {
        Condition: rule.subject ? "contains" : null,
        SubjectText: rule.subject ? rule.subjectText : null,
      },
      UploadDocumentType: ["mail"],
      AfterAction: {
        DeleteAfter: false,
        MarkRead: config.mailAction === "mark_read",
        ForwardMail: false,
        MoveToFolder: config.mailAction === "move_to_archive" ? "Archive" : null,
      },
    };

    return {
      id: parseInt(rule.id) || 0,
      mailID: parseInt(config.id) || 0,
      ruleName: rule.name,
      seq: index + 1,
      ruleData: JSON.stringify(ruleData),
      ruleObject: null,
      mailDMS: {
        id: 0,
        mailDMSID: 0,
        mailID: 0,
        dfxurl: null,
        repository: null,
        templateMapping: "",
        templateObject: null,
        linkConversation: config.saveConversation || false,
        backupCopy: config.saveAttachmentSeparate || false,
        backupLocation: "",
        dfxFolder: null,
      },
    };
  });

  return {
    id: parseInt(config.id),
    mailType: "M",
    userName: config.userName,
    password: null,
    mailFolder: config.mailFolder,
    noOfMailsPerSession: config.emailsPerSession,
    exchangeUrl: null,
    profileName: config.profileName,
    mailRule: mailRules,
    mailFolderName: config.mailFolder,
  };
};


// search email users 
export const fetchEmailUsers = async (value) => {
  try {
    const { configs } = useStore.getState();
    const api = getApiInstance();
    const endPoint = configs?.SEARCH_EMAIL_USERS_END_POINT || "User/Users?filter=";

    const response = await api.get(endPoint + value, {
      withCredentials: false,
    });
    
    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch email users:", error);
    return [];
  }
};

// search mail folders
export const fetchMailFolders = async (emailUser) => {
  try {
    const { configs } = useStore.getState();
    const api = getApiInstance();
    const endPoint = configs?.GET_USERS_FOLDER_END_POINT || "User/UserFolders?email=";

    const response = await api.get(endPoint + emailUser, {
      withCredentials: false,
    });
    
    return response?.data || [];
  } catch (error) {
    console.error("Failed to fetch mail folders:", error);
    return [];
  }
};

// fetch clients list
export const fetchClientsList = async (params = {}) => {
  try {
    const { configs } = useStore.getState();
    const api = getApi2Instance();

    const endPoint =
      configs?.GET_CLIENTS_LIST_END_POINT ||
      "Search/DynamicField/ClientList";

    const {
      source = "Client",
      search = "%25",
      page = 1,
    } = params;

    const queryParams = new URLSearchParams({
      source,
      search,
      page: page.toString(),
    }).toString();

    const response = await api.get(`${endPoint}?${queryParams}`, {
      withCredentials: true,
    });

    return response?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch clients list:", error);
    return [];
  }
};