
const XButtonWithName: React.FC<{item:any, onClickButtonfnc:any}> = ({item, onClickButtonfnc}) => {

    const onClickFnc = (item :any) => {
        onClickButtonfnc(item);
    };

    return (
        
        <div className="my-1.5 flex items-center justify-center rounded border-[.5px] border-stroke bg-gray px-2.5 py-1.5 text-sm font-medium dark:border-strokedark dark:bg-white/30" onClick={()=>onClickFnc(item)} id={item.id}>
            <div className="max-w-full flex-initial">{item.text}</div>
            <div className="flex flex-auto flex-row-reverse">
            <div className="cursor-pointer pl-2 hover:text-danger">
                <svg className="fill-current" role="button" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z" fill="currentColor">
                    </path></svg></div></div>
                    
        </div>

    )
}

export default XButtonWithName;