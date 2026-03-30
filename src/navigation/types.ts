import { Routes } from './Routes';

export type RootStackParamList = {
  [Routes.LOGIN]: undefined;
  [Routes.SIGNUP]: undefined;
  [Routes.MAIN_APP]: undefined;
};

export type ProjectsStackParamList = {
  [Routes.PROJECTS]: undefined;
  [Routes.CREATE_PROJECT]: undefined;
  [Routes.PROJECT_TODOS]: { projectId: string; projectName: string };
  [Routes.ADD_PROJECT_MEMBER]: { projectId: string; projectName: string };
  [Routes.TODO_DETAIL]: { taskId: string; todoTitle: string };
};

export type DashboardStackParamList = {
  [Routes.DASHBOARD]: undefined;
  [Routes.MY_TASKS]: undefined;
  [Routes.PROJECTS]: undefined;
  [Routes.CREATE_TASK]: undefined;
  [Routes.CREATE_TAG]: undefined;
  [Routes.TAGS_LIST]: undefined;
  [Routes.VOICE_ASSISTANT]: undefined;
};