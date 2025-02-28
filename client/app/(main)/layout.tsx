'use client';
import AppSidebar from '@/components/shared/navbar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChildProps } from '@/types';
import { useEffect, useState } from 'react';

import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList
} from "@/components/ui/breadcrumb";
import { fetchData } from '@/http/api';
import { useUser } from '@/store/user';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';


const MainLayout = ({ children }: ChildProps) => {
  const { user, setUserStore } = useUser()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('')
  useEffect(() => {
    setIsMounted(true);
    const getUserInfo = async () => {
      const res = await fetchData.get('/get-user-info')
      console.log("User info", res)
      setUserStore(res.data.user)
    }
    getUserInfo()
  }, [setUserStore]);

  const onLogout = () => {
    localStorage.clear()
    router.push('/signin')
  }

  useEffect(() => {
    console.log(window.location.pathname)
    const loc = window.location.pathname
    setLocation(loc)
  }, [])

  if (!isMounted) return null;



  return (
    <div className="min-h-screen flex  ">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="max-w-full flex justify-between items-center p-4 pr-10 shadow-md">
            <div className='flex items-center space-x-2'>
              <SidebarTrigger />
              <h1 className="text-lg font-bold">MyHomeGroup</h1>
            </div>
            <div className='flex space-x-5'>
              <ModeToggle />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="border">{user && user.fullName}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='flex flex-col  '>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Профиль</button>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all' onClick={onLogout}>Выйти</button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </header>

          <div className="p-6 flex-1 space-y-5"><Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/"><Home /></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{location}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            <main>
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
