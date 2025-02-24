require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMessage, editMessage, removeMessage } = require('./bot');
const House = require('./models/House');
const userModel = require('./models/User');
const UserDto = require('./dtos/user.dto');
const cors = require('cors')
const tokenValidation = require('./middlewares/auth');
const FileService = require('./file')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
const Owners = require('./models/Owners')


const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(fileUpload({}))
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}))
app.use(express.json());
app.use(cookieParser({}))
app.use(express.static('static'))
app.use(bodyParser.json())

app.post('/api/create-user', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Все поля нужно заполнить" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Manager with this email already exists. Try another email" });
    }

    const hash = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({ fullName, email, password: hash, phone });

    return res.status(200).json({ user: createdUser, message: "Manager created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating user. Please try again later" });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Все поля нужно заполнить" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Мэнеджер с таким не найдет" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неправильный пароль" });
    }

    const userDTO = new UserDto(user);
    const accessToken = jwt.sign({ user: userDTO }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ message: "Вошли в систему", access_token: accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in. Please try again later" });
  }
});

app.get('/api/get-all-users', tokenValidation, async (req, res) => {
  try {
    const users = await userModel.find()
    return res.status(200).json({
      message: "Все пользователи найдены",
      users,
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in. Please try again later" });
  }
})

app.get('/api/get-user-info', tokenValidation, async (req, res) => {
  try {
    const { user } = req.user
    const foundedUser = await userModel.findById(user.id)
    return res.status(200).json({
      messaeg: "User information found successfuly",
      user: foundedUser
    })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in. Please try again later" });
  }
})

app.get('/api/get-user/:id', tokenValidation, async (req, res) => {
  try {
    const id = req.params.id
    const foundedUser = await userModel.findById(id)
    if (!foundedUser) {
      return res.status(400).json({
        message: "Manager not found",
      })
    }

    return res.status(200).json({
      message: "User found usccessfult",
      user: foundedUser
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Something went wrong. Pleace try again latter"
    })
  }
})


app.get('/api/get-house/:id', tokenValidation, async (req, res) => {
  try {
    const id = req.params.id
    const foundedHouse = await House.findById(id)
    return res.status(200).json({
      message: "Found successfuly",
      house: foundedHouse
    })

  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Pleace try again latter"
    })
  }
})

app.post('/api/create-house', tokenValidation, async (req, res) => {
  try {
    const { user } = req.user;
    const {
      repair,
      address,
      userViaOwner,
      valute,
      landmark,
      district,
      description,
      square,
      date,
      owner,
      floor,
      rooms,
      numberOfFloorOfTheBuildind,
      price,
      checkConditioner,
      tv,
      washingMaching,
      prepayment,
      deposit,
    } = req.body;

    console.log(Boolean(washingMaching));
    console.log(Boolean(tv));
    console.log(Boolean(deposit));
    console.log(Boolean(prepayment));
    console.log(Boolean(checkConditioner));

    let uploadedFiles = [];
    if (req.files && req.files['files[]']) {
      const files = Array.isArray(req.files['files[]']) ? req.files['files[]'] : [req.files['files[]']];
      uploadedFiles = await Promise.all(files.map(file => FileService.save(file)));
    }

    const foundedOwner = await Owners.findOne({ name: owner })

    const selectedDate = new Date(date);
    const parsetDate = selectedDate.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    const allHouses = await House.find();
    const newId = allHouses.length + 1;


    const message = `
✨✨✨ СДАЁТСЯ ✨✨✨

🆔 ID: ${newId}
👤 Сотрудник: ${user.fullName}

🏠 Район: ${district}
📍 Адрес: ${address}
📌 Ориентир: ${landmark}

Информация о квартире:
• Площадь: ${square} м²
• Количество комнат: ${rooms}
• Этаж: ${floor}
• Этажность: ${numberOfFloorOfTheBuildind}
• Ремонт: ${repair}
• Описание: ${description}

Удобства:
• Кондиционер: ${checkConditioner == 'true' ? 'Да' : 'Нет'}
• Телевизор: ${tv == 'true' ? 'Да' : 'Нет'}
• Стиральная машина: ${washingMaching == 'true' ? 'Да' : 'Нет'}

Способы оплаты:
💸 Предоплата: ${prepayment == 'true' ? 'Да' : 'Нет'}
💳 Депозит: ${deposit == 'true' ? 'Да' : 'Нет'}
💰 Цена: ${price}${valute}

📅 Дата: ${parsetDate}
`;

    const messageId = await sendMessage(message, uploadedFiles);
    const newHouse = await House.create({
      employee: user.id,
      address,
      landmark,
      district,
      description,
      square: Number(square),
      date,
      floor: Number(floor),
      rooms: Number(rooms),
      numberOfFloorOfTheBuildind: Number(numberOfFloorOfTheBuildind),
      price: Number(price),
      repair,
      owner: foundedOwner._id,
      userViaOwner,
      valute,
      checkConditioner,
      tv,
      washingMaching,
      prepayment,
      deposit,
      files: uploadedFiles,
      messageId,
      id: newId,
    });

    return res.status(200).json({ message: 'House created successfully', house: newHouse });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong. Try again later.' });
  }
});

