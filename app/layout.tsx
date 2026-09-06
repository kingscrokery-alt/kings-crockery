import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Kings Crockery | A beautiful table, every day',description:'Discover crockery, ceramics, flatware and table essentials. Confirm your order with a Rs 250 advance and order through WhatsApp.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
