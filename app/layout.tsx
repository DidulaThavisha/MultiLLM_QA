import "./global.css"

export const metadata = {
    title: "F1 GPT",
    description: "The place to find all the information about the F1 season",
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en" data-arp="">    
            <body>
                {children}
            </body>
        </html>
    )
}

export default RootLayout