/**
 * Created by maraujo on 12/19/16.
 */
export interface IService<T> {
    create(object: T);

    update(object: T);

    deleteById(id: number);

    findById(id: number);
}