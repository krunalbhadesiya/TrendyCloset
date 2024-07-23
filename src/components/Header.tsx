"use client"; // Add this line if Header uses hooks

import React from 'react';
import Link from 'next/link';
import { HambergerMenu, ShoppingCart, User } from 'iconsax-react'; // Fixed spelling
import Image from 'next/image';
import { ShirtIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

type Role = 'guest' | 'user' | 'admin';

interface HeaderProps {
    role: Role;
}


const Header: React.FC<HeaderProps> = ({ role }) => {
    return (
        <header className="">

            {role === 'guest' && (
                <>
                    <div className='bg-background/80 backdrop-blur-sm sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between'>
                        <Link className="flex items-center gap-2" href="/">
                            <Image src="/Logo-Black.png" alt='logo' className='' width={24} height={24} />
                            <span className="font-semibold text-lg">Trendy Closet</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                            <Link href="/" className="hover:underline">Home</Link>
                            <Link href="/store" className="hover:underline">Store</Link>
                            <Link href="/contact" className="hover:underline">Contact Us</Link>
                            <Link href="/about" className="hover:underline">About Us</Link>
                            <Link href="/cart" className="hover:underline">
                                <ShoppingCart size="32" variant="Bulk" />
                            </Link>
                            <Link href="/auth" className="hover:underline">
                                <User variant='Bulk' />
                            </Link>
                        </nav>

                        <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 md:hidden">
                            <HambergerMenu size="32" variant="Bulk" />
                            <span className="sr-only">Toggle Menu</span>
                        </button>
                    </div>
                </>
            )
            }
            {
                role === 'user' && (
                    <>
                        <div className='bg-background/80 backdrop-blur-sm sticky top-0 z-50 px-4 md:px-6 py-3 flex items-center justify-between'>
                            <Link className="flex items-center gap-2" href="/">
                                <Image src="/Logo-Black.png" alt='logo' className='' width={24} height={24} />
                                <span className="font-semibold text-lg">Trendy Closet</span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                                <Link href="/" className="hover:underline">Home</Link>
                                <Link href="/store" className="hover:underline">Store</Link>
                                <Link href="/contact" className="hover:underline">Contact Us</Link>
                                <Link href="/about" className="hover:underline">About Us</Link>
                                <Link href="/cart" className="hover:underline">Cart</Link>
                                <Link href="/user/profile" className="hover:underline">Profile</Link>
                                <Link href="/user/order" className="hover:underline">Order</Link>
                                <Link href="/logout" className="hover:underline">Logout</Link>
                            </nav>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 md:hidden">
                                <HambergerMenu size="32" variant="Bulk" />
                                <span className="sr-only">Toggle Menu</span>
                            </button>
                        </div>
                    </>
                )
            }
            {
                role === 'admin' && (
                    <>
                        <div className='bg-background/80 backdrop-blur-sm px-4 md:px-6 py-3 flex items-center justify-between'>
                            <Link href="#" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                                <Image src="/Logo-Black.png" alt='logo' className='' width={24} height={24} />
                                <span className="font-semibold text-lg">Trendy Closet</span>
                            </Link>
                            <div className="font-bold text-lg">Dashboard</div>
                            <div className=" flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                                            <img
                                                src="/user-avtar.png"
                                                width={36}
                                                height={36}
                                                alt="Avatar"
                                                className="overflow-hidden rounded-full"
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                        <DropdownMenuItem>Support</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </>
                )
            }
        </header >
    );
};

export default Header;
