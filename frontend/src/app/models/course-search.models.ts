
export interface CourseSearchRequest {
  q?: string;

  minDuration?: number;
  maxDuration?: number;

  // Use ISO date strings ('YYYY-MM-DD') when sending to backend
  startFrom?: string;
  startTo?: string;
  endFrom?: string;
  endTo?: string;

  page?: number;
  size?: number;
}

export interface CourseSearchHit {
  id: number;
  courseName: string;
  description: string;
  duration: number;
  startDate: string | null;
  endDate: string | null;
  score: number;
}

export interface CourseSearchResponse {
  totalHits: number;
  page: number;
  size: number;
  hits: CourseSearchHit[];
}
