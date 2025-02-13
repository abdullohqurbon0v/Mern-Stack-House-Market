'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Edit, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { fetchData } from '@/http/api';
import { IHouse } from '@/types';
import { useHouseStore } from '@/store/houses';
import { useUser } from '@/store/user';
import moment from 'moment'

const MainPage = () => {
  const { user } = useUser()
  const { houses, setAllHouses } = useHouseStore()
  const router = useRouter();
  const [date, setDate] = useState<Date>()
  const [data, setData] = useState<IHouse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }
    const getHouses = async () => {
      const response = await fetchData.get('/get-all-houses')

      console.log(response)
      setData(response.data.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      setTotalItems(response.data.data.length);
      console.log(data)
      setAllHouses(response.data.data)
    }
    getHouses()
    console.log("render")
  }, [router, currentPage, itemsPerPage, setAllHouses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = (totalPages: number, currentPage: number) => {
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };


  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <div className='flex items-center space-x-5'>
          <Button color={''}>Очистить фильтр</Button>
          <p>Интервал: 1 - {totalItems}</p>
          <p>Всего: {totalItems}</p>
        </div>
        <div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} href='#' />
              </PaginationItem>
              {getVisiblePages(totalPages, currentPage).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    href='#'
                    className={currentPage === page ? 'font-bold text-blue-500' : ''}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

        </div>
      </div>
      <form>
        <Table>
          <TableCaption>Список квартир</TableCaption>
          <TableHeader>
            <TableRow className='p-5'>
              <TableHead className='p-5'>
                <div>
                  <p>ИД</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead className='pb-9'>Изображение</TableHead>
              <TableHead>
                <div>
                  <p>Дата доступности</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[200px] justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {date ? format(date, 'PPP') : <span>Выберите дату</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Ремонт</p>
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Тип ремонта</SelectLabel>
                        <SelectItem value='euro'>Евро ремонт</SelectItem>
                        <SelectItem value='cosmetic'>Косметический</SelectItem>
                        <SelectItem value='none'>Без ремонта</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Цена</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Район</p>
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Район</SelectLabel>
                        <SelectItem value='mirzo'>Мирзо Улугбек</SelectItem>
                        <SelectItem value='yakkasaray'>Яккасарай</SelectItem>
                        <SelectItem value='shaykhantahur'>Шайхантахур</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Комнаты</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Этаж</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Сотрудник</p>
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Владелец</SelectLabel>
                        <SelectItem value='ikhtiyor'>Ихтиёр</SelectItem>
                        <SelectItem value='okhramon'>Охрамон</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.length === 0 ? (
              <TableRow className='text-center'>
                <TableCell>Загрузка...</TableCell>
              </TableRow>
            ) : data.map((item) => (
              <TableRow key={item.id} className='text-center'>
                <TableCell className='font-medium'>{item.id}</TableCell>
                <TableCell>
                  {item.files && item.files.length > 0 ? (
                    <Image
                      src={`https://53e5-213-230-78-183.ngrok-free.app/${item.files[0]}`}
                      alt={`Image ${item.id}`}
                      className='w-[80px] h-[50px] rounded border object-cover'
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div>Нет изображения</div>
                  )}
                </TableCell>
                <TableCell>{moment(item.date).format("DD.MM.YYYY")}</TableCell>
                <TableCell>{item.repair}</TableCell>
                <TableCell className='uppercasex'>{`${item.price.toFixed(2)} ${item.valute}`}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.rooms}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.employee.fullName}</TableCell>
                <TableCell>{user && item.employee._id === user._id ? (
                  <div className='flex space-x-3 items-center'>
                    <Button variant={'outline'}><Edit /></Button>
                    <Button variant={'outline'}>J<Send /></Button>
                    <Button variant={'outline'}>T<Send /></Button>
                  </div>
                ) : null}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </form>
    </div>
  );
};

export default MainPage;
