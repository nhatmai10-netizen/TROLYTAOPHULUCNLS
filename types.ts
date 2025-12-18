export enum ITCondition {
  GOOD = "Thuận lợi (Phòng máy, Máy chiếu, Internet tốc độ cao)",
  AVERAGE = "Trung bình (Có máy tính GV, Tivi/Máy chiếu, Internet ổn định)",
  LIMITED = "Hạn chế (Chỉ có máy tính GV, Internet chập chờn hoặc không có)"
}

export interface UserInput {
  grade: string;
  subject: string;
  textbook: string;
  itCondition: ITCondition;
  topicList: string;
  periodsPerWeek: number;
}

export interface Appendix1Row {
  stt: number;
  subject: string;
  grade: string;
  lesson: string;
  domain: string;
  competency: string;
  indicatorCode: string;
  level: string;
  suitability: string;
  note: string;
}

export interface Appendix3Row {
  stt: number;
  lesson: string;
  duration: number;
  timing: string;
  equipment: string;
  location: string;
  integrationNote: string;
}

export interface GeneratedDossier {
  appendix1: Appendix1Row[];
  appendix3: Appendix3Row[];
  summary: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: GeneratedDossier | null;
}