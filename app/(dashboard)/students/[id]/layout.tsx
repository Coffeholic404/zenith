
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className=' bg-white rounded-[21px] p-6'>
            {children}
        </div>
    )
}