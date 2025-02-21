export interface WgerAuthResponse {
    access: string;
    refresh: string;
}

export interface Workout {
    id: number;
    comment: string | null;
}