app.put('/api/edit-house/:id', tokenValidation, async (req, res) => {
  try {
    const { id } = req.params
    const { repair, address, userViaOwner, valute, landmark, district, description, square, date, floor, rooms, numberOfFloorOfTheBuildind, price, checkConditioner, tv, washingMaching, prepayment, deposit } = req.body
    const { user } = req.user;
    const house = await House.findById(id)
    if (!repair || !address || !userViaOwner || !landmark || !valute || !district || !description || !square || !date || !floor || !rooms || !numberOfFloorOfTheBuildind || !price || !checkConditioner || !tv || !washingMaching || !prepayment || !deposit) {
      return res.status(400).json({
        message: "Все поля нужно ввести"
      })
    }

    const $date = new Date(date)
    const readableData = $date.toLocaleString('uz-UZ', {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    const edited = await House.findByIdAndUpdate(id, {
      repair,
      address,
      userViaOwner,
      landmark, valute, district, description, square, date, floor, rooms, numberOfFloorOfTheBuildind, price, checkConditioner, tv, washingMaching, prepayment, deposit
    }, {
      new: true
    })
    const message = `
✨✨✨ СДАЁТСЯ ✨✨✨

🆔 ID: ${house.id}
👤 Сотрудник: ${user.fullName}

🏠 Район: ${district}
📍 Адрес: ${address}
📌 Ориентир: ${landmark}

Информация о квартире:
• Площадь: ${square} м²
• Количество комнат: ${rooms}
• Этаж: ${floor}
• Этажность: ${numberOfFloorOfTheBuildind}
• Ремонт: ${repair}
• Описание: ${description}

Удобства:
• Кондиционер: ${checkConditioner == 'true' ? 'Да' : 'Нет'}
• Телевизор: ${tv == 'true' ? 'Да' : 'Нет'}
• Стиральная машина: ${washingMaching == 'true' ? 'Да' : 'Нет'}

Способы оплаты:
💸 Предоплата: ${prepayment == 'true' ? 'Да' : 'Нет'}
💳 Депозит: ${deposit == 'true' ? 'Да' : 'Нет'}
💰 Цена: ${price}${valute}

📅 Дата: ${readableData}
`;
    const response = await editMessage(message, house.messageId);
    return res.status(200).json({ message: "Вашы данные изменены.", house: edited, status: response });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

app.delete('/api/remove-house/:id', tokenValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHouse = await House.findByIdAndDelete(id);

    await removeMessage(deletedHouse.messageId)
    if (!deletedHouse) {
      return res.status(404).json({ message: "House not found" });
    }

    return res.status(200).json({ message: "House removed successfully", post: deletedHouse });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Something went wrong. Try again later." });
  }
});

app.get('/api/get-all-houses', async (req, res) => {
  try {
    const houses = await House.find().populate('employee').populate('owner')
    return res.status(200).json({
      message: "Houses found successfuly",
      data: houses
    })
  } catch (error) {
    console.log("Error", error)
    return res.status(500).json({ message: "Something went wrong. Try again later." })
  }
})

app.put('/api/filter-houses', async (req, res) => {
  try {
    const { id, repair, price, date, district, rooms, floor, userViaOwner, owner } = req.body;

    if (!id && !repair && !date && !price && !district && !rooms && !floor && !userViaOwner || !owner) {
      return res.status(400).json({ message: "No filter parameters provided" });
    }

    let filter = {};
    if (id && id !== '0') filter.id = id;
    if (repair) filter.repair = repair;
    if (price && price !== '0') filter.price = { $lte: Number(price) };
    if (date) filter.date = date;
    if (district) filter.district = district;
    if (rooms && rooms !== '0') filter.rooms = Number(rooms);
    if (floor && floor !== '0') filter.floor = Number(floor);
    if (userViaOwner) filter.userViaOwner = userViaOwner;

    const houses = await House.find(filter).populate('employee')

    return res.status(200).json({
      message: "Filter applied successfully",
      houses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Ошибка с сервером. Попытайтесь заново",
    });
  }
});

app.post('/api/create-owner', tokenValidation, async (req, res) => {
  try {
    const { name, phone } = req.body
    if (!name || !phone) {
      return res.status(400).json({
        message: "Все поля нужно ввести"
      })
    }

    // const isExistuser = await Owners.findOne({ phone })
    // if (isExistuser) {
    //   return res.status(400).json({
    //     message: "пользователь с этим именем "
    //   })
    // }
    const users = await Owners.find()
    const createduser = await Owners.create({ id: users.length + 1, name, phone: `+998 ${phone}` })

    return res.status(200).json({
      message: "Пользователь создан",
      owner: createduser
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong"
    })
  }
})

app.get('/api/get-owners', tokenValidation, async (req, res) => {
  try {
    const users = await Owners.find()
    return res.status(200).json({
      message: "пользователи найдены",
      owners: users
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Ошибка с серверос. Попытайтесь заново"
    })
  }
})
app.put('/api/filter-owners', tokenValidation, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const filter = {};

    if (name) filter.name = { $regex: name.trim(), $options: 'i' };
    if (phone) filter.phone = { $regex: phone.trim(), $options: 'i' };

    const foundOwners = await Owners.find(filter);

    return res.status(200).json({
      message: "Пользователи найдены",
      owners: foundOwners
    });

  } catch (error) {
    return res.status(500).json({
      message: "Ошибка сервера. Попробуйте снова"
    });
  }
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
