export interface ReqResponse {
  code: number;
  msg: string;
  data: Record<string, any>;
}

export interface LoginResp {
  token: string;
}

export interface LocalUser {
  username: string;
  token: string;
}

export interface GlobalDialogProps {
  title: string;
  icon?: string;
  iconColor?: string;
  msg: string
  cancelBtnText?: string;
  cancelBtnColor?: string;
  showCancelBtn?: boolean;
  okBtnText?: string;
  okBtnColor?: string;
  onCancel?: () => void;
  onOk?: () => void | Promise<void>;
  persistent?: boolean;
}

export interface GlobalSnackbarProps {
  text: string;
  icon?: string;
  color?: string;
  location: string
  showAction?: boolean
  actionText?: string;
  actionColor?: string
  onActionClick?: () => void;
  timeout?: number;
}

export interface DevInfo {
  devId: string;
  platform: string;
  appVersion: string;
}

export interface ConnectionStatus {
  self: DevInfo;
  target: DevInfo | null;
  connType: string;
  createTime: string;
  speed: string;
  transferredBytes: string;
  unlimited: boolean
}

export interface ConnectionStatusResp {
  base: ConnectionStatus[],
  dataSync: ConnectionStatus[],
  fileSync: ConnectionStatus[]
}

export const connTypes: (keyof ConnectionStatusResp)[] = ['base', 'dataSync', 'fileSync']

export interface ConnTableItem {
  selfId: string,
  platform: string,
  appVersion: string,
  targetId?: string,
  createTime: string,
  speed: string,
  transferredBytes: string,
  unlimited: boolean,
}

export interface LoginSettings {
  loginExpiredSeconds: number
}

export interface FileTransferLimit {
  fileTransferEnabled: boolean,
  fileTransferRateLimit: number
}

export interface UnlimitedDevice {
  id: string,
  name: string
  desc?: string
}

export type SysConfig = LoginSettings & FileTransferLimit & {
  unlimitedDevices: UnlimitedDevice[]
}
export type TrafficTrends = 'network' | 'usage' | 'connection'

export interface NetworkChartData {
  dataSync: number;
  fileSync: number;
  time: string;
}

export interface ConnectionChartData {
  baseCnt: number;
  dataSyncCnt: number;
  fileSyncCnt: number;
  time: string;
}

export interface TrafficChartData {
  traffic: number;
  time: string;
}

export interface ChartData {
  netSpeed: NetworkChartData;
  traffic: number;
  connectionCnt: ConnectionChartData;
}

export interface ForcedDisconnectionDto {
  connType: keyof ConnectionStatusResp;
  key: string;
}
