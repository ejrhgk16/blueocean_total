import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Pool, PoolConnection, createPool } from 'mysql2/promise';

@Injectable()
export class DbService {
  private pool: Pool;

  private readonly logger = new Logger();

  constructor(private configService: ConfigService) {
    this.pool = createPool({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
      const connection = await this.pool.getConnection();
      try {
          const [rows, fields] = await connection.query(query, params);

          return rows;
      } catch (error) {
          this.logger.error('Database query error: ' + query)
          throw error;
      } finally {
          connection.release();
      }
  }

  async executeQueryForShareConnection(connection, query: string, params: any[] = []): Promise<any> {
    try {
      const [rows, fields] = await connection.query(query, params);
     
      // console.log([rows, fields]);
      return rows;
    }catch(error){
      // console.log(error)
      this.logger.error('Database query error: ' + query)
      throw error
    }

  }


  async executeTransaction(callback: (connection: PoolConnection) => Promise<any>) {

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {

      const result =await callback(connection);

      await connection.commit();

      if(!result){
        return {msg:"executeTransaction success"}
      }

      return result
      
    } catch (error) {
      this.logger.error('Transaction failed ' +error.message)
      await connection.rollback();
      throw new InternalServerErrorException('Transaction failed');
    } finally {
      connection.release();
    }
  }

  async executeMultiQuery(callback: (connection: PoolConnection) => any) {
    const connection = await this.pool.getConnection();
    try {
      const result = await callback(connection);

      return result
    } catch (error) {
      console.log(error)
      this.logger.error('query failed '+ error.message)
      throw new InternalServerErrorException('query failed');
    } finally {
      connection.release();
    }
  }
}
