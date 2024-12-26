import { FormData } from "../AppealForm/types";

const STORAGE_KEY = 'appeals-list';

export const saveNewAppeal = (formData: FormData) => {
  const appeals = getAppealsList();
  const newAppeal = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...formData
  };
  
  appeals.push(newAppeal);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
};

export const getAppealsList = () => {
  const appealsJson = localStorage.getItem(STORAGE_KEY);
  return appealsJson ? JSON.parse(appealsJson) : [];
};