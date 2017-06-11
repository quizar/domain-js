
export interface IRepository<T> {
    create: (data: T) => Promise<T>
    update: (data: T) => Promise<T>
    remove: (id: string) => Promise<boolean>
}
