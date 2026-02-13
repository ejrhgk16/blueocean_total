import { Inject, Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { error } from 'console';
import { Pool, PoolConnection, createPool } from 'mysql2/promise';
import { BlockRepository } from './block.repository';
import {CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { compareSync } from 'bcrypt';



@Injectable()
export class BlockService implements OnModuleInit {

  private readonly BLOCK_IP_CACHE_KEY = 'block_ip_list';

  constructor(@Inject(CACHE_MANAGER)private cacheManager: Cache, private readonly blockRepostory : BlockRepository ) {}

  async onModuleInit() {
    // 모듈 초기화 시 실행할 로직

    const blockIpList = await this.blockRepostory.getBlockIpList();

    await this.cacheManager.set(this.BLOCK_IP_CACHE_KEY, blockIpList.map(item => item.block_ip), 0)
    
    const blockIpList2: string[] = await this.cacheManager.get(this.BLOCK_IP_CACHE_KEY);
  }

  async checkIsBlockIp(ip: string): Promise<boolean> {
    
    if(ip){
      const blockIpList: string[] = await this.cacheManager.get(this.BLOCK_IP_CACHE_KEY);
      return blockIpList.includes(ip);
    }else return false

  }


  async getBlockListService(param): Promise<any>{
    const rows = await this.blockRepostory.getBlockIpList()
    return rows
  }

  
  async updateBlockListService(param): Promise<any>{
    const rows = await this.blockRepostory.updateBlockIpList(param)
    const blockIpList = await this.blockRepostory.getBlockIpList()

    await this.cacheManager.set(this.BLOCK_IP_CACHE_KEY, blockIpList.map(item => item.block_ip), 0)

    const blockIpList2: string[] = await this.cacheManager.get(this.BLOCK_IP_CACHE_KEY);
    console.log("blockIpList2", blockIpList2)

    return rows
  }

}
