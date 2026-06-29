import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, QueryDeepPartialEntity, Repository } from 'typeorm';
export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
  ) {}


  async create(entity: DeepPartial<T>): Promise<T> {
    const data = this.repository.create(entity);
    return this.repository.save(data);
  }


  async findAll(options?:FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }


  async findOne(options:FindOneOptions<T>): Promise<T | null> {
    return await this.repository.findOne(options);
  }


  async findBy(
    where: FindOptionsWhere<T>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where,
    });
  }



  async update(
    id: string,
    entity: QueryDeepPartialEntity<T>,
  ): Promise<T | null> {
    await this.repository.update(id, entity);

    return this.findBy({
        id,
    } as unknown as FindOptionsWhere<T>);
  }


  async remove(id: string) {
     return await this.repository.delete(id);
  }


   async exists(
    where: FindOptionsWhere<T>,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where,
    });

    return count > 0;
  }


}