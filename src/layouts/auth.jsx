export default function auth({ children }) {
    return (
        <div className=" d-flex flex-column mt-4">
            <div className="page page-center">
                <div className="container container-tight py-4">
                    {children}
                </div>
            </div>
        </div>
    )
}