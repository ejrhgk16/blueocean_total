import { CurrentPageInfo } from "./currentpage.dto";

export class PagingDto {

    /* 시작 페이지 */
	readonly startPage : number;

    keyword : string
	
	/* 끝 페이지 */
	readonly endPage : number;
	
	/* 이전 페이지, 다음 페이지 존재유무 */
	readonly prevTF : boolean
    readonly nextTF : boolean
	
	/*전체 게시물 수*/
	private readonly total : number;

    	/* 현재 페이지 */
    readonly pageNum : number;
	
	/* 한 페이지 당 보여질 게시물 갯수 */
	readonly row_amount : number = 30;
    
    /* 보여질 페이지번호 갯수 */
    readonly page_amount : number = 4;

    constructor(pageNum : number = 1, total : number, keyword:string = ''){
        
        this.pageNum = pageNum;
        this.total = total
        this.keyword = keyword

        this.endPage = (Number)(Math.ceil(this.pageNum/this.page_amount))*this.page_amount;
        this.startPage = this.endPage - (this.page_amount -1)

        const realEnd = (Number)(Math.ceil(total * 1.0/this.row_amount));
		
		/* 전체 마지막 페이지(realend)가 화면에 보이는 마지막페이지(endPage)보다 작은 경우, 보이는 페이지(endPage) 값 조정 */
		if(realEnd < this.endPage) {
			this.endPage = realEnd;
		}

		this.prevTF = this.startPage > 1;
		
		/* 마지막 페이지(endPage)값이 1보다 큰 경우 true */
		this.nextTF = this.endPage < realEnd;
		



    }

    
}