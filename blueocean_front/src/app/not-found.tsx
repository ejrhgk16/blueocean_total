import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <p>존재하지않는 페이지입니다</p>
      <Link href="/">[홈으로 돌아가기]</Link>
    </div>
  )
}