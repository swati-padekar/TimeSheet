import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ITimesheetProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  webURL:string;
  context:WebPartContext;
}
