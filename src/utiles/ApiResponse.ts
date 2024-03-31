
export class ApiResponse {
    private statusCode:number;
    private message:string;
    private data:unknown;
    private success:boolean;

    constructor(statusCode:number, data:unknown, message:string="Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message? message:"success";
        this.success = true
    }
}