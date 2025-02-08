'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Home } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Image from 'next/image';

const MainPage = () => {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }

    // Example data - you can replace this with actual API data or other dynamic sources
    const fetchedData = [
      {
        id: 8237,
        imageUrl: '/path-to-image1.jpg',
        availabilityDate: '7.2.2025',
        repair: 'Евро ремонт',
        price: 400,
        district: 'Мирзо Улугбек',
        rooms: 2,
        floor: 1,
        employee: 'Аллакулов Ихтиёр',
        owner: '+998505510123',
      },
      {
        id: 8236,
        imageUrl: '/path-to-image2.jpg',
        availabilityDate: '7.2.2025',
        repair: 'Евро ремонт',
        price: 1200,
        district: 'Яккасарай',
        rooms: 4,
        floor: 5,
        employee: 'Нурматов Охрамон',
        owner: '+998989900520',
      },
    ];

    setData(fetchedData);
  }, [router]);

  return (
    <div>
      <form>
        <Table>
          <TableCaption>Список квартир</TableCaption>
          <TableHeader>
            <TableRow className="p-5">
              <TableHead className="p-5">
                <div>
                  <p>ИД</p>
                  <Input
                    className="w-[100px] p-1 text-black dark:text-white border rounded"
                    type="number"
                    placeholder="Фильтр"
                  />
                </div>
              </TableHead>
              <TableHead className="pb-9">Изображение</TableHead>
              <TableHead>
                <div>
                  <p>Дата доступности</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Выберите дату</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
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
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Цена</p>
                  <Input
                    className="w-[100px] p-1 text-black dark:text-white border rounded"
                    type="number"
                    placeholder="Фильтр"
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Район</p>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Комнаты</p>
                  <Input
                    className="w-[100px] p-1 text-black dark:text-white border rounded"
                    type="number"
                    placeholder="Фильтр"
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Этаж</p>
                  <Input
                    className="w-[100px] p-1 text-black dark:text-white border rounded"
                    type="number"
                    placeholder="Фильтр"
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Сотрудник</p>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Владелец</p>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <Image
                    src={item.imageUrl}
                    alt={`Image ${item.id}`}
                    className="w-[80px] h-[50px] rounded border"
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell>{item.availabilityDate}</TableCell>
                <TableCell>{item.repair}</TableCell>
                <TableCell>{`$${item.price.toFixed(2)}`}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.rooms}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.employee}</TableCell>
                <TableCell>{item.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

export default MainPage;
