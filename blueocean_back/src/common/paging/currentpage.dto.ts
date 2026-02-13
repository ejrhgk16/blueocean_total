export class CurrentPageInfo {

    	
	/* 현재 페이지 */
	pageNum : number;
    
	
	/* 한 페이지 당 보여질 게시물 갯수 */
	public readonly row_amount : number = 30;
    
    /* 보여질 페이지번호 갯수 */
    public readonly page_amount : number = 5;
	
	/* 스킵 할 게시물 수( (pageNum-1) * amount ) */
	private skip : number;
	
	/* 검색어 키워드 */
	private keyword : string;
	
	/* 검색 타입 */
	private type : string;
	
	/* 검색 타입 배열 */
	private typeArr : string[] ;
	

    constructor(pageNum : number){
        this.pageNum = pageNum;
    }

    
}