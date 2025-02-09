'use client';

import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/navbar';
import { ChildProps } from '@/types';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Plus } from 'lucide-react';
import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const MainLayout = ({ children }: ChildProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex  ">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="w-full flex justify-between items-center p-4 pr-10 shadow-md">
            <div className='flex items-center space-x-2'>
              <SidebarTrigger />
              <h1 className="text-lg font-bold">MyHomeGroup</h1>
            </div>
            <div className='flex space-x-5'>
              <ModeToggle />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="border">Profile</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='flex flex-col  '>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Профиль</button>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Выйти</button>
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            <main>
              {children}
            </main>
          </div>
        </div>
        <Dialog>
          <DialogTrigger className="absolute left-[95%] top-[90%] border p-3 rounded-xl hover:bg-slate-900 transition-all z-50">
            <Plus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую квартиру</DialogTitle>
              <DialogDescription asChild>
                <div className=''>
                  <form className=''>
                    <div className='max-h-[500px] px-3 py-5 overflow-y-scroll space-y-4'>
                      <div>
                        <label className="block text-sm font-medium">Ремонт</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="old">Старый</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Пользователь как владелец</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите владельца пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user1">Пользователь 1</SelectItem>
                            <SelectItem value="user2">Пользователь 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Владелец</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите владельца квартиры" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner1">Владелец 1</SelectItem>
                            <SelectItem value="owner2">Владелец 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Район</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="district1">Район 1</SelectItem>
                            <SelectItem value="district2">Район 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Адрес</label>
                        <Input type="text" placeholder="Введите адрес" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Ориентир</label>
                        <Input type="text" placeholder="Введите ориентир" />
                      </div>


                      <div>
                        <label className="block text-sm font-medium">Количество комнат</label>
                        <Input type="number" min="1" placeholder="Введите количество комнат" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Этаж</label>
                        <Input type="number" min="1" placeholder="Введите этаж" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Этажность здания</label>
                        <Input type="number" min="1" placeholder="Введите этажность здания" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Площадь</label>
                        <Input type="number" min="1" placeholder="Введите площадь кв.м" />
                      </div>

                      <div className='flex flex-col space-y-5'>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="conditioner" />
                          <label
                            htmlFor="conditioner"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Кондиционер
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tv" />
                          <label
                            htmlFor="tv"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Телевизор
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="Washing-machine" />
                          <label
                            htmlFor="Washing-machine"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Стиральная машина
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="prepayment" />
                          <label
                            htmlFor="prepayment"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Предоплата
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="deposit" />
                          <label
                            htmlFor="deposit"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Депозит
                          </label>
                        </div>
                        <div >
                          <label
                            htmlFor="deposit"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Описание
                          </label>
                          <Textarea placeholder='"Ведтье описание дома' />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Цена</label>
                          <Input type="number" placeholder="Введите цену" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Валюта</label>
                          <Input type="number" placeholder="Введите цену" />
                        </div>
                      </div>

                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Отмена</Button>
                      <Button type="submit">Создать</Button>
                    </div>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
