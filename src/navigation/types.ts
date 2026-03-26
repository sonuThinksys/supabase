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
};

export type DashboardStackParamList = {
  [Routes.DASHBOARD]: undefined;
  [Routes.MY_TASKS]: undefined;
  [Routes.PROJECTS]: undefined;
  [Routes.CREATE_TASK]: undefined;
  [Routes.CREATE_TAG]: undefined;
};