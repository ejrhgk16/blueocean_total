import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { RoleException } from 'src/common/error/error.customExceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    //store_code_arr 로사용하면될
    const { user, query, body, headers} = context.switchToHttp().getRequest();
    // console.log("store_code_arr ::: ",user.store_code_arr)

    // console.log("query ::: ", query)
    // console.log("body ::: ", body)
    // console.log("headers ::: ", headers)
    // console.log("store_code ::: ", headers.store_code)
    // console.log("current_page ::: ", headers.current_page)

    const store_code = headers.store_code
    const current_page = headers.current_page

    const checkAuthStoreCodeTF = user.store_code_arr.some(item => item.store_code === store_code);

    const checkAuthMenuTF = user.menuList.some(menu => {
      const { menu_path } = menu;

      if (!menu_path || !menu_path.includes('[code]')) return false;

      // [code] 기준으로 나누기
      const [base, afterCode] = menu_path.split('[code]');
      //console.log("afterCode : " , afterCode)
      if (!afterCode) return false;

      // 현재 페이지에 afterCode 포함 여부 체크
      if (current_page && current_page.includes(afterCode)) {
        // console.log("1233")
        return true
      }
      return false;
    });

    // console.log("checkAuthMenuTF : " , checkAuthMenuTF)


    if(user.role_type == 'client' && !checkAuthStoreCodeTF ){//store 권한체크
      throw new RoleException()
    }

    if(user.role_type == 'client' && !checkAuthMenuTF ){//메뉴 권한체크
      throw new RoleException()
    }
    
    //return requiredRoles == user.role;
    if(requiredRoles.some((role) => user.role_type.includes(role))){
      return true
    }else{
      throw new RoleException()
    }
  }
}