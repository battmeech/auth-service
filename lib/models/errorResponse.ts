/**
 * Presents an error response which would be sent to the user
 */
export class ErrorResponse {
    status: number;
    message: string;
    details: string;

    constructor(status: number, message: string, details: string) {
        this.status = status;
        this.message = message;
        this.details = details;
    }
}
