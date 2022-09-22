declare namespace Express {
    export interface Request {
        locals: any
        status: any
        render: any
        app: any
    }
    export interface Response {
        locals: any
        status: any
        render: any
        app: any
        send: any
    }
}
